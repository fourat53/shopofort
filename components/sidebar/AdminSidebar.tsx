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
import { IconShoppingBag } from "@tabler/icons-react";

export default function AdminSidebar() {
	return (
		<Sidebar collapsible="offcanvas" className="border-none">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Link href="/">
							<SidebarMenuButton
								asChild
								className="hover:bg-transparent text-primary"
							>
								<div className="flex items-center justify-center gap-2">
									<IconShoppingBag
										stroke={2}
										className="scale-175 text-primary"
									/>
									<span className="text-2xl font-bold tracking-tighter text-primary">
										Shopofort
									</span>
								</div>
							</SidebarMenuButton>
						</Link>
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
