"use client";

import { useState } from "react";
import { getEntityById } from "@/actions/EntityActions";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import SmallLoader from "@/components/loaders/small-loader";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipEntity } from "@/lib/entity/current-entity";
import { getFieldName } from "@/lib/entity/entity-header";

export default function EntityTooltip({
	headerName,
	idValue,
}: {
	headerName: string;
	idValue: number | string;
}) {
	const [data, setData] = useState<unknown>();
	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	const title =
		headerName
			.replace("Id", "")
			.replace(/([A-Z])/g, " $1")
			.trim() + " Details";

	const handleOpenChange = async (isOpen: boolean) => {
		try {
			setOpen(isOpen);
			if (isOpen && !data && !loading) {
				setLoading(true);

				const entity = TooltipEntity(headerName);

				if (entity) {
					const result = await getEntityById(entity, idValue);
					setData(result);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<TooltipProvider>
			<Tooltip open={open} onOpenChange={handleOpenChange} delayDuration={300}>
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
					className="max-w-100 shadow-lg bg-background border text-foreground rounded-lg"
				>
					<div className="w-full">
						<p className="w-full text-sm text-primary text-center font-semibold border-b pb-1 capitalize">
							{title}
						</p>
						{loading ? (
							<SmallLoader className="pt-1.5" iconClassName="size-5" />
						) : data ? (
							<div className="pt-1.5 flex flex-col gap-1">
								{Object.entries(data).map(([key, value]) => (
									<div key={key} className="grid grid-cols-[2fr_5fr] gap-1.5">
										<p className="max-w-28 text-xs font-medium text-muted-foreground capitalize">
											{getFieldName(key)}
										</p>
										<ContentCell headerName={key} value={value} tooltip />
									</div>
								))}
							</div>
						) : (
							<div className="pt-1.5 text-muted-foreground text-center">
								No details available
							</div>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
