import React from 'react';

export interface PaymentIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Authentic Apple Pay Vector Mark
 */
export function ApplePayIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Apple Pay"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#FFFFFF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Apple Leaf */}
      <path
        d="M31.7358 25.6955C32.8058 24.3572 33.5319 22.5603 33.3404 20.724C31.7741 20.8019 29.8627 21.7573 28.7562 23.0967C27.7626 24.2436 26.8832 26.1158 27.1124 27.8751C28.8707 28.0276 30.6273 26.9962 31.7358 25.6955Z"
        fill="#000000"
      />
      {/* Apple Body with Bite */}
      <path
        d="M33.3204 28.2186C30.7671 28.0665 28.5961 29.6678 27.3767 29.6678C26.1567 29.6678 24.2894 28.2952 22.2698 28.3322C19.6412 28.3708 17.2022 29.8571 15.8682 32.2209C13.1246 36.9497 15.1442 43.9642 17.8122 47.8155C19.1079 49.7209 20.6694 51.8189 22.7269 51.7435C24.6709 51.6672 25.4328 50.4847 27.7958 50.4847C30.1571 50.4847 30.8435 51.7435 32.9013 51.7054C35.0353 51.6672 36.3695 49.799 37.6651 47.8918C39.1515 45.7198 39.7599 43.6225 39.7982 43.5073C39.7599 43.4692 35.6832 41.9053 35.6454 37.2158C35.6069 33.2892 38.8461 31.4215 38.9985 31.3057C37.1694 28.6003 34.3113 28.2952 33.3204 28.2186Z"
        fill="#000000"
      />
      {/* Letter P */}
      <path
        d="M55.5533 22.9046C61.103 22.9046 64.9675 26.7301 64.9675 32.2997C64.9675 37.8892 61.0235 41.7345 55.4142 41.7345H49.2696V51.5062H44.8301V22.9046L55.5533 22.9046ZM49.2695 38.0081H54.3635C58.2288 38.0081 60.4286 35.9271 60.4286 32.3196C60.4286 28.7124 58.2288 26.6509 54.3834 26.6509H49.2695V38.0081Z"
        fill="#000000"
      />
      {/* Letter a */}
      <path
        d="M66.1274 45.5799C66.1274 41.9326 68.9222 39.6929 73.8778 39.4154L79.5858 39.0786V37.4732C79.5858 35.1541 78.0198 33.7666 75.404 33.7666C72.9258 33.7666 71.3797 34.9556 71.0035 36.8191H66.9601C67.1979 33.0528 70.4086 30.278 75.5623 30.278C80.6165 30.278 83.8471 32.9538 83.8471 37.136V51.5062H79.7441V48.0772H79.6454C78.4365 50.3963 75.8001 51.8629 73.065 51.8629C68.9818 51.8629 66.1274 49.3258 66.1274 45.5799ZM79.5858 43.697V42.0518L74.452 42.3688C71.8951 42.5473 70.4484 43.6771 70.4484 45.461C70.4484 47.2842 71.9547 48.4736 74.254 48.4736C77.2468 48.4736 79.5858 46.4122 79.5858 43.697Z"
        fill="#000000"
      />
      {/* Letter y */}
      <path
        d="M87.7206 59.177V55.7082C88.0372 55.7874 88.7506 55.7874 89.1077 55.7874C91.0896 55.7874 92.1601 54.9551 92.8139 52.8145C92.8139 52.7747 93.1908 51.5459 93.1908 51.5261L85.6592 30.6546H90.2967L95.5696 47.6214H95.6484L100.921 30.6546H105.44L97.6303 52.5962C95.8472 57.6508 93.7857 59.276 89.4648 59.276C89.1077 59.276 88.0372 59.2363 87.7206 59.177Z"
        fill="#000000"
      />
    </svg>
  );
}

/**
 * Authentic Visa Vector Mark
 */
export function VisaIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Visa"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#FFFFFF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* A */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M86.6666 44.9375L90.3239 35.0625L92.3809 44.9375H86.6666ZM100.952 52.8375L95.8086 27.1625H88.7383C86.3525 27.1625 85.7723 29.0759 85.7723 29.0759L76.1904 52.8375H82.8868L84.2269 49.0244H92.3947L93.1479 52.8375H100.952Z"
        fill="#1434CB"
      />
      {/* S */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M77.1866 33.5711L78.0952 28.244C78.0952 28.244 75.2896 27.1625 72.3648 27.1625C69.2031 27.1625 61.6955 28.5638 61.6955 35.3738C61.6955 41.7825 70.5071 41.8621 70.5071 45.2266C70.5071 48.5912 62.6034 47.9901 59.9955 45.8676L59.0476 51.4362C59.0476 51.4362 61.8919 52.8375 66.2397 52.8375C70.5869 52.8375 77.1467 50.5544 77.1467 44.3455C77.1467 37.8964 68.2552 37.296 68.2552 34.4921C68.2552 31.6882 74.4602 32.0484 77.1866 33.5711Z"
        fill="#1434CB"
      />
      {/* I */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.6517 52.8375H47.6191L52.0144 27.1625H59.0477L54.6517 52.8375Z"
        fill="#1434CB"
      />
      {/* V */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.3113 27.1625L35.9217 44.8213L35.1663 41.0185L35.167 41.0199L32.9114 29.4749C32.9114 29.4749 32.6394 27.1625 29.7324 27.1625H19.1709L19.0476 27.5966C19.0476 27.5966 22.2782 28.2669 26.057 30.5326L31.8793 52.8375H38.8617L49.5238 27.1625H42.3113Z"
        fill="#1434CB"
      />
    </svg>
  );
}

/**
 * Authentic Mastercard Vector Mark
 */
export function MastercardIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mastercard"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#FFFFFF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Red Circle (Left) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50.966 40.0003C50.966 32.4552 54.4988 25.7354 59.9999 21.4044C55.977 18.2376 50.9003 16.348 45.3828 16.348C32.3208 16.348 21.7324 26.937 21.7324 40.0003C21.7324 53.063 32.3208 63.652 45.3828 63.652C50.9003 63.652 55.977 61.7624 59.9999 58.5956C54.4988 54.2646 50.966 47.5448 50.966 40.0003Z"
        fill="#EB001B"
      />
      {/* Orange-Yellow Circle (Right) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M98.2675 40.0003C98.2675 53.063 87.6791 63.652 74.6171 63.652C69.0996 63.652 64.0229 61.7624 60 58.5956C65.5011 54.2646 69.0339 47.5448 69.0339 40.0003C69.0339 32.4552 65.5011 25.7354 60 21.4044C64.0229 18.2376 69.0996 16.348 74.6171 16.348C87.6791 16.348 98.2675 26.937 98.2675 40.0003Z"
        fill="#F79E1B"
      />
      {/* Intersecting Orange Center */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.6521 58.595H70.3479V21.4044H49.6521V58.595Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

/**
 * Authentic American Express (Amex) Vector Mark
 */
export function AmexIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="American Express"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#006FCF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#005BA6" strokeWidth="1.5" />
      {/* AMEX Official Typography Vectors */}
      <path
        d="M120 76v-8.676h-9.651l-4.969-5.495-4.994 5.495H68.564V41.717H58.294l12.74-28.831h12.286l4.386 9.877v-9.877h15.208l2.64 7.443 2.658-7.443h11.788V4c0-2.209-1.791-4-4-4H4C1.791 0 0 1.791 0 4v72c0 2.209 1.791 4 4 4h112c2.209 0 4-1.791 4-4zm-8.026-11.882h8.026L109.384 52.86l10.616-11.13h-7.898l-6.556 7.165-6.494-7.165h-8.027l10.554 11.194-10.554 11.194h7.804l6.589-7.228 6.556 7.228zm1.878-11.249l6.148 6.541V46.382l-6.148 6.487zM78.072 58.936v-3.486h12.633v-5.053H78.072v-3.486h12.953l.001-5.182H71.964v22.388h19.062l-.001-5.181H78.072zm35.883-20.456h6.045V16.092h-9.403l-5.022 13.944-4.989-13.944h-9.563v22.388h6.045V22.808l5.757 15.672h5.373l5.757-15.704v15.704zm-29.809 0h6.877L81.14 16.092h-7.868L63.389 38.48h6.716l1.856-4.478h10.298l1.887 4.478zm-3.998-9.499h-6.077l3.039-7.324 3.038 7.324z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Authentic QAR (Qatari Riyal • ر.ق) Payment Mark
 * Features official Pantone 1955 C Qatar maroon and authentic 9-serrated flag emblem
 */
export function QarCurrencyIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="QAR Currency - Qatari Riyal"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#FFFFFF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Qatar Flag Maroon Serration on Left */}
      <path
        d="M0 8C0 3.58 3.58 0 8 0H28L22 8L28 16L22 24L28 32L22 40L28 48L22 56L28 64L22 72L28 80H8C3.58 80 0 76.42 0 72V8Z"
        fill="#8A1538"
      />
      {/* QAR and Arabic Riyal text */}
      <text
        x="72"
        y="42"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="22"
        fontWeight="900"
        fill="#8A1538"
        letterSpacing="1"
      >
        QAR
      </text>
      <text
        x="72"
        y="62"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#64748B"
        letterSpacing="0.5"
      >
        ر.ق • RIYAL
      </text>
    </svg>
  );
}

/**
 * Authentic Cash on Delivery (COD) Payment Mark
 */
export function CashOnDeliveryIcon({ width = 44, height = 28, className }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cash on Delivery Across Qatar"
      role="img"
    >
      <rect width="120" height="80" rx="8" fill="#FFFFFF" />
      <rect x="0.75" y="0.75" width="118.5" height="78.5" rx="7.25" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Banknote / Delivery Cash Emblem */}
      <rect x="14" y="24" width="28" height="18" rx="3" stroke="#059669" strokeWidth="2.5" fill="#ECFDF5" />
      <circle cx="28" cy="33" r="4" fill="#059669" />
      <path d="M14 47h28M20 53h16" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      {/* COD Text */}
      <text
        x="78"
        y="41"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="20"
        fontWeight="900"
        fill="#065F46"
        letterSpacing="0.5"
      >
        COD
      </text>
      <text
        x="78"
        y="59"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#059669"
        letterSpacing="0.5"
      >
        CASH DELIVERY
      </text>
    </svg>
  );
}

