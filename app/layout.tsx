import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Geist, Geist_Mono, Oxanium } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { AutoTitle } from "@/components/title/AutoTitle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ourFileRouter } from "@/lib/uploadthing/core";
import { cn } from "@/lib/utils";
import { KindeProvider } from "@/providers/kinde-provider";
import ThemeProvider from "@/providers/theme-provider";
import "@/app/globals.css";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			suppressHydrationWarning
			lang="en"
			className={cn(
				geistSans.variable,
				geistMono.variable,
				oxanium.variable,
				"antialiased font-sans",
			)}
		>
			<body className="min-h-screen text-foreground bg-sidebar">
				<ThemeProvider>
					<KindeProvider>
						<AutoTitle />
						<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
						<TooltipProvider>{children}</TooltipProvider>
					</KindeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
