"use server";

import type { Product } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q") || "";
	const limit = parseInt(searchParams.get("limit") || "5", 10);

	if (!query || query.length < 2) {
		return Response.json({ products: [] });
	}

	const searchTerms = query.split(" ").filter(Boolean);

	const where = {
		OR: [
			{
				name: {
					contains: query,
					mode: "insensitive" as const,
				},
			},
			{
				brand: {
					contains: query,
					mode: "insensitive" as const,
				},
			},
			{
				description: {
					contains: query,
					mode: "insensitive" as const,
				},
			},
			...searchTerms.flatMap((term) => [
				{ name: { contains: term, mode: "insensitive" as const } },
				{ brand: { contains: term, mode: "insensitive" as const } },
				{ description: { contains: term, mode: "insensitive" as const } },
			]),
		],
	};

	const products = await prisma.product.findMany({
		where,
		take: limit,
		select: {
			id: true,
			name: true,
			brand: true,
			price: true,
			images: true,
			colors: true,
			sizes: true,
			rating: true,
			inventory: true,
		},
		orderBy: {
			rating: "desc",
		},
	});

	const formattedProducts = products.map((p) => ({
		...p,
		price: Number(p.price),
		rating: Number(p.rating),
	})) as Product[];

	return Response.json({ products: formattedProducts });
}
