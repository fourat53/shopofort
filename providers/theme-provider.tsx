import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next";
export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextThemesProvider enableSystem defaultTheme="system">
			{children}
		</NextThemesProvider>
	);
}
