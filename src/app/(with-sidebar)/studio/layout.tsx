import ChatSidebar from "./components/ChatSidebar";
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto">{children}</main>
      <div className="w-80 border-l">
        <ChatSidebar />
      </div>
    </div>
  );
}
