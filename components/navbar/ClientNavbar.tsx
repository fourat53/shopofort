import { IconSearch, IconShoppingBag } from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import { Input } from "@/components/form-items/input";
import NavUser from "@/components/navbar/NavUser";
import { Button } from "@/components/ui/button";

export default async function ClientNavbar() {
	return (
		<nav className="fixed top-0 z-50 w-full border-b bg-background/60 dark:bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
			<div className="sm:p-4 flex max-sm:flex-col gap-x-4 items-center justify-center sm:justify-between">
				<Link
					href="/"
					className="max-sm:h-10 flex items-center justify-center gap-0.5"
				>
					<IconShoppingBag stroke={2} className="size-7 text-primary" />
					<span className="text-2xl font-bold tracking-tighter text-primary">
						Shopofort
					</span>
				</Link>

				<CategoryLinks md />

				<div className="max-sm:border-t max-sm:px-2 max-sm:h-11 w-full md:w-1/2 flex gap-2 items-center justify-between">
					<div className="w-full sm:max-w-sm flex items-center justify-start">
						<Input placeholder="Search" className="w-full h-8 rounded-r-none" />
						<Button className="h-8 shadow-none rounded-lg rounded-l-none border-0">
							<IconSearch className="size-5" />
						</Button>
					</div>
					<NavUser />
				</div>
			</div>

			<CategoryLinks />
		</nav>
	);
}

function CategoryLinks({ md = false }: { md?: boolean }) {
	return (
		<div
			className={clsx(
				"gap-8 text-sm font-semibold",
				md
					? "hidden md:flex"
					: "h-8 w-full flex md:hidden items-center justify-center max-md:border-t",
			)}
		>
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
	);
}
