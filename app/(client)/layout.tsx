import ClientFooter from "@/components/home/ClientFooter";
import ClientNavbar from "@/components/navbar/ClientNavbar";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="pt-15 bg-mist-50 dark:bg-card">
			<ClientNavbar />
			<div className="min-h-[calc(100vh-60px)]">{children}</div>
			<ClientFooter />
		</div>
	);
}
