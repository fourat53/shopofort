import { clsx } from "clsx";
import Image from "next/image";
import EntityTooltip from "@/components/data-table/table-cells/EntityTooltip";
import { formatDateTime, isDate } from "@/lib/date-format";
import { OrderStatus } from "@/lib/entity/types";

interface CellContentProps {
	value: unknown;
	headerName: string;
	cIndex?: number;
	rowId?: number | string;
	tooltip?: boolean;
}

export default function ContentCell({
	value,
	headerName,
	cIndex,
	rowId,
	tooltip = false,
}: CellContentProps) {
	const imageSize = tooltip ? 32 : 56;
	return (
		<>
			{cIndex &&
			cIndex > 0 &&
			headerName.includes("Id") &&
			(typeof value === "number" || typeof value === "string") ? (
				<EntityTooltip headerName={headerName} idValue={value} />
			) : ["orderStatus"].includes(headerName) ? (
				<p
					className={clsx(
						"w-fit bg-accent rounded-full px-1.75",
						value === OrderStatus.PENDING &&
							"bg-yellow-200/40 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
						value === OrderStatus.PROCESSING &&
							"bg-blue-200/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
						value === OrderStatus.SHIPPED &&
							"bg-purple-200/60 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
						value === OrderStatus.DELIVERED &&
							"bg-green-200/60 text-green-700 dark:bg-green-900/30 dark:text-green-400",
						value === OrderStatus.CANCELLED &&
							"bg-red-200/60 text-red-700 dark:bg-red-900/30 dark:text-red-400",
					)}
				>
					{String(value)}
				</p>
			) : headerName === "picture" ? (
				value ? (
					<Image
						src={String(value)}
						alt={String(value)}
						width={imageSize}
						height={imageSize}
						loading="eager"
						className="rounded-xl"
						style={{
							height: `${imageSize}px`,
							width: `${imageSize}px`,
						}}
					/>
				) : (
					<Image
						src="/svgs/shopofort.svg"
						alt="picture"
						width={imageSize}
						height={imageSize}
						loading="eager"
						className="rounded-xl"
						style={{
							height: `${imageSize}px`,
							width: `${imageSize}px`,
						}}
					/>
				)
			) : headerName === "images" &&
				Array.isArray(value) &&
				value.length > 0 ? (
				<div
					className={clsx(
						"flex overflow-x-auto items-center",
						tooltip ? "gap-1" : "w-62 gap-2",
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
							className="rounded-md"
							style={{ height: `${imageSize}px`, width: "auto" }}
						/>
					))}
				</div>
			) : isDate(value) ? (
				formatDateTime(value)
			) : value === null || value === undefined || value === "" ? (
				"-"
			) : (
				String(value)
			)}
		</>
	);
}
