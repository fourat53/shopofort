import ClientNavbar from "@/components/navbar/ClientNavbar";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-mist-50 dark:bg-card">
			<ClientNavbar />
			{children}
		</div>
	);
}
