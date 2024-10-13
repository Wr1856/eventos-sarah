import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}
