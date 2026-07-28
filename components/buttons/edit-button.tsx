"use client";

import { updateEntity } from "@/actions/EntityActions";
import { getUsersOptions } from "@/actions/UserActions";
import { getCategoriesOptions } from "@/actions/CategoryActions";
import { getProductsOptions } from "@/actions/ProductActions";
import { getCartsOptions } from "@/actions/CartActions";
import { getOrdersOptions } from "@/actions/OrderActions";

import { Select, type SelectOption } from "@/components/form-items/select";
import { ImageUpload } from "@/components/form-items/image-upload";
import { Input } from "@/components/form-items/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { IconEdit } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
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

export default function EditButton({
  row,
  disabled,
}: {
  row: any;
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
  const [cartOptions, setCartOptions] = useState<SelectOption[]>([]);
  const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

  let entity = "";
  let modelName = "";
  if (pathname.includes("/users")) {
    entity = "user";
    modelName = "user";
  } else if (pathname.includes("/products")) {
    entity = "product";
    modelName = "product";
  } else if (pathname.includes("/orders")) {
    entity = "order";
    modelName = "order";
  } else if (pathname.includes("/carts")) {
    entity = "cart";
    modelName = "cart";
  } else if (pathname.includes("/categories")) {
    entity = "category";
    modelName = "category";
  } else if (pathname.includes("/cart-items")) {
    entity = "cart item";
    modelName = "cartItem";
  } else if (pathname.includes("/order-items")) {
    entity = "order item";
    modelName = "orderItem";
  }

  useEffect(() => {
    if (!open) return;
    if (entity === "product") getCategoriesOptions().then(setCategoryOptions);
    if (entity === "order" || entity === "cart")
      getUsersOptions().then(setUserOptions);
    if (entity === "cart item") {
      getCartsOptions().then(setCartOptions);
      getProductsOptions().then(setProductOptions);
    }
    if (entity === "order item") {
      getOrdersOptions().then(setOrderOptions);
      getProductsOptions().then(setProductOptions);
    }
  }, [open, entity]);

  if (!entity) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: any = {};

    if (modelName === "user") {
      data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
      };
    } else if (modelName === "product") {
      data = {
        name: formData.get("name") as string,
        brand: formData.get("brand") as string,
        price: Number(formData.get("price")),
        inventory: Number(formData.get("inventory")),
        description: formData.get("description") as string,
        categoryId: formData.get("categoryId")
          ? Number(formData.get("categoryId"))
          : null,
      };
    } else if (modelName === "order") {
      data = {
        orderDate: new Date(formData.get("orderDate") as string),
        totalAmount: Number(formData.get("totalAmount")),
        orderStatus: formData.get("orderStatus") as string,
        userId: Number(formData.get("userId")),
      };
    } else if (modelName === "cart") {
      data = {
        userId: Number(formData.get("userId")),
        totalAmount: Number(formData.get("totalAmount")) || 0,
      };
    } else if (modelName === "category") {
      data = {
        name: formData.get("name") as string,
        gender: formData.get("gender") as any,
      };
    } else if (modelName === "cartItem") {
      data = {
        quantity: Number(formData.get("quantity")),
        unitPrice: Number(formData.get("unitPrice")),
        totalPrice: Number(formData.get("totalPrice")),
        cartId: Number(formData.get("cartId")),
        productId: Number(formData.get("productId")),
      };
    } else if (modelName === "orderItem") {
      data = {
        quantity: Number(formData.get("quantity")),
        price: Number(formData.get("price")),
        orderId: Number(formData.get("orderId")),
        productId: Number(formData.get("productId")),
      };
    }

    await updateEntity(modelName, row.id, data);
    handleOpenChange(false);
    router.refresh();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setProductImages([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {entity.charAt(0).toUpperCase() + entity.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
          {entity === "user" && (
            <>
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                defaultValue={row.firstName || row.first_name || ""}
                required
              />
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                defaultValue={row.lastName || row.last_name || ""}
                required
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                defaultValue={row.email || ""}
                required
              />
              <Select
                label="Role"
                name="role"
                defaultValue={row.role || "USER"}
                placeholder="Select role"
                items={roleItems}
              />
            </>
          )}

          {entity === "product" && (
            <>
              <Input
                id="name"
                name="name"
                label="Name"
                defaultValue={row.name || ""}
                required
              />
              <Input
                id="brand"
                name="brand"
                label="Brand"
                defaultValue={row.brand || ""}
              />
              <Input
                id="price"
                name="price"
                type="number"
                label="Price ($)"
                step="0.01"
                defaultValue={row.price || 5}
                required
              />
              <Input
                id="inventory"
                name="inventory"
                type="number"
                label="Inventory"
                defaultValue={row.inventory || 1}
                required
              />
              <Input
                id="description"
                name="description"
                label="Description"
                defaultValue={row.description || ""}
              />
              <Select
                label="Category"
                name="categoryId"
                placeholder="Select Category"
                defaultValue={
                  row.categoryId ? String(row.categoryId) : undefined
                }
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
                defaultValue={
                  row.orderDate
                    ? new Date(row.orderDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                required
              />
              <Input
                id="totalAmount"
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
                defaultValue={row.userId ? String(row.userId) : undefined}
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
                defaultValue={row.userId ? String(row.userId) : undefined}
                items={userOptions}
              />
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                label="Total Amount ($)"
                step="1"
                defaultValue={row.totalAmount || 1}
                required
              />
            </>
          )}

          {entity === "category" && (
            <>
              <Input
                id="name"
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

          {entity === "cart item" && (
            <>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                label="Quantity"
                defaultValue={row.quantity || 1}
                required
              />
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                label="Unit Price ($)"
                step="0.01"
                defaultValue={row.unitPrice || 0}
                required
              />
              <Input
                id="totalPrice"
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
                defaultValue={row.cartId ? String(row.cartId) : undefined}
                items={cartOptions}
              />
              <Select
                label="Product"
                name="productId"
                placeholder="Select Product"
                defaultValue={row.productId ? String(row.productId) : undefined}
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
                defaultValue={row.quantity || 1}
                required
              />
              <Input
                id="price"
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
                defaultValue={row.orderId ? String(row.orderId) : undefined}
                items={orderOptions}
              />
              <Select
                label="Product"
                name="productId"
                placeholder="Select Product"
                defaultValue={row.productId ? String(row.productId) : undefined}
                items={productOptions}
              />
            </>
          )}

          <div className="w-full pt-4">
            <Button type="submit" className="w-full">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
