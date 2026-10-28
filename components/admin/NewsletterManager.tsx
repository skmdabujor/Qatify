'use client';

// =============================================================================
// Qatify — Admin VIP Newsletter & Deals Dispatch Manager
// Allows store owners to inspect newsletter subscriber leads, preview branded
// email drops, dispatch test newsletters via Resend, and broadcast VIP promotions.
// =============================================================================

import React, { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Users,
  Tag,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export function NewsletterManager() {
  // Subscribers Query
  const subscribers = useQuery(api.newsletter.listSubscribers, {
    adminEmail: 'sheakmohammadabujor@gmail.com',
  });

  // Actions & Queries
  const sendTestNewsletter = useAction(api.newsletter.sendTestNewsletter);
  const previewHtml = useQuery(api.newsletter.previewNewsletterHtml, {
    promoCode: 'WELCOME10',
    recipientEmail: 'sheakmohammadabujor@gmail.com',
  });

  // Form & Dispatch State
  const [recipientEmail, setRecipientEmail] = useState('sheakmohammadabujor@gmail.com');
  const [promoCode, setPromoCode] = useState('WELCOME10');
  const [subjectLine, setSubjectLine] = useState(
    '✨ Qatify VIP Qatar: 10% Off + Direct Hamad Air Express Drops 🇶🇦'
  );
  const [isSending, setIsSending] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Status Feedback
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    emailId?: string;
  } | null>(null);

  // Handle Dispatch Test Newsletter
  const handleSendTest = async (overrideEmail?: string) => {
    const target = (overrideEmail || recipientEmail).trim();
    if (!target) {
      setFeedback({
        type: 'error',
        message: 'Please provide a valid recipient email address.',
      });
      return;
    }

    try {
      setIsSending(true);
      setFeedback(null);

      const result = await sendTestNewsletter({
        recipientEmail: target,
        promoCode: promoCode.trim().toUpperCase(),
        subject: subjectLine.trim(),
      });

      if (result.success) {
        setFeedback({
          type: 'success',
          message: `VIP Newsletter dispatched to ${result.recipient}! Check your inbox.`,
          emailId: result.emailId,
        });
      } else {
        setFeedback({
          type: 'error',
          message: result.error || result.message || 'Failed to dispatch test newsletter.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Exception during dispatch: ${String(err)}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyPromo = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e4e4e7',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid #f1f3f5',
          paddingBottom: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#e06c2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(224, 108, 42, 0.25)',
            }}
          >
            <Mail size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0a0a0c' }}>
                VIP Newsletter &amp; Qatar Deals Engine
              </h3>
              <span
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} /> Qatar Edition
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#71717a' }}>
              Dispatch promotional deal blasts, review subscriber leads, and trigger live Resend email tests
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#18181b',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <Eye size={15} />
            Live Preview
          </button>

          <button
            type="button"
            onClick={() => handleSendTest()}
            disabled={isSending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#e06c2a',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#ffffff',
              cursor: isSending ? 'not-allowed' : 'pointer',
              opacity: isSending ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(224, 108, 42, 0.3)',
            }}
          >
            {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {isSending ? 'Sending...' : 'Send Test Newsletter'}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor:
              feedback.type === 'success'
                ? '#ecfdf5'
                : feedback.type === 'error'
                  ? '#fef2f2'
                  : '#f0fdf4',
            color:
              feedback.type === 'success'
                ? '#065f46'
                : feedback.type === 'error'
                  ? '#991b1b'
                  : '#166534',
            border: `1px solid ${
              feedback.type === 'success'
                ? '#a7f3d0'
                : feedback.type === 'error'
                  ? '#fecaca'
                  : '#bbf7d0'
            }`,
          }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div style={{ flex: 1 }}>
            <div>{feedback.message}</div>
            {feedback.emailId && (
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  marginTop: '4px',
                  opacity: 0.85,
                }}
              >
                Resend Delivery ID: <strong>{feedback.emailId}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Dispatch Configuration & KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Card 1: Dispatch Controls */}
        <div
          style={{
            backgroundColor: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 800,
              color: '#0a0a0c',
              marginBottom: '14px',
            }}
          >
            <Send size={16} color="#e06c2a" />
            <span>Instant Test Dispatch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#52525b',
                  marginBottom: '4px',
                }}
              >
                Target Recipient Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="sheakmohammadabujor@gmail.com"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d4d4d8',
                  fontSize: '13px',
                  color: '#0a0a0c',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#52525b',
                    marginBottom: '4px',
                  }}
                >
                  Promo Voucher
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d4d4d8',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#0a0a0c',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={copyPromo}
                    title="Copy Promo Code"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: copiedCode ? '#059669' : '#71717a',
                    }}
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#52525b',
                    marginBottom: '4px',
                  }}
                >
                  Delivery Gateway
                </label>
                <div
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d4d4d8',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={14} /> Resend REST API
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#52525b',
                  marginBottom: '4px',
                }}
              >
                Subject Line
              </label>
              <input
                type="text"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d4d4d8',
                  fontSize: '13px',
                  color: '#0a0a0c',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Subscriber Lead Highlights & Resend Architecture */}
        <div
          style={{
            backgroundColor: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 800,
                color: '#0a0a0c',
                marginBottom: '14px',
              }}
            >
              <Users size={16} color="#059669" />
              <span>Subscriber Leads Overview</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e4e4e7',
                }}
              >
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>
                  Active Leads
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#0a0a0c',
                    marginTop: '4px',
                  }}
                >
                  {subscribers ? subscribers.length : <Loader2 size={18} className="animate-spin" />}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e4e4e7',
                }}
              >
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>
                  Active Promo Code
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#e06c2a',
                    fontFamily: 'monospace',
                    marginTop: '6px',
                  }}
                >
                  {promoCode}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              color: '#334155',
              lineHeight: 1.5,
            }}
          >
            <strong>💡 Testing Delivery Note:</strong> Resend is currently using{' '}
            <code style={{ color: '#0f172a', fontWeight: 700 }}>onboarding@resend.dev</code>. Live
            tests deliver instantly to your verified admin email (
            <code style={{ color: '#0f172a', fontWeight: 700 }}>
              sheakmohammadabujor@gmail.com
            </code>
            ). To send to any customer domain, verify a custom domain at resend.com.
          </div>
        </div>
      </div>

      {/* Subscriber Leads Table */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0a0a0c' }}>
            Registered VIP Subscribers ({subscribers ? subscribers.length : '...'})
          </h4>
          <span style={{ fontSize: '12px', color: '#71717a' }}>
            Popups &amp; Footer newsletter signups
          </span>
        </div>

        <div
          style={{
            border: '1px solid #e4e4e7',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>Email</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>Source</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>
                  Subscribed Date
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    fontWeight: 700,
                    color: '#475569',
                    textAlign: 'right',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers === undefined ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>
                    <Loader2 size={18} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
                    Loading subscriber leads...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>
                    No newsletter subscribers found yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr
                    key={sub._id}
                    style={{
                      borderBottom: '1px solid #f1f3f5',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0a0a0c' }}>
                      {sub.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {sub.source || 'website'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                      {new Date(sub.subscribedAt || sub._creationTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setRecipientEmail(sub.email);
                          handleSendTest(sub.email);
                        }}
                        disabled={isSending}
                        style={{
                          background: 'none',
                          border: '1px solid #e4e4e7',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#e06c2a',
                          cursor: 'pointer',
                        }}
                      >
                        Send Newsletter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Live Responsive HTML Preview */}
      {isPreviewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e4e4e7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#0a0a0c',
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={18} color="#facc15" />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                  Live Newsletter Email Preview
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Iframe Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#f4f4f5' }}>
              {previewHtml ? (
                <iframe
                  title="Newsletter Email Preview"
                  srcDoc={previewHtml}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #d4d4d8',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                  Loading newsletter email preview...
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid #e4e4e7',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                backgroundColor: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d4d4d8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleSendTest();
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#e06c2a',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Send This Newsletter Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

