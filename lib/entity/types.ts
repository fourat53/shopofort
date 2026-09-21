import type { KindeUser as KindeUserType } from "@kinde-oss/kinde-auth-nextjs/types";
import type {
	Cart as CartDb,
	CartItem as CartItemDb,
	Category as CategoryType,
	Order as OrderDb,
	OrderItem as OrderItemDb,
	Product as ProductDb,
	ProductRating as ProductRatingDb,
} from "@/prisma/generated/prisma/client";
import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

// PLAIN MODEL TYPES
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

type ProductRatingType = Omit<ProductRatingDb, "rating"> & {
	rating: number;
};

type CartType = Omit<CartDb, "totalPrice"> & { totalPrice: number };

type CartItemType = CartItemDb;

type OrderType = Omit<OrderDb, "totalPrice"> & { totalPrice: number };

type OrderItemType = OrderItemDb;

// MAPPED MODEL TYPES
type KindeUser = KindeUserType<Record<string, unknown>>;

type User = UserType;

type Category = CategoryType & { products: ProductType[] };

type Product = ProductType & {
	cartItems: CartItemType[];
	orderItems: OrderItemType[];
	category: CategoryType;
	ratings: ProductRatingType[];
};

type ProductRating = ProductRatingType & {
	product: ProductType;
};

type Cart = CartType & { cartItems: CartItemType[] };

type CartItem = CartItemType & { cart: CartType; product: ProductType };

type Order = OrderType & { orderItems: OrderItemType[] };

type OrderItem = OrderItemType & { order: OrderType; product: ProductType };

// ENTITY TYPES
enum EntityType {
	users = "users",
	carts = "carts",
	orders = "orders",
	products = "products",
	categories = "categories",
	"cart-items" = "cart-items",
	"order-items" = "order-items",
}

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

// LIST ENTITY TYPES
enum ListEntityType {
	products = "products",
	"cart-items" = "cart-items",
	"order-items" = "order-items",
	ratings = "ratings",
}

type ListEntityRowMap = {
	products: ProductType;
	"cart-items": CartItemType;
	"order-items": OrderItemType;
	ratings: ProductRatingType;
};

type ListEntityRow<T extends ListEntityType> = ListEntityRowMap[T];

// OTHER TYPES
enum OptionField {
	userId = "userId",
	cartId = "cartId",
	orderId = "orderId",
	productId = "productId",
	categoryId = "categoryId",
	cartItemId = "cartItemId",
	orderItemId = "orderItemId",
}

type ParameterType = Record<string, string | string[] | undefined>;

type CellPrimitive = string | number | boolean | Date | null;
type CellArray = string[] | ProductColor[] | ProductSize[];
type CellType = CellPrimitive | CellArray;

type RowObject = CategoryType | CartType | OrderType | ProductType;
type RowList = ProductType | CartItemType | OrderItemType | ProductRatingType;
type ValueType = CellPrimitive | CellArray | RowObject | RowList[];

export type {
	Cart,
	CartItem,
	CartItemType,
	CartType,
	Category,
	CategoryType,
	CellArray,
	CellPrimitive,
	CellType,
	EntityRow,
	KindeUser,
	ListEntityRow,
	Order,
	OrderItem,
	OrderItemType,
	OrderType,
	ParameterType,
	Product,
	ProductRating,
	ProductType,
	RowList,
	RowObject,
	User,
	UserType,
	ValueType,
};
export {
	Audience,
	EntityType,
	ListEntityType,
	OptionField,
	OrderStatus,
	ProductColor,
	ProductSize,
};
