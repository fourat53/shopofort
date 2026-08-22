"use client";

import { usePathname } from "next/navigation";

export default function PageTitle() {
	const pathname = usePathname();

	if (pathname === "/") return "Home";
	else
		return (
			pathname
				.split("/")
				.pop()
				?.replace(/-/g, " ")
				.replace(/\b\w/g, (char) => char.toUpperCase()) ?? ""
		);
}
