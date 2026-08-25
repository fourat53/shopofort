import { clsx } from "clsx";
import CheckBoxCell from "@/components/data-table/table-cells/CheckBoxCell";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import SortableTableHead from "@/components/data-table/table-cells/SortableTableHead";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Entity } from "@/lib/entity/current-entity";
import type { HasImage, HeaderType } from "@/lib/entity/entity-header";
import ListDialog from "../dialogs/list-dialog";

interface DataTableProps<T> {
	header: HeaderType;
	rows: T[];
	entity: Entity;
	hasImage?: HasImage;
}

export default function DataTableLayout<T extends { id: number | string }>({
	header,
	rows,
	entity,
	hasImage = "none",
}: DataTableProps<T>) {
	function getCellTitle(index: number, value: string | number) {
		return ["images", "picture"].includes(header[index].name)
			? undefined
			: String(value);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<CheckBoxCell<T> rows={rows} type="select-all" />
					</TableHead>
					{header.map((item) => (
						<SortableTableHead
							key={item.name}
							name={item.name}
							entity={entity}
						/>
					))}
					<TableHead border className="py-0 text-center">
						<CheckBoxCell<T> rows={rows} type="actions" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => (
					<TableRow key={row.id}>
						<TableCell className="w-8 min-w-8 max-w-8">
							<CheckBoxCell<T> rows={rows} id={row.id} type="select-one" />
						</TableCell>
						{Object.values(row).map((value, cIndex) => (
							<TableCell
								border
								key={`cell-${row.id}-${cIndex}`}
								title={getCellTitle(cIndex, value)}
								className={clsx(hasImage === "none" ? "h-[33.6px]" : "h-18.5")}
								style={{
									width: header[cIndex].width,
									minWidth: header[cIndex].width,
								}}
							>
								<ContentCell
									value={value}
									headerName={header[cIndex].name}
									cIndex={cIndex}
									rowId={row.id}
								/>
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
							<div className="flex items-center justify-center gap-1.5">
								<ListDialog id={row.id} />
								<EditDialog<T> rows={[row]} />
								<DeleteDialog ids={[row.id]} />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
