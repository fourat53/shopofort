import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

const randomFloat = (min: number, max: number) => {
	return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomList = <T>(list: T[], min = 1, max = 6) => {
	const count = randomInt(min, Math.min(max, list.length));
	return [...list].sort(() => Math.random() - 0.5).slice(0, count);
};

const brands: string[] = ["Nike", "Adidas", "Puma", "Zara", "H&M"];

const productNames: string[] = [
	"Classic Cotton T-Shirt",
	"Slim Fit Denim Jeans",
	"Cozy Fleece Hoodie",
	"Summer Flowy Dress",
	"Leather Biker Jacket",
	"Comfortable Sweatpants",
	"Formal Oxford Shirt",
	"Casual Chino Shorts",
];

const productImages: string[] = [
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo16B6Etyubd6y8AerCLnmP4pO2oYQcvkDi3sTh",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1z3jF4wTmOKhGVe8JMNmxW7lBuf4CIA1oY0kq",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1pHFCR6NJKfqIQvZM9wDhRWi180rajoxYzNy3",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1GJLfpBoSLZWxzps1HQMd3r25uA86l7IgBakh",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1eMCKhDktLGXQlqnsWAfVUD4icET8mZxkOBJa",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1m91a7IOdpDz3jaRkXHObuF6EIYn02ANgJriC",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1Ro13hHpsO0JALNUGj9YF7MkvIy5anE1wdZpf",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1wxaeOPDqZ1K7YdlIeHV2zg89X5LPNMiyD0SW",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1ikXgzuewu2QODTagsXl54K9LVBmEYtcM6yHp",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1x6NA13xhwmp4r6UFoLAPXJWvkEn8GBblgOV1",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1mmDPeIdpDz3jaRkXHObuF6EIYn02ANgJriCZ",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo16RVx0Jubd6y8AerCLnmP4pO2oYQcvkDi3sTh",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1ynHgF8SOXUdQau8ltFKn1BApjRDfESxMhTbJ",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1pQwyYzNJKfqIQvZM9wDhRWi180rajoxYzNy3",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1MbAzgN4tGL4DjZ6hm1VUyubHwRFo3AYJ5XBd",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1huppXHyrriBnpZTXM04JI9DKj1YGxQWSbgsl",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1w8KBZODqZ1K7YdlIeHV2zg89X5LPNMiyD0SW",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1pX1QE8NJKfqIQvZM9wDhRWi180rajoxYzNy3",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1WiTKxJ55eGkvxaDMpX6A8YIsfPOVcB49irml",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo16PCRcRubd6y8AerCLnmP4pO2oYQcvkDi3sTh",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1mPcbnQdpDz3jaRkXHObuF6EIYn02ANgJriCZ",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1Zo0bF6fvpoJIsqGOzycuQ57iB9SM3bmaxALC",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1ojMDo1VZ2P9mNrlgLv5wUYSTyFVO7bxst6XK",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1NrXdxaP2Lzm8sdJ4Ox9AoUPNk0RCWn6ecwMv",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1ZAOiygfvpoJIsqGOzycuQ57iB9SM3bmaxALC",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1utsnlDYr8NFd4cgQVLXDTxKAbG7iHsWMO5oS",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo15R8QR9ACq8uJxVAQSZ3WkKDr21dt9evhIfz0",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1Q4IL2SgfAsRmSve8UwoMZTbLEJ6YK415Nc79",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1MkLyKf4tGL4DjZ6hm1VUyubHwRFo3AYJ5XBd",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1CZKhkmnAmbOVgdXyvQ4qYcU2lu8pwGszTrLI",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1jZfZAo2sgvo1dwWe6ZqE2NalJcz5YxAfyIbr",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1XreYzHyr5wxGIo0iQcTlM6jkaBgKHWhU4CEd",
];

const categoryNames: string[] = [
	"T-Shirts",
	"Sweaters",
	"Hoodies",
	"Trousers",
	"Shorts",
	"Skirts",
	"Dresses",
	"Jackets",
	"Coats",
];

enum BooleanEnum {
	TRUE = "true",
	FALSE = "false",
}

const booleanValues = Object.values(BooleanEnum);

const productColors = Object.values(ProductColor);
const productSizes = Object.values(ProductSize);
const audiences = Object.values(Audience);
const orderStatuses = Object.values(OrderStatus);

export {
	audiences,
	type BooleanEnum,
	booleanValues,
	brands,
	categoryNames,
	orderStatuses,
	productColors,
	productImages,
	productNames,
	productSizes,
	randomFloat,
	randomInt,
	randomList,
};
