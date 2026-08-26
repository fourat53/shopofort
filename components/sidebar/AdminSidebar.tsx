import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { Suspense } from "react";
import SmallLoader from "@/components/loaders/small-loader";
import NavMain from "@/components/sidebar/NavMain";
import NavUser from "@/components/sidebar/NavUser";
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
									width={1000}
									height={1000}
									loading="eager"
									className="size-8! relative -right-0.5 -top-0.5"
								/>
								<p className="relative -left-0.5 text-[22px]">ShopoFort</p>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
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
