import type {
	Cart,
	CartItem as CartItemType,
	Category,
	Order,
	OrderItem as OrderItemType,
	Product as ProductType,
} from "@/prisma/generated/prisma/client";
import { Gender, OrderStatus } from "@/prisma/generated/prisma/enums";

// MODEL TYPES ----------------------------------------------------------------------

type User = {
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

type Product = Omit<ProductType, "price"> & { price: number };

type CartItem = Omit<CartItemType, "unitPrice" | "totalPrice"> & {
	unitPrice: number;
	totalPrice: number;
};

type OrderItem = Omit<OrderItemType, "price"> & { price: number };

// OTHER TYPES ---------------------------------------------------------------------

enum EntityType {
	users = "users",
	carts = "carts",
	orders = "orders",
	products = "products",
	categories = "categories",
	"cart-items" = "cart-items",
	"order-items" = "order-items",
}

type StringNumber = string | number;

type ParameterType = Record<string, string | string[] | undefined>;

export type {
	Cart,
	CartItem,
	Category,
	Order,
	OrderItem,
	ParameterType,
	Product,
	StringNumber,
	User,
};
export { EntityType, Gender, OrderStatus };
