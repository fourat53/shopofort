"use client";

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createCart, getCartsOptions } from "@/actions/CartActions";
import { createCartItem } from "@/actions/CartItemActions";
import {
	createCategory,
	getCategoriesOptions,
} from "@/actions/CategoryActions";
import { createOrder, getOrdersOptions } from "@/actions/OrderActions";
import { createOrderItem } from "@/actions/OrderItemActions";
import { createProduct, getProductsOptions } from "@/actions/ProductActions";
import { getUsersOptions } from "@/actions/UserActions";
import { ImageUpload } from "@/components/form-items/image-upload";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { orderStatusItems } from "@/lib/static-data";
import { CurrentEntity } from "./current-entity";

export default function CreateButton() {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
	const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
	const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
	const [cartOptions, setCartOptions] = useState<SelectOption[]>([]);
	const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);
	const [productImages, setProductImages] = useState<File[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!open || !entity || entity === "user") return;
		if (entity === "product") getCategoriesOptions().then(setCategoryOptions);
		else if (entity === "order" || entity === "cart")
			getUsersOptions().then(setUserOptions);
		else if (entity === "cartItem") {
			getCartsOptions().then(setCartOptions);
			getProductsOptions().then(setProductOptions);
		} else if (entity === "orderItem") {
			getOrdersOptions().then(setOrderOptions);
			getProductsOptions().then(setProductOptions);
		}
	}, [open, entity]);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			const formData = new FormData(e.currentTarget);

			if (entity === "product") {
				for (const img of productImages) {
					formData.append("images", img);
				}
				await createProduct(formData);
			} else if (entity === "order") await createOrder(formData);
			else if (entity === "cart") await createCart(formData);
			else if (entity === "category") await createCategory(formData);
			else if (entity === "cartItem") await createCartItem(formData);
			else if (entity === "orderItem") await createOrderItem(formData);
			setOpen(false);
		} catch (error) {
			console.error("Error creating entity:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity || entity === "user") return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<IconPlus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent
				onPointerDownOutside={(e) => loading && e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						Create New {entity.charAt(0).toUpperCase() + entity.slice(1)}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
					{entity === "product" && (
						<>
							<Input id="name" name="name" label="Name" required />
							<Input id="brand" name="brand" label="Brand" />
							<Input
								id="price"
								name="price"
								type="number"
								label="Price ($)"
								step="0.01"
								defaultValue={5}
								required
							/>
							<Input
								id="inventory"
								name="inventory"
								type="number"
								label="Inventory"
								defaultValue={1}
								required
							/>
							<Input id="description" name="description" label="Description" />
							<Select
								label="Category"
								name="categoryId"
								placeholder="Select Category"
								items={categoryOptions}
							/>
							<ImageUpload images={productImages} onChange={setProductImages} />
						</>
					)}

					{entity === "order" && (
						<>
							<Input
								id="orderDate"
								name="orderDate"
								type="date"
								label="Order Date"
								defaultValue={new Date().toISOString().split("T")[0]}
								required
							/>
							<Input
								id="totalAmount"
								name="totalAmount"
								type="number"
								label="Total Amount ($)"
								step="1"
								defaultValue={1}
								required
							/>
							<Select
								label="Order Status"
								name="orderStatus"
								defaultValue="PENDING"
								placeholder="Select status"
								items={orderStatusItems}
							/>
							<Select
								label="User"
								name="userId"
								placeholder="Select User"
								items={userOptions}
							/>
						</>
					)}

					{entity === "cart" && (
						<>
							<Select
								label="User"
								name="userId"
								placeholder="Select User"
								items={userOptions}
							/>
							<Input
								id="totalAmount"
								name="totalAmount"
								type="number"
								label="Total Amount ($)"
								step="1"
								defaultValue={1}
								required
							/>
						</>
					)}

					{entity === "category" && (
						<>
							<Input id="name" name="name" label="Name" required />
							<Select
								label="Gender"
								name="gender"
								placeholder="Select Gender"
								items={[
									{ label: "Male", value: "MALE" },
									{ label: "Female", value: "FEMALE" },
								]}
							/>
						</>
					)}

					{entity === "cartItem" && (
						<>
							<Input
								id="quantity"
								name="quantity"
								type="number"
								label="Quantity"
								required
							/>
							<Input
								id="unitPrice"
								name="unitPrice"
								type="number"
								label="Unit Price ($)"
								step="0.01"
								required
							/>
							<Input
								id="totalPrice"
								name="totalPrice"
								type="number"
								label="Total Price ($)"
								step="0.01"
								required
							/>
							<Select
								label="Cart"
								name="cartId"
								placeholder="Select Cart"
								items={cartOptions}
							/>
							<Select
								label="Product"
								name="productId"
								placeholder="Select Product"
								items={productOptions}
							/>
						</>
					)}

					{entity === "orderItem" && (
						<>
							<Input
								id="quantity"
								name="quantity"
								type="number"
								label="Quantity"
								required
							/>
							<Input
								id="price"
								name="price"
								type="number"
								label="Price ($)"
								step="0.01"
								required
							/>
							<Select
								label="Order"
								name="orderId"
								placeholder="Select Order"
								items={orderOptions}
							/>
							<Select
								label="Product"
								name="productId"
								placeholder="Select Product"
								items={productOptions}
							/>
						</>
					)}

					<DialogFooter className="pt-4">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancel
						</Button>{" "}
						<Button loading={loading} type="submit">
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
