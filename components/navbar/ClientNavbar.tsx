import { IconSearch, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";
import { Input } from "@/components/form-items/input";
import NavUser from "@/components/navbar/NavUser";
import { Button } from "@/components/ui/button";

export default async function ClientNavbar() {
	return (
		<nav className="fixed top-0 z-50 h-15 w-full flex items-center justify-between px-4 border-b bg-background/60 dark:bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
			<Link href="/" className="flex items-center gap-0.5">
				<IconShoppingBag stroke={2} className="size-7 text-primary" />
				<span className="text-2xl font-bold tracking-tighter text-primary">
					Shopofort
				</span>
			</Link>
			<div className="hidden md:flex gap-8 text-sm font-semibold">
				<Link
					href="/Men"
					className="transition-colors hover:text-primary text-foreground/80"
				>
					Men
				</Link>
				<Link
					href="/Women"
					className="transition-colors hover:text-primary text-foreground/80"
				>
					Women
				</Link>
				<Link
					href="/Kids"
					className="transition-colors hover:text-primary text-foreground/80"
				>
					Kids
				</Link>
			</div>
			<div className="flex items-center">
				<Input placeholder="Search" className="z-10 h-8 w-70 rounded-r-none" />
				<Button className="h-8 shadow-none rounded-lg rounded-l-none border-0">
					<IconSearch className="size-5" />
				</Button>
			</div>
			<NavUser />
		</nav>
	);
}
