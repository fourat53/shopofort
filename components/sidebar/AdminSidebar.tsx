import Link from "next/link";
import type * as React from "react";
import Image from "next/image";
import { Suspense } from "react";
import SmallLoader from "@/components/loaders/small-loader";
import { NavMain, navMain } from "@/components/sidebar/NavMain";
import { NavUser } from "@/components/sidebar/NavUser";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export default function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props} className="border-none">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="text-primary hover:text-primary data-[slot=sidebar-menu-button]:p-1.5! rounded-full h-11"
						>
							<Link
								href="/admin/dashboard"
								className="flex items-center justify-center font-bold text-xl"
							>
								<Image
									src="/svgs/shopofort.svg"
									alt="logo"
									width={32}
									height={32}
									className="relative -right-0.5 -top-0.5 size-8!"
								/>
								<p className="relative -left-0.5 text-[22px]">ShopoFort</p>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<SidebarSeparator />
				<Suspense fallback={<SmallLoader className="h-12" />}>
					<NavUser />
				</Suspense>
			</SidebarFooter>
		</Sidebar>
	);
}
