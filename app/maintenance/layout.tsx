import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Under Scheduled Maintenance | Qatify Qatar',
  description:
    'Qatify is currently undergoing scheduled maintenance and system upgrades to serve Qatar better. Online orders will resume shortly.',
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

