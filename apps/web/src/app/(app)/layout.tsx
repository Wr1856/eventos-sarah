import Image from "next/image";
import { Search } from "lucide-react";

import logo from "@/assets/logo.png";
import { LogoutAction } from "./logout";
import { CreateEventDialog } from "./create-event";

export default function DashboardLayout({
	children,
}: { children?: React.ReactNode }) {
	return (
		<div className="w-full h-screen">
			<header className="flex items-center justify-between p-2">
				<Image src={logo} alt="Sarah" />
				<div className="flex items-center gap-2">
					<LogoutAction />
					<div className="flex items-center gap-2 p-2 rounded border border-zinc-400 bg-zinc-100">
						<input
							className="bg-transparent"
							type="text"
							placeholder="Pesquisar..."
						/>
						<Search className="size-4" />
					</div>
				</div>
			</header>
			<div className="p-5">
				<CreateEventDialog />
				{children}
			</div>
		</div>
	);
}