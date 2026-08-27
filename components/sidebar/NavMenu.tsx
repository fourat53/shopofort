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
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type NavItem = {
	title: string;
	url: string;
	icon?: Icon;
};

const navMenu: NavItem[] = [
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

export default function NavMenu() {
	return navMenu.map((item) => (
		<SidebarMenuItem key={item.title}>
			<SidebarNavButton item={item} />
		</SidebarMenuItem>
	));
}

function SidebarNavButton({ item }: { item: NavItem }) {
	const pathname = usePathname();
	return (
		<SidebarMenuButton
			asChild
			tooltip={item.title}
			className={clsx(
				pathname === `/admin/${item.url}` &&
					"bg-primary dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary text-mist-50 hover:text-mist-50",
			)}
		>
			<Link href={`/admin/${item.url}`}>
				{item.icon && <item.icon />}
				{item.title}
			</Link>
		</SidebarMenuButton>
	);
}
