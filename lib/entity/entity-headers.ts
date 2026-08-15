type HeaderType = { label: string; width: number }[];

const CARTS_HEADER: HeaderType = [
	{ label: "Cart ID", width: 80 },
	{ label: "Total Amount", width: 250 },
	{ label: "User ID", width: 260 },
];

const CART_ITEMS_HEADER: HeaderType = [
	{ label: "Cart Item ID", width: 80 },
	{ label: "Unit Price", width: 100 },
	{ label: "Quantity", width: 250 },
	{ label: "Total Price", width: 100 },
	{ label: "Cart ID", width: 80 },
	{ label: "Product ID", width: 80 },
];

const CATEGORIES_HEADER: HeaderType = [
	{ label: "Category ID", width: 80 },
	{ label: "Name", width: 250 },
	{ label: "Gender", width: 80 },
];

const ORDERS_HEADER: HeaderType = [
	{ label: "Order ID", width: 80 },
	{ label: "Order Date", width: 250 },
	{ label: "Total Amount", width: 250 },
	{ label: "Order Status", width: 250 },
	{ label: "User ID", width: 260 },
];

const ORDER_ITEMS_HEADER: HeaderType = [
	{ label: "Order Item ID", width: 80 },
	{ label: "Price", width: 100 },
	{ label: "Quantity", width: 250 },
	{ label: "Order ID", width: 80 },
	{ label: "Product ID", width: 80 },
];

const PRODUCTS_HEADER: HeaderType = [
	{ label: "Product ID", width: 80 },
	{ label: "Name", width: 250 },
	{ label: "Price", width: 100 },
	{ label: "Brand", width: 250 },
	{ label: "Inventory", width: 250 },
	{ label: "Description", width: 150 },
	{ label: "Category ID", width: 80 },
	{ label: "Images", width: 264 },
];

const USERS_HEADER: HeaderType = [
	{ label: "User ID", width: 260 },
	{ label: "Picture", width: 72 },
	{ label: "Email", width: 200 },
	{ label: "First Name", width: 120 },
	{ label: "Last Name", width: 120 },
	{ label: "Suspended", width: 80 },
	{ label: "Total Sign-ins", width: 110 },
	{ label: "Failed Sign-ins", width: 110 },
	{ label: "Last Signed In", width: 160 },
	{ label: "Created On", width: 160 },
	{ label: "Updated On", width: 160 },
];

export {
	CART_ITEMS_HEADER,
	CARTS_HEADER,
	CATEGORIES_HEADER,
	type HeaderType,
	ORDER_ITEMS_HEADER,
	ORDERS_HEADER,
	PRODUCTS_HEADER,
	USERS_HEADER,
};
