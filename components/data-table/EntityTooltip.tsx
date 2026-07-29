"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getEntityById } from "@/actions/EntityActions";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import SmallLoader from "../loaders/small-loader";

export default function EntityTooltip<T extends null>({
	headerName,
	idValue,
}: {
	headerName: string;
	idValue: string | number;
}) {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const handleOpenChange = async (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen && !data && !loading) {
			setLoading(true);

			let modelName = "";
			const lowerHeader = headerName.toLowerCase();

			if (lowerHeader.includes("user")) modelName = "user";
			else if (lowerHeader.includes("product")) modelName = "product";
			else if (lowerHeader.includes("order") && !lowerHeader.includes("item"))
				modelName = "order";
			else if (lowerHeader.includes("order item")) modelName = "orderItem";
			else if (lowerHeader.includes("cart item")) modelName = "cartItem";
			else if (lowerHeader.includes("cart")) modelName = "cart";
			else if (lowerHeader.includes("category")) modelName = "category";
			else if (lowerHeader === "id") {
				if (pathname.includes("users")) modelName = "user";
				else if (pathname.includes("products")) modelName = "product";
				else if (pathname.includes("orders")) modelName = "order";
				else if (pathname.includes("categories")) modelName = "category";
				else if (pathname.includes("carts")) modelName = "cart";
			}

			if (modelName) {
				const result = await getEntityById(modelName, Number(idValue));
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
								{modelNameFromHeader(headerName, pathname)} Details
							</p>
							<div className="pt-1.5">
								{Object.entries(data).map(([key, value]) => {
									if (
										key === "id" ||
										key.endsWith("Id") ||
										key === "password" ||
										value === null ||
										value === undefined ||
										typeof value === "object"
									)
										return null;

									if (key === "downloadUrl") {
										return (
											<div
												key={key}
												className="col-span-2 flex justify-center py-2"
											>
												<Image
													src={String(value)}
													alt={key}
													width={48}
													height={48}
													loading="eager"
													className="size-12 object-cover rounded-md border border-mist-300 dark:border-mist-700"
												/>
											</div>
										);
									}

									return (
										<div key={key} className="grid grid-cols-[1fr_2fr] gap-1">
											<span className="text-xs font-medium text-muted-foreground capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}:
											</span>
											<span title={String(value)} className="text-xs truncate">
												{String(value)}
											</span>
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

function modelNameFromHeader(headerName: string, pathname: string) {
	if (headerName.toLowerCase() !== "id") return headerName.replace(/ ID/i, "");

	if (pathname.includes("users")) return "User";
	if (pathname.includes("products")) return "Product";
	if (pathname.includes("orders")) return "Order";
	if (pathname.includes("categories")) return "Category";
	if (pathname.includes("carts")) return "Cart";

	return "Entity";
}
