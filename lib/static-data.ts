import type { SelectOption } from "@/components/form-items/select";

const roleItems: SelectOption[] = [
	{ label: "User", value: "USER" },
	{ label: "Admin", value: "ADMIN" },
	{ label: "Guest", value: "GUEST" },
];

const orderStatusItems: SelectOption[] = [
	{ label: "Pending", value: "PENDING" },
	{ label: "Processing", value: "PROCESSING" },
	{ label: "Shipped", value: "SHIPPED" },
	{ label: "Delivered", value: "DELIVERED" },
	{ label: "Cancelled", value: "CANCELLED" },
];

const genderItems: SelectOption[] = [
	{ label: "Male", value: "MALE" },
	{ label: "Female", value: "FEMALE" },
];

const booleanItems: SelectOption[] = [
	{ label: "Yes", value: "true" },
	{ label: "No", value: "false" },
];

export { booleanItems, genderItems, orderStatusItems, roleItems };
