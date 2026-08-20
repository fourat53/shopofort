"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity, getEntityFields } from "@/lib/entity/current-entity";
import { getPluralFromName } from "@/lib/entity/entity-header";
import DialogForm from "./dialog-form";

export default function FilterDialog() {
	const entity = CurrentEntity();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();

	const fields = useMemo(() => getEntityFields(entity, "filter"), [entity]);

	const hasFilters = [...searchParams.keys()].some(
		(key) => !["page", "sortBy", "order"].includes(key),
	);

	const handleClear = () => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete("page");
		for (const field of fields) {
			newParams.delete(field.name);
			if (field.type === "number" || field.type === "date") {
				newParams.delete(`${field.name}From`);
				newParams.delete(`${field.name}To`);
			}
		}
		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;
		startTransition(() => {
			router.push(newUrl);
		});
	};

	const handleSubmit = (formData: FormData) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete("page");
		for (const field of fields) {
			if (field.type === "number" || field.type === "date") {
				for (const suffix of ["From", "To"] as const) {
					const rangeName = `${field.name}${suffix}`;
					const rangeValue = formData.get(rangeName)?.toString().trim();
					if (rangeValue) newParams.set(rangeName, rangeValue);
					else newParams.delete(rangeName);
				}
				continue;
			}
			if (field.type === "enum" || field.type === "foreignKey") {
				const values = formData
					.getAll(field.name)
					.map((value) => value.toString());
				newParams.delete(field.name);
				for (const value of values) newParams.append(field.name, value);
				continue;
			}
			const value = formData.get(field.name)?.toString().trim();
			if (value && value !== "ALL") newParams.set(field.name, value);
			else newParams.delete(field.name);
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
					<Button disabled={isPending || !entity}>
						<IconFilter className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogForm
					type="filter"
					entity={entity}
					label={`Filter ${getPluralFromName(entity)}`}
					fields={fields}
					handleSubmit={handleSubmit}
					loading={isPending}
					open={open}
					setOpen={setOpen}
					getValue={(field, paramName) => {
						const name = paramName ?? field.name;
						if (field.type === "enum" || field.type === "foreignKey")
							return searchParams.getAll(name);
						return searchParams.get(name) || undefined;
					}}
				/>
			</Dialog>
		</div>
	);
}
