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
import { usePathname, useRouter } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarNavMenu: SidebarNavItem[] = [
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

export default function SidebarMain() {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{sidebarNavMenu.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarNavButton item={item} />
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

type SidebarNavItem = {
	title: string;
	url: string;
	icon?: Icon;
};

function SidebarNavButton({ item }: { item: SidebarNavItem }) {
	const pathname = usePathname();
	const router = useRouter();
	const path = "/admin/" + item.url;
	return (
		<SidebarMenuButton
			tooltip={item.title}
			onClick={() => router.push(path)}
			className={clsx(
				pathname === path &&
					"bg-primary dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary text-mist-50 hover:text-mist-50",
			)}
		>
			{item.icon && <item.icon />}
			{item.title}
		</SidebarMenuButton>
	);
}
