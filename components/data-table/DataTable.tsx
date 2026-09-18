import CheckBoxCell from "@/components/data-table/table-cells/CheckBoxCells";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import SortHead from "@/components/data-table/table-cells/SortHead";
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
import type { HeaderItem } from "@/lib/entity/headers";
import {
	type EntityRow,
	type EntityType,
	OptionField,
} from "@/lib/entity/types";
import { isCellValue } from "@/lib/functions/client";
import { NoData } from "./ListDataTable";
import EntityTooltip from "./tooltips/EntityTooltip";

interface DataTableProps<T extends EntityType> {
	entity: T;
	header: HeaderItem[];
	rows: EntityRow<T>[];
	className?: string;
}

export default function DataTable<T extends EntityType>({
	entity,
	header,
	rows,
	className,
}: DataTableProps<T>) {
	return (
		<>
			{rows.length === 0 ? (
				<NoData className={className} />
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
							{header.map((item, index) => (
								<SortHead key={index} name={item.name} entity={entity} />
							))}
							<TableHead border className="py-0 text-center">
								<CheckBoxCell<T> entity={entity} rows={rows} type="actions" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row, rIndex) => (
							<TableRow key={rIndex}>
								<TableCell border={false} className="w-8 min-w-8 max-w-8">
									<CheckBoxCell<T>
										entity={entity}
										rows={rows}
										id={row.id}
										type="select-one"
									/>
								</TableCell>
								{Object.values(row).map((value, cIndex) => {
									return (
										isCellValue(value, header[cIndex]?.name) && (
											<TableCell
												key={cIndex}
												style={{
													width: header[cIndex]?.width,
													minWidth: header[cIndex]?.width,
												}}
											>
												{Object.values(OptionField).includes(
													header[cIndex]?.name as OptionField,
												) ? (
													<EntityTooltip<T>
														row={row}
														id={value as string | number}
														headerName={header[cIndex]?.name as OptionField}
													/>
												) : (
													<ContentCell
														value={value}
														entity={entity}
														headerName={header[cIndex]?.name}
													/>
												)}
											</TableCell>
										)
									);
								})}
								<TableCell className="w-26 min-w-26 max-w-26 py-0.5">
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
