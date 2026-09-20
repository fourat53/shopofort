import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { IconArrowLeft, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { getOrCreateUserCart } from "@/actions/CartActions";
import { PagesLayout, PagesTitle } from "@/app/(client)/layout";
import { Button } from "@/components/ui/button";
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
					<div className="lg:col-span-3">
						<div className="bg-card border border-border rounded-2xl overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/50">
										<th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Product
										</th>
										<th className="p-4 text-right text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Price
										</th>
										<th className="p-4 text-right text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Quantity
										</th>
										<th className="p-4 text-right text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Total
										</th>
										<th className="p-4 text-right text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{cartItems.map(
										(item: {
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
										}) => (
											<CartItemRow key={item.id} item={item} />
										),
									)}
								</tbody>
							</table>
						</div>
					</div>
					<div className="lg:col-span-1">
						<CartSummary subtotal={subtotal} />
					</div>
				</div>
			)}
		</PagesLayout>
	);
}
