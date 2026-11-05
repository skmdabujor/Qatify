import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Store System Upgrade | Qatify',
  description:
    'Qatify is refreshing its digital platform and direct express delivery network for Qatar shoppers. Online orders will resume shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

