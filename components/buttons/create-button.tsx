"use client";

import { createProduct } from "@/actions/ProductActions";
import { createOrder } from "@/actions/OrderActions";
import { createUser } from "@/actions/UserActions";
import { createCart } from "@/actions/CartActions";
import { createCategory } from "@/actions/CategoryActions";
import { createCartItem } from "@/actions/CartItemActions";
import { createOrderItem } from "@/actions/OrderItemActions";

import { getUsersOptions } from "@/actions/UserActions";
import { getCategoriesOptions } from "@/actions/CategoryActions";
import { getProductsOptions } from "@/actions/ProductActions";
import { getCartsOptions } from "@/actions/CartActions";
import { getOrdersOptions } from "@/actions/OrderActions";

import { Select, type SelectOption } from "@/components/form-items/select";
import { Input } from "@/components/form-items/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { IconPlus } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const roleItems: SelectOption[] = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Guest", value: "GUEST" },
];

const orderStatusItems: SelectOption[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function CreateButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
  const [cartOptions, setCartOptions] = useState<SelectOption[]>([]);
  const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);

  let entity = "";
  if (pathname.includes("/users")) entity = "user";
  else if (pathname.includes("/products")) entity = "product";
  else if (pathname.includes("/orders")) entity = "order";
  else if (pathname.includes("/carts")) entity = "cart";
  else if (pathname.includes("/categories")) entity = "category";
  else if (pathname.includes("/cart-items")) entity = "cart item";
  else if (pathname.includes("/images")) entity = "image";
  else if (pathname.includes("/order-items")) entity = "order item";

  useEffect(() => {
    if (!open) return;
    if (entity === "product") getCategoriesOptions().then(setCategoryOptions);
    if (entity === "order" || entity === "cart")
      getUsersOptions().then(setUserOptions);
    if (entity === "cart item") {
      getCartsOptions().then(setCartOptions);
      getProductsOptions().then(setProductOptions);
    }
    if (entity === "image") getProductsOptions().then(setProductOptions);
    if (entity === "order item") {
      getOrdersOptions().then(setOrderOptions);
      getProductsOptions().then(setProductOptions);
    }
  }, [open, entity]);

  if (!entity) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (entity === "user") await createUser(formData);
    else if (entity === "product") await createProduct(formData);
    else if (entity === "order") await createOrder(formData);
    else if (entity === "cart") await createCart(formData);
    else if (entity === "category") await createCategory(formData);
    else if (entity === "cart item") await createCartItem(formData);
    else if (entity === "order item") await createOrderItem(formData);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          <IconPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Create New {entity.charAt(0).toUpperCase() + entity.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
          {entity === "user" && (
            <>
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                required
              />
              <Input id="lastName" name="lastName" label="Last Name" required />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                required
              />
              <Select
                label="Role"
                name="role"
                defaultValue="USER"
                placeholder="Select role"
                items={roleItems}
              />
            </>
          )}

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

          {entity === "cart item" && (
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

          {entity === "image" && (
            <>
              <Input id="fileName" name="fileName" label="File Name" />
              <Input id="fileType" name="fileType" label="File Type" />
              <Input id="downloadUrl" name="downloadUrl" label="Download URL" />
              <Select
                label="Product"
                name="productId"
                placeholder="Select Product"
                items={productOptions}
              />
            </>
          )}

          {entity === "order item" && (
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

          <div className="w-full pt-4">
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
