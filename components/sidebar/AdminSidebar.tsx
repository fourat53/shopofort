import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import SmallLoader from "@/components/loaders/small-loader";
import SidebarMain from "@/components/sidebar/SidebarMain";
import SidebarUser from "@/components/sidebar/SidebarUser";
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

export default function AdminSidebar() {
	return (
		<Sidebar collapsible="offcanvas" className="border-none">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="text-primary hover:text-primary data-[slot=sidebar-menu-button]:p-1.5! rounded-full h-10"
						>
							<Link
								href="/"
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
				<SidebarMain />
			</SidebarContent>
			<SidebarFooter>
				<SidebarSeparator />
				<Suspense fallback={<SmallLoader className="h-12" />}>
					<SidebarUser />
				</Suspense>
			</SidebarFooter>
		</Sidebar>
	);
}
