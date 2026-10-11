import type { KindeUser as KindeUserType } from "@kinde-oss/kinde-auth-nextjs/types";
import type { z } from "zod";
import type {
	CartItemSchema,
	CartSchema,
	CategorySchema,
	OrderItemSchema,
	OrderSchema,
	ProductRatingSchema,
	ProductSchema,
	UserSchema,
} from "@/lib/entity/schemas";
import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

// PLAIN MODEL TYPES
type UserType = z.infer<typeof UserSchema>;

type ProductType = z.infer<typeof ProductSchema>;

type ProductRatingType = z.infer<typeof ProductRatingSchema>;

type CartType = z.infer<typeof CartSchema>;

type CartItemType = z.infer<typeof CartItemSchema>;

type OrderType = z.infer<typeof OrderSchema>;

type OrderItemType = z.infer<typeof OrderItemSchema>;

type CategoryType = z.infer<typeof CategorySchema>;

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
