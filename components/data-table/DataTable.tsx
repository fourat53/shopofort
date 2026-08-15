import { IconSelect } from "@tabler/icons-react";
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
import { Checkbox } from "../ui/checkbox";

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
						<TableHead>
							<IconSelect className="size-4" />
						</TableHead>
						{header.map((item) => (
							<TableHead key={item.label} border>
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
								<TableCell className="w-8 max-w-8">
									<Checkbox />
								</TableCell>
								{Object.values(row).map((value, cIndex) => (
									<TableCell
										key={`cell-${row.id}-${cIndex}`}
										border
										title={
											["Images", "Picture"].includes(header[cIndex].label)
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
											headerName={header[cIndex].label}
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
