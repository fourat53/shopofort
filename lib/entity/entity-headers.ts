type HeaderType = { label: string; width: number }[];

const CARTS_HEADER: HeaderType = [
	{ label: "Cart ID", width: 100 },
	{ label: "Total Amount", width: 150 },
	{ label: "User ID", width: 300 },
];

const CART_ITEMS_HEADER: HeaderType = [
	{ label: "Cart Item ID", width: 100 },
	{ label: "Unit Price", width: 100 },
	{ label: "Quantity", width: 100 },
	{ label: "Total Price", width: 100 },
	{ label: "Cart ID", width: 100 },
	{ label: "Product ID", width: 100 },
];

const CATEGORIES_HEADER: HeaderType = [
	{ label: "Category ID", width: 100 },
	{ label: "Name", width: 300 },
	{ label: "Gender", width: 200 },
];

const ORDERS_HEADER: HeaderType = [
	{ label: "Order ID", width: 100 },
	{ label: "Order Date", width: 160 },
	{ label: "Total Amount", width: 100 },
	{ label: "Order Status", width: 160 },
	{ label: "User ID", width: 260 },
];

const ORDER_ITEMS_HEADER: HeaderType = [
	{ label: "Order Item ID", width: 100 },
	{ label: "Price", width: 100 },
	{ label: "Quantity", width: 100 },
	{ label: "Order ID", width: 100 },
	{ label: "Product ID", width: 100 },
];

const PRODUCTS_HEADER: HeaderType = [
	{ label: "Product ID", width: 100 },
	{ label: "Name", width: 160 },
	{ label: "Price", width: 100 },
	{ label: "Brand", width: 160 },
	{ label: "Inventory", width: 100 },
	{ label: "Description", width: 200 },
	{ label: "Category ID", width: 100 },
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
