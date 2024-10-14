import { LogOut, List } from "lucide-react";

import { Button } from "../ui/button";
import { CustomLink } from "../ui/link";
import { signOut } from "@/auth-config";

export function Navbar() {
  async function logout() {
    "use server";

    await signOut({ redirectTo: "/auth/sign-in" });
  }
  return (
    <div className="w-fit fixed left-1/2 -translate-x-1/2 bottom-8 rounded-full p-2 border border-zinc-900 flex items-center justify-center gap-2">
      <Button
        size="icon"
        variant="tertiary"
        className="hover:rounded-[current] data-[current=true]:bg-orange-500 data-[current=true]:hover:bg-orange-400"
        asChild
      >
        <CustomLink href="/">
          <List className="size-4" />
        </CustomLink>
      </Button>
      <form action={logout}>
        <Button
          size="icon"
          variant="tertiary"
          className="hover:rounded-[current]"
          type="submit"
        >
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  );
}
