import DataTable from "@/components/data-table/DataTable";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import type {
	Cart,
	CartItem,
	Category,
	Order,
	OrderItem,
	Product,
	User,
} from "@/lib/types";

interface PageProps {
	searchParams: Promise<{ page?: string }>;
}

type HasImage = "none" | "one" | "multiple";

type EntityRowType =
	| ["users", User]
	| ["products", Product]
	| ["orders", Order]
	| ["carts", Cart]
	| ["categories", Category]
	| ["cart-items", CartItem]
	| ["order-items", OrderItem];

type EntityRowsType =
	| ["users", User[]]
	| ["products", Product[]]
	| ["orders", Order[]]
	| ["carts", Cart[]]
	| ["categories", Category[]]
	| ["cart-items", CartItem[]]
	| ["order-items", OrderItem[]];

interface DataTableLayoutProps {
	totalPages: number;
	header: string[];
	entityRows: EntityRowsType;
	hasImage?: HasImage;
}

export default function DataTableLayout({
	totalPages,
	header,
	entityRows,
	hasImage = "none",
}: DataTableLayoutProps) {
	const entity = entityRows[0];
	return (
		<>
			<DataTable header={header} hasImage={hasImage} entityRows={entityRows} />
			{totalPages > 1 && (
				<DataTablePagination
					basePath={`/${entity}`}
					totalPages={totalPages}
					className="absolute bottom-15"
				/>
			)}
		</>
	);
}

export type { EntityRowsType, EntityRowType, HasImage, PageProps };
