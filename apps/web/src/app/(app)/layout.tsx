import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="p-5">{children}</div>
      <Navbar />
    </div>
  );
}
