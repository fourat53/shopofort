import EntityTooltip from "@/components/data-table/tooltips/EntityTooltip";
import { formatDateTime, isValidDate } from "@/lib/date";
import {
	type CellValue,
	type EntityType,
	OptionField,
	type RowType,
	type ValueType,
} from "@/lib/entity/types";
import { uploadConfig } from "@/lib/uploadthing/client";
import {
	ImageCell,
	OrderStatusCell,
} from "@/components/data-table/table-cells/SpecialCells";

interface ContentCellProps<T> {
	row?: T;
	value: CellValue;
	entity: EntityType;
	headerName: string;
	tooltip?: boolean;
}

function cellTitle(value: CellValue, name: string) {
	if (
		Object.values(OptionField).includes(name as OptionField) ||
		value === null ||
		value === undefined
	)
		return undefined;
	if (typeof value === "boolean") return String(value);
	if (value instanceof Date || isValidDate(value))
		return formatDateTime(String(value));
	return String(value);
}

export default function ContentCell<T extends RowType>({
	row,
	value,
	entity,
	headerName,
	tooltip = false,
}: ContentCellProps<T>) {
	const { field, multiple } = uploadConfig[entity] ?? {};
	const nullValue =
		value === "null" || value === undefined || value === null || value === "";
	return (
		<div title={cellTitle(value, headerName)} className="truncate">
			{nullValue ? (
				"-"
			) : typeof value === "boolean" ? (
				String(value)
			) : value instanceof Date || isValidDate(value) ? (
				formatDateTime(String(value))
			) : Object.values(OptionField).includes(headerName as OptionField) &&
				!tooltip ? (
				<EntityTooltip<T>
					row={row}
					id={value}
					headerName={headerName as OptionField}
				/>
			) : headerName === "orderStatus" && typeof value === "string" ? (
				<OrderStatusCell value={value} />
			) : headerName === field && !multiple && typeof value === "string" ? (
				<ImageCell value={value} tooltip={tooltip} />
			) : (
				value
			)}
		</div>
	);
}
export type { ValueType };
