"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { getFilterOptions } from "@/actions/EntityActions";
import type { SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity, entityFields } from "@/lib/entity/current-entity";
import DialogForm from "./dialog-form";

export default function FilterDialog({ disabled }: { disabled?: boolean }) {
	const entity = CurrentEntity();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isPending, startTransition] = useTransition();

	const [open, setOpen] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	const currentFields = useMemo(
		() =>
			entity
				? (entityFields[entity]?.filter((field) =>
						field.category.includes("filter"),
					) ?? [])
				: [],
		[entity],
	);

	const hasFilters = currentFields.some((field) => {
		const value = searchParams.get(field.name);
		return value !== null && value !== "";
	});

	useEffect(() => {
		if (!open || !entity) return;

		for (const field of currentFields) {
			if (
				field.type !== "foreignKey" ||
				fetchedFields.current.has(field.name)
			) {
				continue;
			}

			fetchedFields.current.add(field.name);

			getFilterOptions(field.name)
				.then((options) => {
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				})
				.catch((error) => {
					fetchedFields.current.delete(field.name);
					console.error(error);
				});
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

		const formData = new FormData(e.currentTarget);
		const newParams = new URLSearchParams(searchParams.toString());

		newParams.delete("page");

		for (const field of currentFields) {
			const value = formData.get(field.name)?.toString().trim();

			if (value && value !== "ALL") {
				newParams.set(field.name, value);
			} else {
				newParams.delete(field.name);
			}
		}

		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;

		startTransition(() => {
			router.push(newUrl);
			setOpen(false);
		});
	};

	if (!entity) return null;

	return (
		<div
			className={clsx("flex gap-1.5", entity !== "user" && "pr-1.5 border-r")}
		>
			{hasFilters && (
				<Button variant="outline" onClick={handleClear} disabled={isPending}>
					<IconArrowBackUp className="h-4 w-4" />
				</Button>
			)}

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button disabled={disabled || isPending || !entity}>
						<IconFilter className="h-4 w-4" />
					</Button>
				</DialogTrigger>

				<DialogContent className="w-90">
					<form onSubmit={handleSubmit}>
						<DialogTitle>Filter {entity}</DialogTitle>

						<DialogForm
							filter
							fields={currentFields}
							optionsCache={optionsCache}
							getValue={(field) =>
								field.type === "date"
									? field.defaultValue
									: searchParams.get(field.name) || undefined
							}
						/>

						<DialogFooter>
							<Button
								variant="outline"
								onClick={(e) => {
									e.preventDefault();
									setOpen(false);
								}}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" loading={isPending}>
								Filter
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
