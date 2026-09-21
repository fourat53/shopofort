import {
	IconShirt,
	IconShoppingBag,
	IconStarFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/entity/types";

export default function ProductCard({ product }: { product: Product }) {
	return (
		<div className="group hover:bg-muted p-2.5 rounded-3xl flex flex-col bg-transparent">
			<div className="relative aspect-square rounded-2xl bg-card overflow-hidden border shadow-sm transition-all duration-300 group-hover:shadow-md mb-4">
				{product.images?.[0] ? (
					<Image
						src={product.images[0]}
						alt={product.name}
						fill
						sizes="5000px"
						className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
					/>
				) : (
					<div className="flex flex-col gap-2 h-full w-full items-center justify-center bg-muted/60 text-muted-foreground/50">
						<IconShoppingBag className="size-12 opacity-50" />
						<span className="text-sm font-medium">No Image</span>
					</div>
				)}

				<div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
					<Link href={`/products/${product.id}`}>
						<Button className="w-full shadow-lg gap-1 rounded-xl h-11">
							<IconShirt className="size-4.5" /> View Product
						</Button>
					</Link>
				</div>

				{product.inventory < 10 && (
					<div className="absolute top-4 left-4 rounded-full bg-destructive/80 backdrop-blur text-background px-3 py-1 text-xs font-bold shadow-sm">
						Low Stock
					</div>
				)}
			</div>

			<div className="flex flex-col px-1">
				<div className="flex justify-between items-start mb-1">
					<div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
						{product.brand}
					</div>
					<div className="flex items-center text-amber-500">
						<IconStarFilled className="h-3 w-3" />
						<span className="text-xs font-medium ml-1 text-foreground/70">
							{product.rating}
						</span>
					</div>
				</div>
				<h3 className="font-bold text-lg mb-1 leading-tight line-clamp-1 group-hover:text-primary transition-colors">
					{product.name}
				</h3>
			</div>
		</div>
	);
}
