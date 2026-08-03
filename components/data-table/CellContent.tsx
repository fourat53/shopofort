import { clsx } from "clsx";
import Image from "next/image";
import { formatDate, isDate } from "@/lib/date-format";
import EntityTooltip from "./EntityTooltip";

interface CellContentProps {
	value: unknown;
	headerName: string;
	colIndex: number;
	rowId?: number;
	tooltip?: boolean;
}

export default function CellContent({
	value,
	headerName,
	colIndex,
	rowId,
	tooltip = false,
}: CellContentProps) {
	const lowerHeader = headerName.toLowerCase();
	console.log(
		"CellContent value:",
		value,
		"headerName:",
		headerName,
		"colIndex:",
		colIndex,
		"rowId:",
		rowId,
		"tooltip:",
		tooltip,
	);
	const imageSize = tooltip ? 40 : 56;

	if (value === null || value === undefined || value === "") return "-";

	if (
		colIndex > 0 &&
		lowerHeader.includes(" id") &&
		typeof value === "number"
	) {
		return <EntityTooltip headerName={headerName} idValue={value} />;
	}

	if (["orderstatus", "order status"].includes(lowerHeader)) {
		return (
			<p
				className={clsx(
					"w-fit text-center bg-accent rounded-full flex items-center px-2",
					value === "PENDING" &&
						"bg-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
					value === "PROCESSING" &&
						"bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
					value === "SHIPPED" &&
						"bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
					value === "DELIVERED" &&
						"bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400",
					value === "CANCELLED" &&
						"bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400",
				)}
			>
				{String(value)}
			</p>
		);
	}

	if (lowerHeader === "picture") {
		return (
			<Image
				src={String(value)}
				alt="Picture"
				width={imageSize}
				height={imageSize}
				loading="eager"
				className="shrink-0 object-cover rounded-full"
				style={{
					width: `${imageSize}px`,
					height: `${imageSize}px`,
				}}
			/>
		);
	}

	if (lowerHeader === "images" && Array.isArray(value) && value.length > 0) {
		return (
			<div
				className={clsx(
					"flex overflow-x-auto items-center",
					tooltip ? "w-49 gap-1" : "w-62 gap-2",
				)}
			>
				{value.map((imgSrc) => (
					<Image
						key={`${rowId}-${imgSrc}`}
						src={String(imgSrc)}
						alt={`image-${imgSrc}`}
						loading="eager"
						width={imageSize}
						height={imageSize}
						className="shrink-0 object-cover rounded-md"
						style={{
							width: `${imageSize}px`,
							height: `${imageSize}px`,
						}}
					/>
				))}
			</div>
		);
	}

	if (isDate(value)) {
		return formatDate(value);
	}

	return String(value);
}
