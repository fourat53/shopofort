import { cn } from "cn";
import ContentCell from "@/components/data-table/table-cells/ContentCell";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { HeaderItem } from "@/lib/entity/headers";
import type {
	EntityType,
	ListEntityRow,
	ListEntityType,
} from "@/lib/entity/types";
import { getFieldName, isCellValue } from "@/lib/functions/client";

interface ListDataTableProps<T extends ListEntityType> {
	entity: T;
	header: HeaderItem[];
	rows: ListEntityRow<T>[];
	className?: string;
}

export default function ListDataTable<T extends ListEntityType>({
	entity,
	header,
	rows,
	className,
}: ListDataTableProps<T>) {
	return (
		<>
			{rows.length === 0 ? (
				<NoData className={className} />
			) : (
				<Table className="border-b" parentClassName={className}>
					<TableHeader>
						<TableRow>
							{header.map((item, index) => (
								<TableHead key={index} border={index !== 0}>
									{getFieldName(item.name)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row, rIndex) => (
							<TableRow key={rIndex}>
								{Object.values(row).map((value, cIndex) => {
									return (
										isCellValue(value, header[cIndex]?.name) && (
											<TableCell
												key={cIndex}
												border={cIndex !== 0}
												style={{
													width: header[cIndex]?.width,
													minWidth: header[cIndex]?.width,
												}}
											>
												<ContentCell
													value={value}
													entity={entity as unknown as EntityType}
													headerName={header[cIndex]?.name}
												/>
											</TableCell>
										)
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}

function NoData({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"min-h-40 w-full bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground",
				className,
			)}
		>
			No data available
		</div>
	);
}

export { NoData };
