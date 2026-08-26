"use client";

import { useState } from "react";
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

export default function EntityTooltip({
	headerName,
	idValue,
}: {
	headerName: string;
	idValue: string;
}) {
	const entity = getTooltipEntity(headerName);
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
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity) return;

	return (
		<TooltipProvider>
			<Tooltip open={open} onOpenChange={handleOpenChange}>
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
					className="w-80 flex flex-col shadow-lg bg-background border text-foreground rounded-lg"
				>
					<p className="w-full text-primary text-center font-semibold border-b pb-1 capitalize">
						{getSingleName(entity) + " details"}
					</p>
					{loading ? (
						<div className="grid grid-cols-[2fr_5fr] gap-1.5">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} className={i % 2 === 0 ? "w-22" : ""} />
							))}
						</div>
					) : data ? (
						<div>
							{Object.entries(data).map(([name, value]) => (
								<div key={name} className="grid grid-cols-[2fr_5fr] gap-1.5">
									<p className="w-22 font-medium text-muted-foreground">
										{getFieldName(name)}:
									</p>
									<ContentCell
										headerName={name}
										value={Array.isArray(value) ? [...value] : String(value)}
										tooltip
									/>
								</div>
							))}
						</div>
					) : (
						<div className="pt-1.5 text-muted-foreground text-center">
							No details available
						</div>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
