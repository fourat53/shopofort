import DeleteButton from "@/components/buttons/delete-button";
import EditButton from "@/components/buttons/edit-button";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CellContent from "./CellContent";

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
	header: string[];
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
							<TableHead
								key={item}
								border={index !== 0}
								className={
									item === "User ID"
										? "w-64"
										: hasImage === "multiple"
											? "w-62 text-center"
											: hasImage === "one"
												? "min-w-18 text-center"
												: ""
								}
							>
								{item}
							</TableHead>
						))}
						<TableHead border className="w-20 text-center">
							Actions
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
								{Object.values(row).map((value, colIndex) => (
									<TableCell
										title={
											["Images", "Picture"].includes(header[colIndex])
												? undefined
												: String(value)
										}
										border={colIndex !== 0}
										key={`cell-${row.id}-${colIndex}`}
										className={
											hasImage === "multiple"
												? "h-18.5"
												: hasImage === "one"
													? "h-18.5"
													: "h-8.5"
										}
									>
										<CellContent
											value={value}
											headerName={header[colIndex]}
											colIndex={colIndex}
											rowId={row.id}
										/>
									</TableCell>
								))}
								<TableCell border className="py-0.5 w-20">
									<div className="flex items-center justify-center gap-1.5">
										<EditButton<T> row={row} />
										<DeleteButton id={row.id} />
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
