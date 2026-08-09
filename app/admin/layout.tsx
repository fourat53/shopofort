import CreateButton from "@/components/buttons/create-button";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import DocumentTitle from "@/components/title/DocumentTitle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<div className="p-3 border border-mist-400/70 dark:border-mist-700 rounded-4xl bg-chart-1 dark:bg-sidebar-accent">
					<div className="h-[calc(100vh-38px)] bg-sidebar rounded-3xl border border-mist-400/70 dark:border-mist-700">
						<div className="p-2.5 flex items-center justify-between">
							<div className="text-xl font-semibold text-chart-2 flex items-center gap-2">
								<SidebarTrigger size="lg" className="size-7.5 rounded-xl" />
								<DocumentTitle />
							</div>
							<CreateButton />
						</div>
						<div className="border-b border-mist-400/70 dark:border-mist-700" />
						<div className="relative h-full p-3.5 pb-0">{children}</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
