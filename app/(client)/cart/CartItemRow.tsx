"use client";

import {
	IconMinus,
	IconPlus,
	IconShoppingCart,
	IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import {
	deleteCartItem,
	updateCartItemQuantity,
} from "@/actions/CartItemActions";
import {
	ColorCell,
	SizeCell,
} from "@/components/data-table/table-cells/SpecialCells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ProductColor, ProductSize } from "@/lib/entity/types";

interface CartItemRowProps {
	item: {
		id: number;
		quantity: number;
		color: string | null;
		size: string | null;
		product: {
			id: number;
			name: string;
			brand: string | null;
			price: number;
			images: string[];
			inventory: number;
		};
	};
}

export function CartItemRow({ item }: CartItemRowProps) {
	const product = item.product;
	const price = Number(product.price);
	const totalPrice = price * item.quantity;
	const maxQuantity = product.inventory;

	return (
		<TableRow>
			<TableCell>
				<div className="flex gap-4 items-center">
					<div className="relative size-18 shrink-0 rounded-lg overflow-hidden bg-muted">
						{product.images?.[0] ? (
							<Image
								src={product.images[0]}
								alt={product.name}
								fill
								sizes="72px"
								className="object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
								No image
								<IconShoppingCart className="size-8" />
							</div>
						)}
					</div>
					<div>
						<Link
							href={`/products/${product.id}`}
							className="font-medium text-lg hover:text-primary transition-colors"
						>
							{product.name}
						</Link>
						<p className="text-sm text-muted-foreground">{product.brand}</p>
						<div className="flex gap-2 mt-1 text-sm text-muted-foreground">
							{item.color && <ColorCell value={item.color as ProductColor} />}
							{item.size && <SizeCell value={item.size as ProductSize} />}
						</div>
					</div>
				</div>
			</TableCell>
			<TableCell className="font-medium text-right pr-4">
				{price.toFixed(2)}
			</TableCell>
			<TableCell>
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() =>
							updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))
						}
						disabled={item.quantity <= 1}
					>
						<IconMinus className="size-4" />
					</Button>
					<Input
						type="number"
						value={item.quantity}
						min={1}
						max={maxQuantity}
						className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						onChange={(e) =>
							updateCartItemQuantity(
								item.id,
								Math.min(
									maxQuantity,
									Math.max(1, parseInt(e.target.value, 10) || 1),
								),
							)
						}
					/>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() =>
							updateCartItemQuantity(
								item.id,
								Math.min(maxQuantity, item.quantity + 1),
							)
						}
						disabled={item.quantity >= maxQuantity}
					>
						<IconPlus className="size-4" />
					</Button>
				</div>
				{maxQuantity < 10 && (
					<p className="pt-1 text-center text-xs text-amber-600 dark:text-amber-400 mt-1">
						Only {maxQuantity} left in stock
					</p>
				)}
			</TableCell>
			<TableCell className="font-medium text-right pr-4">
				{totalPrice.toFixed(2)}
			</TableCell>
			<TableCell className="text-center">
				<Button
					variant="ghost"
					size="icon"
					icon={<IconTrash className="size-4 text-red-500" />}
					onClick={() => deleteCartItem(item.id)}
				/>
			</TableCell>
		</TableRow>
	);
}
