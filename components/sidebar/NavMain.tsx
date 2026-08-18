"use client";

import {
	type Icon,
	IconBrandAsana,
	IconCategory2,
	IconDashboard,
	IconPackage,
	IconPackages,
	IconShoppingBag,
	IconShoppingCart,
	IconUsers,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
	title: string;
	url: string;
	icon: Icon;
};

const navMain: NavItem[] = [
	{
		title: "Dashboard",
		url: "dashboard",
		icon: IconDashboard,
	},
	{
		title: "Users",
		url: "users",
		icon: IconUsers,
	},
	{
		title: "Products",
		url: "products",
		icon: IconShoppingBag,
	},
	{
		title: "Categories",
		url: "categories",
		icon: IconCategory2,
	},
	{
		title: "Orders",
		url: "orders",
		icon: IconPackage,
	},
	{
		title: "Order Items",
		url: "order-items",
		icon: IconPackages,
	},
	{
		title: "Carts",
		url: "carts",
		icon: IconShoppingCart,
	},
	{
		title: "Cart Items",
		url: "cart-items",
		icon: IconBrandAsana,
	},
] as const;

function linkUrl(url: string) {
	return url === "dashboard"
		? `/admin/${url}`
		: `/admin/${url}?page=1&sortBy=id&order=asc`;
}

function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
}) {
	const pathname = usePathname();
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={clsx(
									pathname === `/admin/${item.url}` &&
										"bg-primary dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary text-mist-50 hover:text-mist-50",
								)}
							>
								<Link href={linkUrl(item.url)}>
									{item.icon && <item.icon />}
									{item.title}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export { NavMain, navMain };
