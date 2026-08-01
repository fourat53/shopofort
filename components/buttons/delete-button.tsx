"use client";

import { IconTrash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { deleteEntity } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteButton({
	id,
	disabled,
}: {
	id: number;
	disabled?: boolean;
}) {
	const pathname = usePathname();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	let modelName = "";
	if (pathname.includes("/users")) modelName = "user";
	else if (pathname.includes("/products")) modelName = "product";
	else if (pathname.includes("/orders")) modelName = "order";
	else if (pathname.includes("/carts")) modelName = "cart";
	else if (pathname.includes("/categories")) modelName = "category";
	else if (pathname.includes("/cart-items")) modelName = "cartItem";
	else if (pathname.includes("/order-items")) modelName = "orderItem";

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!modelName) return;

		setLoading(true);
		try {
			await deleteEntity(modelName, id);
		} catch (error) {
			console.error("Failed to delete entity", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled || loading || !modelName}
					className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
				>
					<IconTrash className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="w-90">
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete this{" "}
						<span className="font-semibold text-foreground">{modelName}</span>{" "}
						and remove its data from our servers.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						loading={loading}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
