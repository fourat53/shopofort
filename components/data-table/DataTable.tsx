import { clsx } from "clsx";
import CellContent from "@/components/data-table/CellContent";
import CheckBoxCell from "@/components/data-table/CheckBoxCell";
import SortableTableHead from "@/components/data-table/SortableTableHead";
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
import type { HeaderType } from "@/lib/entity/entity-header";
import type { BasePathType } from "./DataTableLayout";

interface DataTableProps<T> {
	header: HeaderType;
	rows: T[];
	basePath: BasePathType;
	hasImage?: "none" | "one" | "multiple";
}

export default function DataTableLayout<T extends { id: number | string }>({
	header,
	rows,
	basePath,
	hasImage = "none",
}: DataTableProps<T>) {
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
							basePath={basePath}
						/>
					))}
					<TableHead border className="py-0 text-center">
						<CheckBoxCell<T> rows={rows} type="actions" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={header.length + 1}
							className="h-40 text-sm text-center"
						>
							No data available
						</TableCell>
					</TableRow>
				) : (
					rows.map((row) => (
						<TableRow key={row.id}>
							<TableCell className="w-8 min-w-8 max-w-8">
								<CheckBoxCell<T> rows={rows} row={row} type="select-one" />
							</TableCell>
							{Object.values(row).map((value, cIndex) => (
								<TableCell
									key={`cell-${row.id}-${cIndex}`}
									border
									title={
										["images", "picture"].includes(header[cIndex].name)
											? undefined
											: String(value)
									}
									className={clsx(hasImage !== "none" && "h-18")}
									style={{
										width: header[cIndex].width,
										minWidth: header[cIndex].width,
									}}
								>
									<CellContent
										value={value}
										headerName={header[cIndex].name}
										cIndex={cIndex}
										rowId={row.id}
									/>
								</TableCell>
							))}
							<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
								<div className="flex items-center justify-center gap-1.5">
									<EditDialog<T> row={row} />
									<DeleteDialog id={row.id} />
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
