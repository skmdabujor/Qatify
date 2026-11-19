import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Electronics & Smart Gadgets Online | Qatify Shop',
  description:
    'Browse the best deals on authentic mobile accessories, GaN fast chargers, smartwatches, ANC earbuds, gaming gear & home tech. Fast doorstep delivery with guaranteed safe & secure checkout.',
  keywords: [
    'buy electronics online',
    'mobile accessories',
    'anker',
    'baseus',
    'green lion',
    'porodo',
    'smartwatch price',
    'fast gan charger',
    'gaming gear',
  ],
  alternates: {
    canonical: 'https://shopqatify.com/shop',
  },
  openGraph: {
    title: 'Buy Electronics & Smart Gadgets Online | Qatify Shop',
    description:
      'Browse the best deals on authentic mobile accessories, GaN fast chargers, smartwatches, ANC earbuds & gaming gear. Fast tracked delivery.',
    url: 'https://shopqatify.com/shop',
    siteName: 'Qatify',
    locale: 'en_QA',
    type: 'website',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

