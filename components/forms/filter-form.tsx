"use client";

import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/form-items/input";
import RangePicker from "@/components/form-items/range-picker";
import { RangeSlider } from "@/components/form-items/range-slider";
import { Select } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ENTITY_FIELDS } from "@/lib/entity/entity-fields";
import { getFieldName, getPluralName } from "@/lib/entity/entity-functions";
import type { EntityType } from "@/lib/entity/types";
import ForeignKeySelect from "./foreign-key-select";

interface DialogFormProps {
	fields: (typeof ENTITY_FIELDS)[EntityType][number][];
	entity: EntityType;
	isPending: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	searchParams: URLSearchParams;
}

export default function FilterForm({
	fields,
	entity,
	isPending,
	setOpen,
	handleSubmit,
	searchParams,
}: DialogFormProps) {
	return (
		<DialogContent
			onPointerDownOutside={(e) => isPending && e.preventDefault()}
			onEscapeKeyDown={(e) => isPending && e.preventDefault()}
			className="w-180 max-w-180"
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<DialogHeader>
					<DialogTitle>Filter {getPluralName(entity)}</DialogTitle>
				</DialogHeader>
				{fields.map((field) => {
					const { type, name } = field;
					const label = getFieldName(name);
					return type === "string" ? (
						<Input
							key={name}
							name={name}
							placeholder={`Search ${label.toLowerCase()}`}
							type={name === "email" ? "email" : "text"}
							label={label}
							defaultValue={searchParams.get(name) ?? undefined}
						/>
					) : type === "number" ? (
						<RangeSlider
							key={name}
							fromName={`${name}From`}
							toName={`${name}To`}
							label={label}
							min={field.min ?? 0}
							max={field.max ?? 10000}
							step={field.step ?? 1}
							defaultValue={[
								Number(searchParams.get(`${name}From`)) || field.min || 0,
								Number(searchParams.get(`${name}To`) || field.max || 10000),
							]}
						/>
					) : type === "date" ? (
						<RangePicker
							key={name}
							fromName={`${name}From`}
							toName={`${name}To`}
							label={label}
							defaultValues={{
								from: searchParams.get(`${name}From`) ?? undefined,
								to: searchParams.get(`${name}To`) ?? undefined,
							}}
						/>
					) : type === "enum" ? (
						<Select
							multiple
							key={name}
							name={name}
							label={label}
							defaultValue={searchParams.getAll(name) ?? ["ALL"]}
							items={[
								{ label: "Any", value: "ALL" },
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : type === "foreignKey" ? (
						<ForeignKeySelect
							key={name}
							field={field}
							entity={entity}
							fields={fields}
							defaultValue={searchParams.getAll(name) ?? ["ALL"]}
							firstItem={{ label: "All", value: "ALL" }}
						/>
					) : null;
				})}
				<DialogFooter className="pt-2">
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
