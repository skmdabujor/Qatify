import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Electronics & Smart Gadgets Online in Qatar | Qatify Shop',
  description:
    'Browse Qatar’s best deals on authentic mobile accessories, GaN fast chargers, smartwatches, ANC earbuds, gaming gear & home tech. Fast doorstep delivery in Doha, Lusail & all Qatar with Cash on Delivery.',
  keywords: [
    'buy electronics qatar',
    'online shopping doha',
    'alanees qatar alternative',
    'mobile accessories qatar',
    'anker qatar',
    'baseus qatar',
    'green lion qatar',
    'porodo qatar',
    'smartwatch price qatar',
  ],
  alternates: {
    canonical: 'https://qatify.qa/shop',
  },
  openGraph: {
    title: 'Buy Electronics & Smart Gadgets Online in Qatar | Qatify Shop',
    description:
      'Browse Qatar’s best deals on authentic mobile accessories, GaN fast chargers, smartwatches, ANC earbuds & gaming gear. Fast delivery in Doha & Lusail.',
    url: 'https://qatify.qa/shop',
    siteName: 'Qatify Qatar',
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

