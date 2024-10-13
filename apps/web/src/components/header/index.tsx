import Image from "next/image";
import { ChevronDown, LogOut } from "lucide-react";

import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown";

export function Header() {
  return (
    <header className="w-full h-20 px-32 flex items-center justify-between border-b border-b-zinc-900">
      <Image src={logo} alt="Logo SARAH" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <img
            src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Ryan"
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={4}>
          <DropdownMenuLabel>Em producao</DropdownMenuLabel>
          <DropdownMenuItem>
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
