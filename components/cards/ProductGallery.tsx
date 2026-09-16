"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/lib/entity/types";
import { cn } from "@/lib/utils";

export default function ProductGallery({ product }: { product: Product }) {
	const images = product.images?.filter(Boolean) ?? [];
	const [api, setApi] = useState<CarouselApi>();
	return (
		<div className="space-y-4">
			<div className="relative overflow-hidden rounded-3xl border shadow-sm">
				<Carousel setApi={setApi} className="w-full">
					<CarouselContent>
						{images.length > 0 ? (
							images.map((image: string, index: number) => (
								<CarouselItem key={`${image}-${index}`}>
									<div className="relative aspect-square w-full overflow-hidden bg-muted/30">
										<Image
											src={image}
											alt={`${product.name} ${index + 1}`}
											fill
											priority={index === 0}
											className="object-cover transition-transform duration-500"
											sizes="(max-width: 1024px) 100vw, 40vw"
										/>
									</div>
								</CarouselItem>
							))
						) : (
							<CarouselItem>
								<div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-muted/60 text-muted-foreground/50">
									<IconShoppingBag className="size-20 opacity-50" />
									<span className="text-sm font-medium">No Image</span>
								</div>
							</CarouselItem>
						)}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>

				{product.inventory < 10 && product.inventory > 0 && (
					<Badge variant="destructive" className="absolute left-5 top-5">
						Only {product.inventory} left
					</Badge>
				)}

				{product.inventory <= 0 && (
					<Badge variant="secondary" className="absolute left-5 top-5">
						Out of stock
					</Badge>
				)}
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex justify-center gap-3">
					{images.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => api?.scrollTo(index)}
							className={cn(
								"relative size-20 aspect-square overflow-hidden rounded-xl border bg-card transition-all",
								"hover:border-2 hover:border-primary/80",
							)}
						>
							<Image
								src={image}
								alt={`${product.name} thumbnail ${index + 1}`}
								fill
								className="object-cover"
								sizes="120px"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
