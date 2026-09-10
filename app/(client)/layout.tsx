import ClientNavbar from "@/components/home/ClientNavbar";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-card">
			<ClientNavbar />
			{children}
		</div>
	);
}
