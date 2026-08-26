import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="h-screen flex gap-2 items-center justify-center">
			<Button>
				<Link href="/admin/dashboard">Admin</Link>
			</Button>
			<Button variant="secondary">
				<Link href="/client">Client</Link>
			</Button>
		</div>
	);
}
