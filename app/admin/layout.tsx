import CreateDialog from "@/components/dialogs/create-dialog";
import FilterDialog from "@/components/dialogs/filter-dialog";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import PageTitle from "@/components/title/PageTitle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<div className="p-3 border rounded-4xl bg-chart-1 dark:bg-sidebar-accent">
					<div className="h-[calc(100vh-38px)] bg-sidebar rounded-3xl border">
						<div className="p-2.5 flex items-center justify-between">
							<div className="text-xl font-semibold text-chart-2 flex items-center gap-2">
								<SidebarTrigger />
								<PageTitle />
							</div>
							<div className="flex gap-1.5">
								<FilterDialog />
								<CreateDialog />
							</div>
						</div>
						<div className="border-b" />
						<div className="relative h-full p-3.5 pb-0">{children}</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
