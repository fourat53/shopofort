import { clsx } from "clsx";
import Image from "next/image";
import EntityTooltip from "@/components/data-table/table-cells/EntityTooltip";
import { formatDateTime, isDate } from "@/lib/date-format";
import { OrderStatus, type StringNumber } from "@/lib/entity/types";

interface CellContentProps {
	value: string | string[];
	headerName: string;
	cIndex?: number;
	rowId?: StringNumber;
	tooltip?: boolean;
}

function cellTitle(value: unknown, name: string) {
	if (Array.isArray(value) || name.endsWith("Id")) return undefined;
	if (isDate(value)) return formatDateTime(value);
	return String(value);
}

export default function ContentCell({
	value,
	headerName,
	cIndex,
	rowId,
	tooltip = false,
}: CellContentProps) {
	const imageSize = tooltip ? "32px" : "58px";
	const isForeignKey =
		cIndex && cIndex > 0 && !Array.isArray(value) && headerName.endsWith("Id");
	return (
		<div title={cellTitle(value, headerName)} className="truncate">
			{isForeignKey ? (
				<EntityTooltip headerName={headerName} idValue={value} />
			) : headerName === "orderStatus" ? (
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
					{value}
				</p>
			) : headerName === "picture" ? (
				value ? (
					<Image
						src={String(value)}
						alt={String(value)}
						width={1000}
						height={1000}
						loading="eager"
						className="rounded-xl"
						style={{ height: imageSize, width: imageSize }}
					/>
				) : (
					<Image
						src="/svgs/shopofort.svg"
						alt="picture"
						width={1000}
						height={1000}
						loading="eager"
						className="rounded-xl"
						style={{ height: imageSize, width: imageSize }}
					/>
				)
			) : headerName === "images" ? (
				Array.isArray(value) && value.length > 0 ? (
					<div
						className={clsx(
							"flex overflow-x-auto items-center",
							tooltip ? "gap-1" : "gap-2",
						)}
					>
						{value.map((img) => (
							<Image
								key={`${rowId}-${img}`}
								src={img}
								alt={`image-${img}`}
								loading="eager"
								width={1000}
								height={1000}
								className="rounded-md"
								style={{ height: imageSize, width: "auto" }}
							/>
						))}
					</div>
				) : tooltip ? (
					"-"
				) : (
					<div className="w-full h-14.5 flex items-center justify-center text-muted-foreground">
						No images
					</div>
				)
			) : isDate(value) ? (
				formatDateTime(value)
			) : !value ? (
				"-"
			) : (
				value
			)}
		</div>
	);
}
