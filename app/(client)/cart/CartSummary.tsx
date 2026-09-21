"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
	subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
	const shipping = subtotal > 100 ? 0 : 9.99;
	const total = (subtotal + shipping).toFixed(2);

	return (
		<div className="bg-background border-2 border-border/80 rounded-xl p-6 pt-4 sticky top-24">
			<h2 className="text-xl text-center font-bold mb-6">Order Summary</h2>
			<div className="space-y-3">
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Subtotal</span>
					<span>{subtotal.toFixed(2) + " DT"}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Shipping</span>
					<span>
						{shipping === 0 ? (
							<span className="text-green-600 font-medium">Free</span>
						) : (
							shipping
						)}
					</span>
				</div>
				{shipping > 0 && (
					<p className="text-xs text-muted-foreground">
						Add {300 - subtotal} more for free shipping
					</p>
				)}
				<div className="border-t border-border pt-3">
					<div className="flex justify-between text-lg font-bold">
						<span>Total</span>
						<span>{total + " DT"}</span>
					</div>
				</div>
			</div>
			<Button
				className="w-full mt-6 py-3"
				icon={<IconArrowRight className="ml-2 size-5" />}
			>
				Proceed to Checkout
			</Button>
			<Button
				variant="outline"
				className="w-full mt-3 py-3"
				onClick={() => window.history.back()}
				icon={<IconArrowLeft className="mr-2 size-5" />}
			>
				Continue Shopping
			</Button>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				<p>Secure checkout powered by Konnect.</p>
				<p className="pt-0.5 text-popover-foreground capitalize text-base">
					Will be added soon
				</p>
			</div>
		</div>
	);
}
