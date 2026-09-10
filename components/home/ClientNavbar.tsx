import {
	IconLogin,
	IconSearch,
	IconShoppingBag,
	IconShoppingCart,
	IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientNavbar() {
	return (
		<nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 dark:bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-1">
					<IconShoppingBag className="h-7 w-7 text-primary" />
					<span className="text-2xl font-black tracking-tighter text-primary">
						Shopofort
					</span>
				</div>
				<div className="hidden md:flex gap-8 text-sm font-semibold">
					<Link
						href="#"
						className="transition-colors hover:text-primary text-foreground/80"
					>
						Men
					</Link>
					<Link
						href="#"
						className="transition-colors hover:text-primary text-foreground/80"
					>
						Women
					</Link>
					<Link
						href="#"
						className="transition-colors hover:text-primary text-foreground/80"
					>
						Kids
					</Link>
					<Link
						href="#"
						className="transition-colors hover:text-primary text-foreground/80"
					>
						Accessories
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="ghost" icon={<IconSearch className="size-4" />} />
					<Button variant="ghost" icon={<IconUser className="size-4" />} />
					<Button variant="ghost" className="relative">
						<IconShoppingCart />
						<div className="absolute right-1.5 top-1.5 flex size-1.5 rounded-full bg-destructive" />
					</Button>
					<Button variant="ghost">
						<Link href="/admin/dashboard">
							<IconLogin className="rotate-180" />
						</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
}
