import Header from "@/components/sharing/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Header />
      <div className="flex grow gap-5">{children}</div>
    </div>
  );
}
