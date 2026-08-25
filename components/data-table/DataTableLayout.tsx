import DataTable from "@/components/data-table/DataTable";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import type { Entity } from "@/lib/entity/current-entity";
import type { HasImage, HeaderType } from "@/lib/entity/entity-header";

interface DataTableLayoutProps<T> {
	entity: Entity;
	header: HeaderType;
	rows: T[];
	totalPages: number;
	hasImage?: HasImage;
}

export default function DataTableLayout<T extends { id: number | string }>({
	entity,
	header,
	rows,
	totalPages,
	hasImage = "none",
}: DataTableLayoutProps<T>) {
	return (
		<>
			{rows.length === 0 ? (
				<div className="w-full bg-sidebar h-60 flex items-center justify-center border rounded-lg text-muted-foreground">
					No data available
				</div>
			) : (
				<DataTable
					entity={entity}
					header={header}
					hasImage={hasImage}
					rows={rows}
				/>
			)}
			{totalPages > 1 && (
				<DataTablePagination
					entity={entity}
					totalPages={totalPages}
					className="absolute bottom-15"
				/>
			)}
		</>
	);
}
