import DashboardShell from '../../components/DashboardShell';

export const metadata = {
  title: 'Dashboard | Reviewwo',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
