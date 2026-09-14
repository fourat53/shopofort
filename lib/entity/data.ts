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
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1dSEnXS38UzQDyw3pbxj5NER2dfKCqAiaeTZ4",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1HY2IgAjCr8OP1s6Zek2MxtBjz7J3gWafYvGm",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1OZpUAhisj0Kx9E3cfUeqJPzawNtp1i7Arldn",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1qiBUq5TdePjMhgUx0NG7CZ2QmW6cwVutXrB4",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1r8FbS36VaZTILwc0PQ58hAjNdqBisDmKEobR",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1gF95NvCCknIPeJzQ85qvUb16dfEiKtjhFTDZ",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1K8JmFgqXz6dZfUoSWynaNQ13kGwrcsxRB0ep",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1eMvNvYetLGXQlqnsWAfVUD4icET8mZxkOBJa",
];

const categoryNames: string[] = [
	"T-Shirts",
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
