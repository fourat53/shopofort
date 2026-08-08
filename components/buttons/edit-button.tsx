"use client";

import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getCartsOptions, updateCart } from "@/actions/CartActions";
import { updateCartItem } from "@/actions/CartItemActions";
import {
	getCategoriesOptions,
	updateCategory,
} from "@/actions/CategoryActions";
import { getOrdersOptions, updateOrder } from "@/actions/OrderActions";
import { updateOrderItem } from "@/actions/OrderItemActions";
import { getProductsOptions, updateProduct } from "@/actions/ProductActions";
import { getUsersOptions, updateUser } from "@/actions/UserActions";
// import {
// 	type ImageType,
// 	ImageUpload,
// } from "@/components/form-items/image-upload";
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
import { booleanItems, orderStatusItems } from "@/lib/static-data";
import type { EntityRowType } from "../data-table/DataTableLayout";

interface EditButtonProps {
	entityRow: EntityRowType;
	disabled?: boolean;
}

export default function EditButton({ entityRow, disabled }: EditButtonProps) {
	const [entity, row] = entityRow;

	const [open, setOpen] = useState<boolean>(false);
	const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
	const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
	const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
	const [cartOptions, setCartOptions] = useState<SelectOption[]>([]);
	const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!open) return;
		if (entity === "users") {
			// set picture
		} else if (entity === "products") {
			// set images
			getCategoriesOptions().then(setCategoryOptions);
		} else if (entity === "orders" || entity === "carts")
			getUsersOptions().then(setUserOptions);
		else if (entity === "cart-items") {
			getCartsOptions().then(setCartOptions);
			getProductsOptions().then(setProductOptions);
		} else if (entity === "order-items") {
			getOrdersOptions().then(setOrderOptions);
			getProductsOptions().then(setProductOptions);
		}
	}, [open, entity]);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			if (entity === "users") {
				await updateUser(row.id, formData);
			} else if (entity === "products") {
				await updateProduct(row.id, formData);
			} else if (entity === "orders") {
				await updateOrder(row.id, formData);
			} else if (entity === "carts") {
				await updateCart(row.id, formData);
			} else if (entity === "categories") {
				await updateCategory(row.id, formData);
			} else if (entity === "cart-items") {
				await updateCartItem(row.id, formData);
			} else if (entity === "order-items") {
				await updateOrderItem(row.id, formData);
			}
		} catch (error) {
			console.error("Error updating entity:", error);
		} finally {
			setLoading(false);
			setOpen(false);
			entity === "users" && window.location.reload();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					border={false}
					className="rounded-xl size-6 p-0"
				>
					<IconEdit className="h-4 w-4 text-mist-400" />
				</Button>
			</DialogTrigger>
			<DialogContent
				onPointerDownOutside={(e) => loading && e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						Edit {entity.charAt(0).toUpperCase() + entity.slice(1)}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
					{entity === "users" && (
						<>
							{/* <ImageUpload
								label="Profile Picture"
								images={userPicture}
								onChange={setUserPicture}
							/> */}
							<Input
								name="first_name"
								label="First Name"
								defaultValue={row.first_name || ""}
								required
							/>
							<Input
								name="last_name"
								label="Last Name"
								defaultValue={row.last_name || ""}
								required
							/>
							<Select
								name="is_suspended"
								label="Suspended"
								placeholder="Select option"
								defaultValue={String(row.is_suspended) || ""}
								items={booleanItems}
							/>
						</>
					)}

					{entity === "products" && (
						<>
							<Input
								name="name"
								label="Name"
								defaultValue={row.name || ""}
								required
							/>
							<Input
								name="brand"
								label="Brand"
								defaultValue={row.brand || ""}
							/>
							<Input
								name="price"
								label="Price ($)"
								step="0.01"
								defaultValue={row.price || 5}
								required
							/>
							<Input
								name="inventory"
								type="number"
								label="Inventory"
								defaultValue={row.inventory || 1}
								required
							/>
							<Input
								name="description"
								label="Description"
								defaultValue={row.description || ""}
							/>
							<Select
								label="Category"
								name="categoryId"
								placeholder="Select Category"
								defaultValue={row.categoryId ? String(row.categoryId) : ""}
								items={categoryOptions}
							/>
							{/* <ImageUpload
								label="Product Images"
								images={productImages}
								onChange={setProductImages}
								multiple
							/> */}
						</>
					)}

					{entity === "orders" && (
						<>
							<Input
								name="orderDate"
								type="date"
								label="Order Date"
								defaultValue={
									row.orderDate
										? new Date(row.orderDate).toISOString().split("T")[0]
										: new Date().toISOString().split("T")[0]
								}
								required
							/>
							<Input
								name="totalAmount"
								type="number"
								label="Total Amount ($)"
								step="1"
								defaultValue={row.totalAmount || 1}
								required
							/>
							<Select
								label="Order Status"
								name="orderStatus"
								defaultValue={row.orderStatus || "PENDING"}
								placeholder="Select status"
								items={orderStatusItems}
							/>
							<Select
								label="User"
								name="userId"
								placeholder="Select User"
								defaultValue={row.userId ? String(row.userId) : ""}
								items={userOptions}
							/>
						</>
					)}

					{entity === "carts" && (
						<>
							<Input
								name="totalAmount"
								type="number"
								label="Total Amount ($)"
								step="1"
								defaultValue={row.totalAmount || 1}
								required
							/>
							<Select
								label="User"
								name="userId"
								placeholder="Select User"
								defaultValue={row.userId ? String(row.userId) : ""}
								items={userOptions}
							/>
						</>
					)}

					{entity === "categories" && (
						<>
							<Input
								name="name"
								label="Name"
								defaultValue={row.name || ""}
								required
							/>
							<Select
								label="Gender"
								name="gender"
								placeholder="Select Gender"
								defaultValue={row.gender || undefined}
								items={[
									{ label: "Male", value: "MALE" },
									{ label: "Female", value: "FEMALE" },
								]}
							/>
						</>
					)}

					{entity === "cart-items" && (
						<>
							<Input
								name="quantity"
								type="number"
								label="Quantity"
								defaultValue={row.quantity || 1}
								required
							/>
							<Input
								name="unitPrice"
								type="number"
								label="Unit Price ($)"
								step="0.01"
								defaultValue={row.unitPrice || 0}
								required
							/>
							<Input
								name="totalPrice"
								type="number"
								label="Total Price ($)"
								step="0.01"
								defaultValue={row.totalPrice || 0}
								required
							/>
							<Select
								label="Cart"
								name="cartId"
								placeholder="Select Cart"
								defaultValue={row.cartId ? String(row.cartId) : ""}
								items={cartOptions}
							/>
							<Select
								label="Product"
								name="productId"
								placeholder="Select Product"
								defaultValue={row.productId ? String(row.productId) : ""}
								items={productOptions}
							/>
						</>
					)}

					{entity === "order-items" && (
						<>
							<Input
								name="quantity"
								type="number"
								label="Quantity"
								defaultValue={row.quantity || 1}
								required
							/>
							<Input
								name="price"
								type="number"
								label="Price ($)"
								step="0.01"
								defaultValue={row.price || 0}
								required
							/>
							<Select
								label="Order"
								name="orderId"
								placeholder="Select Order"
								defaultValue={row.orderId ? String(row.orderId) : ""}
								items={orderOptions}
							/>
							<Select
								label="Product"
								name="productId"
								placeholder="Select Product"
								defaultValue={row.productId ? String(row.productId) : ""}
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
						</Button>
						<Button loading={loading} type="submit">
							Update
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
