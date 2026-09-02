import CheckBoxCell from "@/components/data-table/table-cells/CheckBoxCell";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import SortableTableHead from "@/components/data-table/table-cells/SortableTableHead";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import ListDialog from "@/components/dialogs/list-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getFieldName } from "@/lib/entity/entity-functions";
import type { HeaderItem } from "@/lib/entity/entity-header";
import type { EntityType, StringNumber } from "@/lib/entity/types";

interface DataTableProps<T> {
	entity: EntityType;
	header: HeaderItem[];
	rows: T[];
	dialog?: boolean;
}

export default function DataTable<T extends { id: StringNumber }>({
	entity,
	header,
	rows,
	dialog = false,
}: DataTableProps<T>) {
	console.log(entity + ":\n" + JSON.stringify(rows.slice(5), null, 2));
	return (
		<>
			{rows.length === 0 ? (
				<div className="w-full h-40 bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground">
					No data available
				</div>
			) : (
				<Table>
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
								{Object.values(row).map((value, cIndex) => (
									<TableCell
										key={`cell-${row.id}-${cIndex}`}
										border
										className="h-[33.6px]"
										style={{
											width: header[cIndex].width,
											minWidth: header[cIndex].width,
										}}
									>
										<ContentCell
											rowId={row.id}
											headerName={header[cIndex].name}
											value={value}
										/>
									</TableCell>
								))}
								<TableCell border className="w-26 min-w-26 max-w-26 py-0.5">
									<div className="flex items-center justify-center gap-1.5">
										<ListDialog
											id={row.id as number}
											entity={entity}
											dialog={dialog}
										/>
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
