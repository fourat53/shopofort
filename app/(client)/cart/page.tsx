import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { IconArrowLeft, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { getOrCreateUserCart } from "@/actions/CartActions";
import { PagesLayout, PagesTitle } from "@/app/(client)/layout";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CartItemType, ProductType } from "@/lib/entity/types";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

function EmptyCart() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<IconShoppingCart className="size-16 text-muted-foreground/50 mb-6" />
			<h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
			<p className="text-muted-foreground mb-8 max-w-sm">
				Looks like you haven't added any items to your cart yet.
			</p>
			<Link href="/products">
				<Button size="lg" className="gap-2">
					<IconArrowLeft className="size-5" />
					Start Shopping
				</Button>
			</Link>
		</div>
	);
}

export default async function CartPage() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	if (!user) return;
	const cart = await getOrCreateUserCart(user.id);

	const cartItems = cart.cartItems || [];
	const subtotal = cartItems.reduce(
		(sum: number, item: { quantity: number; product: { price: number } }) =>
			sum + Number(item.product.price) * item.quantity,
		0,
	);

	return (
		<PagesLayout>
			<PagesTitle>Shopping Cart</PagesTitle>
			{cartItems.length === 0 ? (
				<EmptyCart />
			) : (
				<div className="grid lg:grid-cols-4 gap-8">
					<Table
						className="w-full bg-background/80"
						parentClassName="lg:col-span-3 bg-card border-2 border-border/80 rounded-xl overflow-hidden"
					>
						<TableHeader className="h-9">
							<TableRow>
								<TableHead className="text-center">Product</TableHead>
								<TableHead className="text-center" border>
									Price (DT)
								</TableHead>
								<TableHead className="text-center" border>
									Quantity
								</TableHead>
								<TableHead className="text-center" border>
									Total (DT)
								</TableHead>
								<TableHead className="text-center" border>
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cartItems.map(
								(item: CartItemType & { product: ProductType }) => (
									<CartItemRow key={item.id} item={item} />
								),
							)}
						</TableBody>
					</Table>
					<div className="lg:col-span-1">
						<CartSummary subtotal={subtotal} />
					</div>
				</div>
			)}
		</PagesLayout>
	);
}
