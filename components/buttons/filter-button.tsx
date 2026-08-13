"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getFilterOptions } from "@/actions/EntityActions";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity, entityFilters } from "./current-entity";

export default function FilterButton({ disabled }: { disabled?: boolean }) {
	const entity = CurrentEntity();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});
	const [isPending, startTransition] = useTransition();

	const currentFields = entity ? entityFilters[entity] || [] : [];
	const fetchedFields = useRef<Set<string>>(new Set());
	const hasFilters = currentFields.some((field) => {
		const value = searchParams.get(field.name);
		return value !== null && value !== "";
	});

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

	const handleClear = () => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete("page");
		for (const field of currentFields) {
			newParams.delete(field.name);
		}
		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;
		startTransition(() => {
			router.push(newUrl);
		});
	};

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
		<div
			className={clsx("flex gap-1.5", entity !== "user" && "pr-1.5 border-r")}
		>
			{hasFilters && (
				<Button
					variant="outline"
					onClick={handleClear}
					disabled={loading || isPending}
				>
					<IconArrowBackUp className="h-4 w-4" />
				</Button>
			)}
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
											label={field.label.toString()}
											name={field.name}
											type="text"
											defaultValue={searchParams.get(field.name) || ""}
										/>
									)}
									{field.type === "number" && (
										<Input
											label={field.label.toString()}
											name={field.name}
											type="number"
											step="1"
											defaultValue={searchParams.get(field.name) || ""}
										/>
									)}
									{field.type === "date" && (
										<Input
											label={field.label.toString()}
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
		</div>
	);
}
