"use client";

import { usePathname } from "next/navigation";

function singularize(value: string) {
	if (value.endsWith("ies")) return value.slice(0, -3) + "y";
	if (value.endsWith("s")) return value.slice(0, -1);

	return value;
}

export default function PageTitle() {
	const pathname = usePathname();

	if (pathname === "/") return "Home";

	const parts = pathname.split("/").filter(Boolean);
	const last = parts.at(-1);
	const previous = parts.at(-2);

	if (last && /^\d+$/.test(last) && previous) {
		return `${singularize(previous)
			.replace(/-/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase())} ${last}`;
	}

	return (
		last?.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) ??
		""
	);
}
