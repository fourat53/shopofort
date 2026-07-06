"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconPackage,
  IconShoppingCart,
  IconInnerShadowTop,
  IconShoppingBag,
  IconUsers,
  type Icon,
  IconBrandAsana,
  IconPackages,
  IconCategory2,
  IconMacro,
} from "@tabler/icons-react";

type NavItem = {
  title: string;
  url: string;
  icon: Icon;
};

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Users",
    url: "/users",
    icon: IconUsers,
  },
  {
    title: "Products",
    url: "/products",
    icon: IconShoppingBag,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: IconCategory2,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: IconPackage,
  },
  {
    title: "Order Items",
    url: "/order-items",
    icon: IconPackages,
  },
  {
    title: "Carts",
    url: "/carts",
    icon: IconShoppingCart,
  },
  {
    title: "Cart Items",
    url: "/cart-items",
    icon: IconBrandAsana,
  },
  {
    title: "Images",
    url: "/images",
    icon: IconMacro,
  },
] as const;

function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
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
                className={cn(
                  pathname === `/admin${item.url}` &&
                    "bg-mist-400/80 dark:bg-mist-700/80",
                )}
              >
                <Link href={`/admin${item.url}`}>
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
