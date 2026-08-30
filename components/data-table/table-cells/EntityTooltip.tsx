"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getEntityById } from "@/actions/EntityActions";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getFieldName,
	getSingleName,
	getTooltipEntity,
} from "@/lib/entity/entity-functions";
import { getSkeletonCount } from "@/lib/entity/entity-header";
import type { OptionField } from "@/lib/entity/types";

export default function EntityTooltip({
	headerName,
	idValue,
}: {
	headerName: OptionField;
	idValue: string | number;
}) {
	const entity = getTooltipEntity(headerName);
	const skeletonCount = getSkeletonCount(entity);
	const [data, setData] = useState<unknown>();
	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	const handleOpenChange = async (open: boolean) => {
		if (!entity) return;
		setOpen(open);
		if (!open || data || loading) return;
		try {
			setLoading(true);
			const result = await getEntityById(entity, idValue);
			setData(result);
		} catch {
			toast.error(`Error fetching ${getSingleName(entity)}.`);
		} finally {
			setLoading(false);
		}
	};

	if (!entity) return;

	return (
		<TooltipProvider>
			<Tooltip open={open} onOpenChange={handleOpenChange} delayDuration={100}>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="w-fit underline cursor-pointer hover:text-primary transition-colors text-left"
						onClick={(e) => {
							e.preventDefault();
							handleOpenChange(true);
						}}
					>
						{idValue}
					</button>
				</TooltipTrigger>
				<TooltipContent
					side="left"
					className="w-70 flex flex-col gap-px shadow-lg bg-background border text-foreground rounded-lg"
				>
					<p className="w-full pb-1 text-primary text-center font-semibold capitalize">
						{getSingleName(entity) + " details"}
					</p>
					<div className="w-full border-t pb-0.5" />
					{loading ? (
						Array.from({ length: skeletonCount }).map((_, i) => (
							<SkeletonRow key={i} />
						))
					) : data ? (
						Object.entries(data).map(([name, value]) => (
							<DataRow key={name} name={name} value={value} />
						))
					) : (
						<div className="text-muted-foreground text-center">
							No details available
						</div>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function SkeletonRow() {
	return (
		<div className="grid grid-cols-[2fr_5fr] gap-x-1 h-4 py-0.75 items-center">
			<Skeleton className="h-3.25 w-22" />
			<Skeleton className="h-3.25 w-full" />
		</div>
	);
}

function DataRow({ name, value }: { name: string; value: unknown }) {
	return (
		<div className="grid grid-cols-[2fr_5fr] gap-x-1">
			<p className="w-22 font-medium text-muted-foreground">
				{getFieldName(name)}:
			</p>
			<ContentCell
				headerName={name}
				value={Array.isArray(value) ? [...value] : String(value)}
				tooltip
			/>
		</div>
	);
}
