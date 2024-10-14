import Image from "next/image";

import logo from "@/assets/logo.png";

export function Header() {
  return (
    <header className="w-full py-8 px-32 flex items-center justify-center border-b border-b-zinc-900">
      <Image src={logo} alt="Logo SARAH" />
    </header>
  );
}
