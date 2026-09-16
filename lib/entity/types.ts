import type {
	KindeRole,
	KindeUser as KindeUserType,
} from "@kinde-oss/kinde-auth-nextjs/types";
import type {
	Cart as CartDb,
	CartItem as CartItemDb,
	Category as CategoryType,
	Order as OrderDb,
	OrderItem as OrderItemDb,
	Prisma,
	Product as ProductDb,
} from "@/prisma/generated/prisma/client";
import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

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

type ProductType = Omit<ProductDb, "price" | "rating"> & {
	price: number;
	rating: number;
};

type CartType = Omit<CartDb, "totalPrice"> & { totalPrice: number };

type CartItemType = Omit<CartItemDb, "unitPrice"> & { unitPrice: number };

type OrderType = Omit<OrderDb, "totalPrice"> & { totalPrice: number };

type OrderItemType = Omit<OrderItemDb, "unitPrice"> & { unitPrice: number };

// MAPPED MODEL TYPES ---------------------------------------------------------------------
type Role = KindeRole;

type KindeUser = KindeUserType<Record<string, unknown>>;

type User = UserType;

type Category = CategoryType & { products: ProductType[] };

type Product = ProductType & {
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

type EntityListType =
	| EntityType.products
	| EntityType.categories
	| EntityType.carts
	| EntityType.orders;

type EntityRowMap = {
	users: User;
	carts: Cart;
	orders: Order;
	products: Product;
	categories: Category;
	"cart-items": CartItem;
	"order-items": OrderItem;
};

type EntityRow<T extends EntityType> = EntityRowMap[T];

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
type ParameterType = Record<string, string | string[] | undefined>;

type ValueCellType =
	| string
	| number
	| boolean
	| Date
	| string[]
	| ProductColor[]
	| ProductSize[]
	| null;

type RowObjectType = CategoryType | CartType | OrderType | ProductType;

type RowListType = ProductType | CartItemType | OrderItemType;

type ValueType = ValueCellType | RowObjectType | RowListType[];

export type {
	Cart,
	CartItem,
	CartItemType,
	CartType,
	Category,
	CategoryType,
	EntityListType,
	EntityRow,
	KindeUser,
	Order,
	OrderItem,
	OrderItemType,
	OrderType,
	ParameterType,
	Prisma,
	Product,
	ProductType,
	Role,
	User,
	UserType,
	ValueCellType,
	ValueType,
};
export {
	Audience,
	EntityType,
	OptionField,
	OrderStatus,
	ProductColor,
	ProductSize,
};
