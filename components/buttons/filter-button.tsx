"use client";

import { IconFilter } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getFilterOptions } from "@/actions/FilterActions";
import { Input } from "@/components/form-items/input";
import { Select } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity } from "./current-entity";

type FieldConfig = {
	name: string;
	label: string;
	type: "string" | "number" | "date" | "enum" | "foreignKey";
	enumValues?: string[];
};

const entityFilters: Record<string, FieldConfig[]> = {
	product: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "name", label: "Name", type: "string" },
		{ name: "brand", label: "Brand", type: "string" },
		{ name: "price", label: "Price", type: "number" },
		{ name: "inventory", label: "Inventory", type: "number" },
		{ name: "categoryId", label: "Category", type: "foreignKey" },
	],
	cart: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "totalAmount", label: "Total Amount", type: "number" },
		{ name: "userId", label: "User", type: "foreignKey" },
	],
	cartItem: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "quantity", label: "Quantity", type: "number" },
		{ name: "unitPrice", label: "Unit Price", type: "number" },
		{ name: "totalPrice", label: "Total Price", type: "number" },
		{ name: "cartId", label: "Cart", type: "foreignKey" },
		{ name: "productId", label: "Product", type: "foreignKey" },
	],
	order: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "orderDate", label: "Order Date", type: "date" },
		{ name: "totalAmount", label: "Total Amount", type: "number" },
		{
			name: "orderStatus",
			label: "Order Status",
			type: "enum",
			enumValues: [
				"PENDING",
				"PROCESSING",
				"SHIPPED",
				"DELIVERED",
				"CANCELLED",
			],
		},
		{ name: "userId", label: "User", type: "foreignKey" },
	],
	orderItem: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "quantity", label: "Quantity", type: "number" },
		{ name: "price", label: "Price", type: "number" },
		{ name: "orderId", label: "Order", type: "foreignKey" },
		{ name: "productId", label: "Product", type: "foreignKey" },
	],
	category: [
		{ name: "id", label: "ID", type: "number" },
		{ name: "name", label: "Name", type: "string" },
		{
			name: "gender",
			label: "Gender",
			type: "enum",
			enumValues: ["MALE", "FEMALE"],
		},
	],
};

type Option = { value: string; label: string };

export default function FilterButton({ disabled }: { disabled?: boolean }) {
	const entity = CurrentEntity();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<Record<string, Option[]>>(
		{},
	);
	const [isPending, startTransition] = useTransition();

	const currentFields = entity ? entityFilters[entity] || [] : [];

	const fetchedFields = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (open && entity) {
			for (const field of currentFields) {
				if (
					field.type === "foreignKey" &&
					!fetchedFields.current.has(field.name)
				) {
					fetchedFields.current.add(field.name);
					getFilterOptions(field.name)
						.then((options) => {
							setOptionsCache((curr) => ({ ...curr, [field.name]: options }));
						})
						.catch((err) => {
							fetchedFields.current.delete(field.name);
							console.error(err);
						});
				}
			}
		}
	}, [open, entity, currentFields]);

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const newParams = new URLSearchParams(searchParams.toString());

		newParams.delete("page");

		for (const field of currentFields) {
			const val = formData.get(field.name)?.toString().trim();
			if (val && val !== "ALL") {
				newParams.set(field.name, val);
			} else {
				newParams.delete(field.name);
			}
		}

		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;

		startTransition(() => {
			router.push(newUrl);
			setLoading(false);
			setOpen(false);
		});
	};

	if (!entity) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled || loading || isPending || !entity}>
					<IconFilter className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="w-90">
				<form onSubmit={handleSubmit}>
					<DialogTitle>Filter {entity}</DialogTitle>

					<div className="flex flex-col gap-4 py-4">
						{currentFields.map((field) => (
							<div key={field.name} className="flex flex-col gap-2">
								{field.type === "string" && (
									<Input
										id={field.name}
										label={field.label}
										name={field.name}
										type="text"
										defaultValue={searchParams.get(field.name) || ""}
									/>
								)}
								{field.type === "number" && (
									<Input
										id={field.name}
										label={field.label}
										name={field.name}
										type="number"
										step="any"
										defaultValue={searchParams.get(field.name) || ""}
									/>
								)}
								{field.type === "date" && (
									<Input
										id={field.name}
										label={field.label}
										name={field.name}
										type="date"
										defaultValue={searchParams.get(field.name) || ""}
									/>
								)}
								{field.type === "enum" && (
									<Select
										name={field.name}
										label={field.label}
										defaultValue={searchParams.get(field.name) || undefined}
										placeholder="Select an option"
										items={[
											{ label: "Any", value: "ALL" },
											...(field.enumValues?.map((v) => ({
												label: v,
												value: v,
											})) ?? []),
										]}
									/>
								)}

								{field.type === "foreignKey" && (
									<Select
										name={field.name}
										label={field.label}
										defaultValue={searchParams.get(field.name) || undefined}
										placeholder="Select an option"
										items={[
											{ label: "Any", value: "ALL" },
											...(optionsCache[field.name] ?? []),
										]}
									/>
								)}
							</div>
						))}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={(e) => {
								e.preventDefault();
								setOpen(false);
							}}
							disabled={loading || isPending}
						>
							Cancel
						</Button>
						<Button type="submit" loading={loading || isPending}>
							Filter
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
