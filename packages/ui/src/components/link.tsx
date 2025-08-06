"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CustomLink(props: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isCurrent = pathname === props.href;

  return <Link data-current={isCurrent} {...props} />;
}
