"use client";

import { IconTrash } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { deleteEntity } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";

export default function DeleteButton({
	id,
	disabled,
}: {
	id: number;
	disabled?: boolean;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const handleDelete = async () => {
		let modelName = "";
		if (pathname.includes("/users")) modelName = "user";
		else if (pathname.includes("/products")) modelName = "product";
		else if (pathname.includes("/orders")) modelName = "order";
		else if (pathname.includes("/carts")) modelName = "cart";
		else if (pathname.includes("/categories")) modelName = "category";
		else if (pathname.includes("/cart-items")) modelName = "cartItem";
		else if (pathname.includes("/order-items")) modelName = "orderItem";

		if (modelName) {
			if (confirm(`Are you sure you want to delete this ${modelName}?`)) {
				await deleteEntity(modelName, id);
				router.refresh();
			}
		}
	};

	return (
		<Button
			variant="ghost"
			border={false}
			disabled={disabled}
			className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
			onClick={handleDelete}
		>
			<IconTrash className="h-4 w-4" />
		</Button>
	);
}
