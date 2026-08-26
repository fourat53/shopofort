import { usePathname } from "next/navigation";
import { EntityType } from "@/lib/entity/types";

export default function CurrentEntity(): EntityType | "" {
	const pathname = usePathname();
	if (pathname.includes("/users")) return EntityType.users;
	else if (pathname.includes("/products")) return EntityType.products;
	else if (pathname.includes("/orders")) return EntityType.orders;
	else if (pathname.includes("/carts")) return EntityType.carts;
	else if (pathname.includes("/categories")) return EntityType.categories;
	else if (pathname.includes("/cart-items")) return EntityType["cart-items"];
	else if (pathname.includes("/order-items")) return EntityType["order-items"];
	return "";
}
