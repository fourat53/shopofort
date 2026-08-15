type HeaderType = { label: string; width?: string }[];

const CARTS_HEADER: HeaderType = [
	{ label: "Cart ID", width: "150px" },
	{ label: "Total Amount" },
	{ label: "User ID", width: "300px" },
];

const CART_ITEMS_HEADER: HeaderType = [
	{ label: "Cart Item ID", width: "150px" },
	{ label: "Unit Price", width: "150px" },
	{ label: "Quantity", width: "150px" },
	{ label: "Total Price" },
	{ label: "Cart ID", width: "150px" },
	{ label: "Product ID", width: "150px" },
];

const CATEGORIES_HEADER: HeaderType = [
	{ label: "Category ID", width: "150px" },
	{ label: "Name" },
	{ label: "Gender", width: "300px" },
];

const ORDERS_HEADER: HeaderType = [
	{ label: "Order ID", width: "150px" },
	{ label: "Order Date", width: "160px" },
	{ label: "Total Amount", width: "150px" },
	{ label: "Order Status" },
	{ label: "User ID", width: "255px" },
];

const ORDER_ITEMS_HEADER: HeaderType = [
	{ label: "Order Item ID", width: "150px" },
	{ label: "Price" },
	{ label: "Quantity", width: "150px" },
	{ label: "Order ID", width: "150px" },
	{ label: "Product ID", width: "150px" },
];

const PRODUCTS_HEADER: HeaderType = [
	{ label: "Product ID", width: "108px" },
	{ label: "Name", width: "160px" },
	{ label: "Price", width: "100px" },
	{ label: "Brand", width: "120px" },
	{ label: "Inventory", width: "100px" },
	{ label: "Description", width: "264px" },
	{ label: "Category ID", width: "100px" },
	{ label: "Images", width: "264px" },
];

const USERS_HEADER: HeaderType = [
	{ label: "User ID", width: "255px" },
	{ label: "Picture", width: " 72px" },
	{ label: "Email", width: "264px" },
	{ label: "First Name", width: "120px" },
	{ label: "Last Name", width: "120px" },
	{ label: "Suspended", width: " 80px" },
	{ label: "Total Sign-ins", width: "105px" },
	{ label: "Failed Sign-ins", width: "105px" },
	{ label: "Last Signed In", width: "160px" },
	{ label: "Created On", width: "160px" },
	{ label: "Updated On", width: "160px" },
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
