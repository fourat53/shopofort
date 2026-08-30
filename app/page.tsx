"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
	const router = useRouter();
	return (
		<div className="h-screen flex gap-2 items-center justify-center">
			<Button onClick={() => router.push("/admin/dashboard")}>Admin</Button>
			<Button variant="secondary" onClick={() => router.push("/client")}>
				Client
			</Button>
		</div>
	);
}
