import ContentCell from "@/components/data-table/table-cells/ConentCell";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getEntityTooltip,
	getFieldName,
	getSingleName,
} from "@/lib/entity/functions";
import type { CellValue, OptionField, RowType } from "@/lib/entity/types";

interface StaticTooltipProps<T> {
	row?: T;
	id: string | number;
	headerName: OptionField;
}

export default function StaticTooltip<T extends RowType>({
	row,
	id,
	headerName,
}: StaticTooltipProps<T>) {
	const entity = getEntityTooltip(headerName);

	if (!entity || !row) return;

	return (
		<Tooltip>
			<TooltipTrigger className="w-fit underline cursor-pointer hover:text-primary transition-colors text-left">
				{id ? id : "-"}
			</TooltipTrigger>
			<TooltipContent
				side="left"
				className="w-70 flex flex-col gap-px shadow-lg bg-background border text-foreground rounded-lg"
			>
				<p className="w-full pb-1 text-primary text-center font-semibold capitalize">
					{getSingleName(entity) + " details"}
				</p>
				<div className="w-full border-t pb-0.5" />
				{Object.entries(row).map(([name, value]) => {
					if (
						typeof value !== "object" ||
						Array.isArray(value) ||
						headerName !== name + "Id"
					)
						return null;
					if (!value) return "-";
					return Object.entries(value).map(([objectName, objectValue]) => {
						if (Array.isArray(objectValue)) return null;
						return (
							<DataRow
								key={`${name}-${objectName}`}
								name={objectName}
								value={objectValue as CellValue}
							/>
						);
					});
				})}
			</TooltipContent>
		</Tooltip>
	);
}

export function DataRow({ name, value }: { name: string; value: CellValue }) {
	return (
		<div className="grid grid-cols-[2fr_5fr] gap-x-1">
			<p className="w-22 font-medium text-muted-foreground">
				{getFieldName(name)}:
			</p>
			<ContentCell headerName={name} value={value} tooltip />
		</div>
	);
}
