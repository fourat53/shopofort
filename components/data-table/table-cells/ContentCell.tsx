import {
	ColorsCell,
	ImageCell,
	ImagesCell,
	OrderStatusCell,
	SizesCell,
} from "@/components/data-table/table-cells/SpecialCells";
import { formatDateTime, isValidDate } from "@/lib/date";
import type {
	CellType,
	EntityType,
	ProductColor,
	ProductSize,
	ValueType,
} from "@/lib/entity/types";
import { uploadConfig } from "@/lib/uploadthing/client";

interface ContentCellProps {
	value: CellType;
	entity: EntityType;
	headerName: string;
	tooltip?: boolean;
}

function cellTitle(value: CellType) {
	if (value === null || value === "") return undefined;
	if (typeof value === "boolean") return String(value);
	if (Array.isArray(value)) return value.join(", ");
	if (value instanceof Date || isValidDate(value))
		return formatDateTime(String(value));
	return String(value);
}

export default function ContentCell({
	value,
	entity,
	headerName,
	tooltip = false,
}: ContentCellProps) {
	const { field, multiple } = uploadConfig[entity] ?? {};
	return (
		<div title={cellTitle(value)} className="truncate">
			{value === null || value === "" ? (
				"-"
			) : typeof value === "boolean" ? (
				String(value)
			) : value instanceof Date || isValidDate(value) ? (
				formatDateTime(String(value))
			) : headerName === "orderStatus" ? (
				<OrderStatusCell value={String(value)} />
			) : Array.isArray(value) ? (
				headerName === "colors" ? (
					<ColorsCell value={value as ProductColor[]} />
				) : headerName === "sizes" ? (
					<SizesCell value={value as ProductSize[]} />
				) : (
					headerName === field && (
						<ImagesCell value={value as string[]} small={tooltip} />
					)
				)
			) : headerName === field && !multiple ? (
				<ImageCell value={String(value)} small={tooltip} />
			) : (
				String(value)
			)}
		</div>
	);
}
export type { ValueType };
