import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = ((params.email as string) || "").trim().toLowerCase();
        const user: { email: string; name?: string; phone?: string } = { email };
        const name = (params.name as string) || (params.fullName as string);
        if (name && typeof name === "string" && name.trim()) {
          user.name = name.trim();
        }
        const phone = params.phone as string;
        if (phone && typeof phone === "string" && phone.trim()) {
          user.phone = phone.trim();
        }
        return user;
      },
      reset: Email({
        id: "email-reset",
        async sendVerificationRequest({ identifier: email, token }) {
          const resendApiKey = process.env.RESEND_API_KEY;
          const siteUrl =
            process.env.SITE_URL ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://qatify.qa";
          const resetUrl = `${siteUrl}/reset-password?code=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

          console.log(`[Password Reset] Dispatched reset link for ${email}: ${resetUrl} (Code: ${token})`);

          if (!resendApiKey) {
            console.warn("[Password Reset] RESEND_API_KEY not configured. Reset link logged to console.");
            return;
          }

          const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset Your Qatify Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
          <tr>
            <td style="background-color: #0a0a0c; padding: 20px 24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 12px;">
                    <img src="https://mellow-puma-618.eu-west-1.convex.cloud/api/storage/kg2bvtt5c9jz56hv42td27x8318h40pk" width="36" height="36" alt="Qatify" style="display: block; border-radius: 8px;" />
                  </td>
                  <td valign="middle">
                    <span style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">QATIFY<span style="color: #facc15;">.QA</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px 24px 28px;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0a0a0c;">
                Reset Your Password
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #52525b; line-height: 1.6;">
                We received a request to reset the password for your Qatify account (<strong>${email}</strong>). Click the button below to set a new password.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #FF6D00; border-radius: 8px;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
                <div style="font-size: 12px; color: #64748b; margin-bottom: 6px; font-weight: 600; text-transform: uppercase;">
                  Or enter this Reset Code in Qatify:
                </div>
                <div style="font-size: 26px; font-weight: 900; letter-spacing: 4px; color: #0a0a0c; font-family: monospace;">
                  ${token}
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
                  This code expires in 1 hour.
                </div>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f1f3f5; padding: 16px 28px; font-size: 12px; color: #a1a1aa; text-align: center;">
              Qatify Qatar • Direct Air Express Marketplace • Doha, Qatar
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `;

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "Qatify Qatar <onboarding@resend.dev>",
              to: [email],
              subject: "Reset Your Qatify Password 🇶🇦",
              html: emailHtml,
              text: `Reset your Qatify password: ${resetUrl}\n\nYour reset code is: ${token}\n(Expires in 1 hour)`,
              reply_to: "support@qatify.qa",
            }),
          });

          if (!res.ok) {
            const errBody = await res.text();
            console.error(`[Password Reset] Resend API error: ${errBody}`);
          } else {
            console.log(`[Password Reset] Reset email successfully dispatched to ${email}`);
          }
        },
      }),
    }),
  ],
});

