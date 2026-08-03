"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { getEntityById } from "@/actions/EntityActions";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { entityFromHeaderName } from "../buttons/current-entity";
import SmallLoader from "../loaders/small-loader";
import CellContent from "./CellContent";

export default function EntityTooltip<T>({
	headerName,
	idValue,
}: {
	headerName: string;
	idValue: number;
}) {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const pathname = usePathname();

	const handleOpenChange = async (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen && !data && !loading) {
			setLoading(true);

			const entity = entityFromHeaderName(headerName, pathname);

			if (entity) {
				const result = await getEntityById(entity, Number(idValue));
				setData(result);
			}
			setLoading(false);
		}
	};

	return (
		<TooltipProvider>
			<Tooltip open={open} onOpenChange={handleOpenChange} delayDuration={300}>
				<TooltipTrigger asChild>
					<span className="underline cursor-pointer hover:text-primary transition-colors">
						{idValue}
					</span>
				</TooltipTrigger>
				<TooltipContent
					side="left"
					className="max-w-82 shadow-lg bg-background border text-foreground rounded-lg"
				>
					{loading ? (
						<SmallLoader />
					) : data ? (
						<div className="w-full">
							<p className="w-full text-sm text-primary text-center font-semibold border-b pb-1 capitalize">
								{headerName
									.replace(" ID", "")
									.replace(/([A-Z])/g, " $1")
									.trim()}{" "}
								Details
							</p>
							<div className="pt-1.5 flex flex-col gap-1">
								{Object.entries(data).map(([key, value]) => {
									return (
										<div key={key} className="grid grid-cols-[1fr_2fr] gap-1.5">
											<p className="text-xs font-medium text-muted-foreground capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}:
											</p>
											<div className="max-w-60 truncate" title={String(value)}>
												<CellContent
													headerName={key}
													value={value}
													colIndex={idValue}
													tooltip
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<div className="text-sm text-muted-foreground text-center">
							No details available
						</div>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
