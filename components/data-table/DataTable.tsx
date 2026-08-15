import { clsx } from "clsx";
import CellContent from "@/components/data-table/CellContent";
import DataTablePagination from "@/components/data-table/DataTablePagination";
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
import type { HeaderType } from "@/lib/entity/entity-headers";

interface PageProps {
	searchParams: Promise<{ page?: string }>;
}

type HasImage = "none" | "one" | "multiple";

type BasePathType =
	| "users"
	| "products"
	| "orders"
	| "carts"
	| "categories"
	| "cart-items"
	| "order-items";

interface DataTableProps<T> {
	totalPages: number;
	header: HeaderType;
	rows: T[];
	basePath: BasePathType;
	hasImage?: HasImage;
}

export default function DataTable<T extends { id: number | string }>({
	totalPages,
	header,
	rows,
	basePath,
	hasImage = "none",
}: DataTableProps<T>) {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						{header.map((item, index) => (
							<TableHead key={item.label} border={index !== 0}>
								{item.label}
							</TableHead>
						))}
						<TableHead border>Actions</TableHead>
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
								{Object.values(row).map((value, colIndex) => (
									<TableCell
										key={`cell-${row.id}-${colIndex}`}
										border={colIndex !== 0}
										title={
											["Images", "Picture"].includes(header[colIndex].label)
												? undefined
												: String(value)
										}
										className={clsx("truncate", hasImage !== "none" && "h-18")}
										style={{
											width: `${header[colIndex].width}px`,
											minWidth: `${header[colIndex].width}px`,
											maxWidth: `${header[colIndex].width}px`,
										}}
									>
										<CellContent
											value={value}
											headerName={header[colIndex].label}
											colIndex={colIndex}
											rowId={row.id}
										/>
									</TableCell>
								))}
								<TableCell border className="py-0.5 w-30 min-w-30 max-w-30">
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
			{totalPages > 1 && (
				<DataTablePagination
					basePath={basePath}
					totalPages={totalPages}
					className="absolute bottom-15"
				/>
			)}
		</>
	);
}

export type { BasePathType, HasImage, PageProps };
