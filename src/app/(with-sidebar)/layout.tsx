import { SideBar } from "@/components/menu/SideBar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1">{children}</main>
      <div className="w-80 p-4">
        <SideBar />
      </div>
    </div>
  );
}
