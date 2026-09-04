"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getUserById } from "@/actions/UserActions";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/lib/entity/types";
import { DataRow } from "./StaticTooltip";

export default function UserTooltip({ id }: { id: string }) {
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	async function handleOpenChange(open: boolean) {
		setOpen(open);
		if (!open || user || loading) return;
		try {
			setLoading(true);
			const result = await getUserById(id);
			setUser(result);
		} catch {
			toast.error(
				<>
					<p>Failed to fetch user.</p>
					<p className="text-muted-foreground">Please try again.</p>
				</>,
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Tooltip open={open} onOpenChange={handleOpenChange}>
			<TooltipTrigger className="w-fit underline cursor-pointer hover:text-primary transition-colors text-left">
				{id}
			</TooltipTrigger>
			<TooltipContent
				side="left"
				className="w-70 flex flex-col gap-px shadow-lg bg-background border text-foreground rounded-lg"
			>
				<p className="w-full pb-1 text-primary text-center font-semibold">
					User Details
				</p>
				<div className="w-full border-t pb-0.5" />
				{loading ? (
					Array.from({ length: 11 }, (_, i) => <SkeletonRow key={i} />)
				) : user ? (
					Object.entries(user).map(([name, value]) => (
						<DataRow key={name} name={name} value={String(value)} />
					))
				) : (
					<div className="text-muted-foreground text-center">
						No details available
					</div>
				)}
			</TooltipContent>
		</Tooltip>
	);
}

function SkeletonRow() {
	return (
		<div className="grid grid-cols-[2fr_5fr] gap-x-1 items-center h-4 py-0.75">
			<Skeleton className="h-3.25 w-22" />
			<Skeleton className="h-3.25 w-full" />
		</div>
	);
}
