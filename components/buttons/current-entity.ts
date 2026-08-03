import { usePathname } from "next/navigation";

function CurrentEntity() {
	const pathname = usePathname();
	let entity: string = "";

	if (pathname.includes("/users")) entity = "user";
	else if (pathname.includes("/products")) entity = "product";
	else if (pathname.includes("/orders")) entity = "order";
	else if (pathname.includes("/carts")) entity = "cart";
	else if (pathname.includes("/categories")) entity = "category";
	else if (pathname.includes("/cart-items")) entity = "cartItem";
	else if (pathname.includes("/order-items")) entity = "orderItem";

	return entity;
}

function entityFromHeaderName(headerName: string, pathname: string) {
	let entity = "";
	const lowerHeader = headerName.toLowerCase();

	if (lowerHeader.includes("user")) entity = "user";
	else if (lowerHeader.includes("product")) entity = "product";
	else if (lowerHeader.includes("order") && !lowerHeader.includes("item"))
		entity = "order";
	else if (lowerHeader.includes("order item")) entity = "orderItem";
	else if (lowerHeader.includes("cart item")) entity = "cartItem";
	else if (lowerHeader.includes("cart")) entity = "cart";
	else if (lowerHeader.includes("category")) entity = "category";
	else if (lowerHeader === "id") {
		if (pathname.includes("users")) entity = "user";
		else if (pathname.includes("products")) entity = "product";
		else if (pathname.includes("orders")) entity = "order";
		else if (pathname.includes("categories")) entity = "category";
		else if (pathname.includes("carts")) entity = "cart";
	}

	return entity;
}

export { CurrentEntity, entityFromHeaderName };
