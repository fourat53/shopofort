import type {
	CartItem as CartItemDb,
	Cart as CartType,
	Category as CategoryType,
	OrderItem as OrderItemDb,
	Order as OrderType,
	Product as ProductDb,
} from "@/prisma/generated/prisma/client";
import { Audience, OrderStatus } from "@/prisma/generated/prisma/enums";

// PLAIN MODEL TYPES ----------------------------------------------------------------------
type UserType = {
	id: string;
	picture: string;
	email: string;
	first_name: string;
	last_name: string;
	is_suspended: boolean;
	total_sign_ins: number;
	failed_sign_ins: number;
	last_signed_in: Date;
	created_on: Date;
	updated_on: Date;
};

type ProductType = Omit<ProductDb, "price" | "images"> & { price: number };

type CartItemType = Omit<CartItemDb, "unitPrice" | "totalPrice"> & {
	unitPrice: number;
	totalPrice: number;
};

type OrderItemType = Omit<OrderItemDb, "price"> & { price: number };

// MAPPED MODEL TYPES ---------------------------------------------------------------------
type User = UserType;

type Category = CategoryType & { products: ProductType[] };

type Product = ProductType & {
	images: string[];
	cartItems: CartItemType[];
	orderItems: OrderItemType[];
	category: CategoryType;
};

type Cart = CartType & { cartItems: CartItemType[] };

type CartItem = CartItemType & { cart: CartType; product: ProductType };

type Order = OrderType & { orderItems: OrderItemType[] };

type OrderItem = OrderItemType & { order: OrderType; product: ProductType };

// ENTITY TYPES ---------------------------------------------------------------------
enum EntityType {
	users = "users",
	carts = "carts",
	orders = "orders",
	products = "products",
	categories = "categories",
	"cart-items" = "cart-items",
	"order-items" = "order-items",
}

enum OptionField {
	userId = "userId",
	cartId = "cartId",
	orderId = "orderId",
	productId = "productId",
	categoryId = "categoryId",
	cartItemId = "cartItemId",
	orderItemId = "orderItemId",
}

// OTHER TYPES ---------------------------------------------------------------------
type StringNumber = string | number;

type ParameterType = Record<string, string | string[] | undefined>;

type CellValue = StringNumber | boolean | Date | null;

type ValueType =
	| CellValue
	| string[]
	| CategoryType
	| CartType
	| OrderType
	| ProductType
	| ProductType[]
	| CartItemType[]
	| OrderItemType[];

type RowType = Record<string, ValueType> & { id: StringNumber };

type ListRowType = ProductType | CartItemType | OrderItemType;

export type {
	Cart,
	CartItem,
	CartItemType,
	CartType,
	Category,
	CategoryType,
	CellValue,
	ListRowType,
	Order,
	OrderItem,
	OrderItemType,
	OrderType,
	ParameterType,
	Product,
	ProductType,
	RowType,
	StringNumber,
	User,
	UserType,
	ValueType,
};
export { Audience, EntityType, OptionField, OrderStatus };
