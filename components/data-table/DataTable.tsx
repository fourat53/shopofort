import CheckBoxCell from "@/components/data-table/table-cells/CheckBoxCell";
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
import { getFieldName } from "@/lib/entity/functions";
import type { HeaderItem } from "@/lib/entity/headers";
import type { EntityType, RowType } from "@/lib/entity/types";
import ListDialog from "../dialogs/list-dialog";
import ContentCell from "./table-cells/ConentCell";
import { cn } from "cn";

interface DataTableProps<T> {
	entity: EntityType;
	header: HeaderItem[];
	rows: T[];
	className?: string;
	dialog?: boolean;
}

export default function DataTable<T extends RowType>({
	entity,
	header,
	rows,
	className,
	dialog = false,
}: DataTableProps<T>) {
	return (
		<>
			{rows.length === 0 ? (
				<div
					className={cn(
						"w-full h-[calc(100vh-152px)] bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground",
						className,
					)}
				>
					No data available
				</div>
			) : (
				<Table parentClassName={className}>
					<TableHeader>
						<TableRow>
							<TableHead>
								<CheckBoxCell<T>
									entity={entity}
									rows={rows}
									type="select-all"
								/>
							</TableHead>
							{header.map((item) =>
								dialog ? (
									<TableHead key={item.name} border>
										{getFieldName(item.name)}
									</TableHead>
								) : (
									<SortableTableHead
										key={item.name}
										name={item.name}
										entity={entity}
									/>
								),
							)}
							<TableHead border className="py-0 text-center">
								<CheckBoxCell<T> entity={entity} rows={rows} type="actions" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								<TableCell className="w-8 min-w-8 max-w-8">
									<CheckBoxCell<T>
										entity={entity}
										rows={rows}
										id={row.id}
										type="select-one"
									/>
								</TableCell>
								{Object.values(row).map(
									(value, cIndex) =>
										typeof value !== "object" && (
											<TableCell
												key={`cell-${row.id}-${cIndex}`}
												border
												className="h-[33.6px] truncate"
												style={{
													width: header[cIndex]?.width,
													minWidth: header[cIndex]?.width,
												}}
											>
												<ContentCell<T>
													row={row}
													value={value}
													headerName={header[cIndex]?.name}
													tooltip={dialog}
												/>
											</TableCell>
										),
								)}
								<TableCell border className="w-26 min-w-26 max-w-26 py-0.5">
									<div className="flex items-center justify-center gap-1.5">
										<ListDialog<T> entity={entity} row={row} />
										<EditDialog<T> entity={entity} rows={[row]} />
										<DeleteDialog entity={entity} ids={[row.id]} />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
