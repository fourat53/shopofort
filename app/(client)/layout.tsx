import ClientFooter from "@/components/home/ClientFooter";
import ClientNavbar from "@/components/navbar/ClientNavbar";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-mist-50 dark:bg-card">
			<ClientNavbar />
			<div className="min-h-[calc(100vh-117px)] sm:min-h-[calc(100vh-97px)] md:min-h-[calc(100vh-65px)]">
				{children}
			</div>
			<ClientFooter />
		</div>
	);
}

function PagesLayout({
	className,
	children,
}: Readonly<{
	className?: string;
	children: React.ReactNode;
}>) {
	return (
		<div
			className={`mt-29 sm:mt-24 md:mt-15 p-6 sm:py-8 sm:px-10 ${className}`}
		>
			{children}
		</div>
	);
}

function PagesTitle({
	className,
	children,
}: Readonly<{
	className?: string;
	children: React.ReactNode;
}>) {
	return (
		<h1
			className={`mb-4 sm:mb-8 text-2xl sm:text-4xl font-bold capitalize ${className}`}
		>
			{children}
		</h1>
	);
}

export { PagesLayout, PagesTitle };
