import { Sidebar } from "@/app/components/common/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      <Sidebar />
      
      {/* 
        Main Layout Wrapper 
        md:pl-64 gives room for the desktop sidebar.
        pb-20 or md:pb-0 gives room for the mobile bottom nav.
      */}
      <div className="flex flex-col md:pl-64 min-h-screen pb-20 md:pb-0 relative">
        {/*
          Centralized content area. This enforces the vertical design
          with lots of white space on the left and right.
        */}
        <div className="flex-1 flex justify-center w-full">
          <main className="w-full max-w-2xl relative min-h-[100dvh]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
