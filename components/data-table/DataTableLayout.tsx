import { Suspense } from "react";
import DataTable from "@/components/data-table/DataTable";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import type { HeaderType } from "@/lib/entity/entity-header";

type BasePathType =
	| "users"
	| "products"
	| "orders"
	| "carts"
	| "categories"
	| "cart-items"
	| "order-items";

interface DataTableLayoutProps<T> {
	totalPages: number;
	header: HeaderType;
	rows: T[];
	basePath: BasePathType;
	suspenseKey: Record<string, unknown>;
	hasImage?: "none" | "one" | "multiple";
}

export default function DataTableLayout<T extends { id: number | string }>({
	totalPages,
	header,
	rows,
	basePath,
	suspenseKey,
	hasImage = "none",
}: DataTableLayoutProps<T>) {
	return (
		<>
			<Suspense
				key={JSON.stringify(suspenseKey)}
				fallback={
					<DataTableSkeleton
						header={header}
						basePath={basePath}
						hasImage={hasImage}
					/>
				}
			>
				{rows.length === 0 ? (
					<div className="w-full h-60 flex items-center justify-center border rounded-lg text-muted-foreground">
						No data available
					</div>
				) : (
					<DataTable
						header={header}
						rows={rows}
						basePath={basePath}
						hasImage={hasImage}
					/>
				)}
			</Suspense>
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

export type { BasePathType };
