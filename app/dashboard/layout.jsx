import DashboardSidebar from '../../components/DashboardSidebar';

export const metadata = {
  title: 'Enterprise Console — Reviewwo',
  description: 'Manage your autonomous review acceleration engine, sovereign WhatsApp rail, and physical standees.',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F8FFFE] text-[#234745]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
