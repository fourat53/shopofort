"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/form-items/input";
import RangePicker from "@/components/form-items/range-picker";
import { Select } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { isValidDate } from "@/lib/date";
import type { ENTITY_FIELDS } from "@/lib/entity/fields";
import { getFieldName, getPluralName } from "@/lib/entity/functions";
import type { EntityType } from "@/lib/entity/types";
import FilterRangeNumber from "./FilterRangeNumber";
import ForeignKeySelect from "./ForeignKeySelect";

interface DialogFormProps {
	fields: (typeof ENTITY_FIELDS)[EntityType][number][];
	entity: EntityType;
	setOpen: Dispatch<SetStateAction<boolean>>;
	searchParams: URLSearchParams;
	isPending: boolean;
	startTransition: (callback: () => void) => void;
}

export default function FilterForm({
	fields,
	entity,
	setOpen,
	searchParams,
	isPending,
	startTransition,
}: DialogFormProps) {
	const router = useRouter();
	const pathname = usePathname();

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const newParams = new URLSearchParams(searchParams.toString());

		newParams.delete("page");

		for (const field of fields) {
			const { name, type } = field;

			if (type === "number") {
				const min = field.min ?? 0;
				const max = field.max ?? 10000;

				const fromName = `${name}From`;
				const toName = `${name}To`;

				const from = formData.get(fromName)?.toString() ?? "";
				const to = formData.get(toName)?.toString() ?? "";

				if (from && Number(from) !== min) newParams.set(fromName, from);
				else newParams.delete(fromName);

				if (to && Number(to) !== max) newParams.set(toName, to);
				else newParams.delete(toName);

				continue;
			}

			if (type === "date") {
				const fromName = `${name}From`;
				const toName = `${name}To`;

				const from = formData.get(fromName)?.toString() ?? "";
				const to = formData.get(toName)?.toString() ?? "";

				if (from && isValidDate(from)) newParams.set(fromName, from);
				else newParams.delete(fromName);

				if (to && isValidDate(to)) newParams.set(toName, to);
				else newParams.delete(toName);

				continue;
			}

			if (type === "enum" || type === "foreignKey") {
				const values = formData
					.getAll(name)
					.map((value) => value.toString())
					.filter((value) => value !== "ALL");

				newParams.delete(name);

				for (const value of values) {
					newParams.append(name, value);
				}

				continue;
			}

			const value = formData.get(name)?.toString().trim();

			if (value && value !== "ALL") {
				newParams.set(name, value);
			} else {
				newParams.delete(name);
			}
		}

		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;

		startTransition(() => {
			router.push(newUrl);
			setOpen(false);
		});
	}

	return (
		<DialogContent
			onPointerDownOutside={(e) => isPending && e.preventDefault()}
			onEscapeKeyDown={(e) => isPending && e.preventDefault()}
			className="px-0 w-180 max-w-180 overflow-hidden"
		>
			<form onSubmit={handleSubmit}>
				<DialogHeader className="pb-2">
					<DialogTitle>Filter {getPluralName(entity)}</DialogTitle>
				</DialogHeader>
				<div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-4 flex flex-col gap-4">
					{fields.map((field) => {
						const { type, name, min, max, step, options } = field;
						const label = getFieldName(name);
						return type === "string" ? (
							<Input
								key={name}
								name={name}
								placeholder={`Search ${label.toLowerCase()}`}
								label={label}
								defaultValue={searchParams.get(name) ?? undefined}
							/>
						) : type === "number" ? (
							<FilterRangeNumber
								key={name}
								name={name}
								label={label}
								min={min}
								max={max}
								step={step}
								defaultFrom={
									Number(searchParams.get(`${name}From`)) || min || 0
								}
								defaultTo={Number(searchParams.get(`${name}To`)) || max || 1000}
							/>
						) : type === "date" ? (
							<RangePicker
								key={name}
								fromName={`${name}From`}
								toName={`${name}To`}
								label={label}
								defaultFrom={searchParams.get(`${name}From`) ?? undefined}
								defaultTo={searchParams.get(`${name}To`) ?? undefined}
							/>
						) : type === "enum" ? (
							<Select
								multiple
								key={name}
								name={name}
								label={label}
								defaultValue={searchParams.getAll(name)}
								items={options?.map((o) => ({ label: o, value: o }))}
							/>
						) : type === "foreignKey" ? (
							<ForeignKeySelect
								key={name}
								multiple
								field={field}
								entity={entity}
								fields={fields}
								defaultValue={searchParams.getAll(name)}
							/>
						) : null;
					})}
				</div>
				<DialogFooter className="pt-3">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
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
	);
}
