import { clsx } from "clsx";
import Image from "next/image";
import EntityTooltip from "@/components/data-table/table-cells/EntityTooltip";
import { formatDate, isValidDate } from "@/lib/date";
import {
	OptionField,
	OrderStatus,
	type StringNumber,
} from "@/lib/entity/types";

type ValueType = StringNumber | boolean | undefined | null;

interface CellContentProps {
	value: ValueType;
	headerName: string;
	tooltip?: boolean;
}

function cellTitle(value: ValueType, name: string) {
	if (
		Object.values(OptionField).includes(name as OptionField) ||
		value === null ||
		value === undefined
	)
		return undefined;
	if (typeof value === "boolean") return String(value);
	if (isValidDate(value)) return formatDate(String(value));
	return String(value);
}

export default function ContentCell({
	value,
	headerName,
	tooltip = false,
}: CellContentProps) {
	const imageSize = tooltip ? "32px" : "58px";

	return (
		<div title={cellTitle(value, headerName)} className="truncate">
			{value === null || value === undefined ? (
				"-"
			) : typeof value === "boolean" ? (
				String(value)
			) : isValidDate(value) ? (
				formatDate(String(value))
			) : Object.values(OptionField).includes(headerName as OptionField) &&
				headerName !== "userId" ? (
				<EntityTooltip headerName={headerName as OptionField} idValue={value} />
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
			) : (
				value
			)}
		</div>
	);
}
export type { ValueType };
