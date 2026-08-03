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

interface DataTableLayoutBaseProps {
	totalPages: number;
	header: string[];
	hasImage?: HasImage;
}

type DataTableLayoutProps = DataTableLayoutBaseProps & {
	entityRows: EntityRowsType;
};

async function DataTableLayout({
	totalPages,
	header,
	hasImage = "none",
	entityRows,
}: DataTableLayoutProps) {
	const entity = entityRows[0];
	return (
		<>
			<DataTable header={header} hasImage={hasImage} entityRows={entityRows} />
			{totalPages > 1 && (
				<DataTablePagination basePath={`/${entity}`} totalPages={totalPages} />
			)}
		</>
	);
}

export type { EntityRowsType, EntityRowType, HasImage, PageProps };
export { DataTableLayout };
