"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { getFilterOptions } from "@/actions/EntityActions";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type EntityType,
	getFieldName,
	getPluralName,
} from "@/lib/entity/current-entity";
import type { EntityField, OptionField } from "@/lib/entity/entity-fields";
import RangePicker from "../form-items/range-picker";

interface DialogFormProps {
	fields: EntityField[];
	entity: EntityType;
	isPending: boolean;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	searchParams: URLSearchParams;
}

export default function FilterForm({
	fields,
	entity,
	isPending,
	open,
	setOpen,
	handleSubmit,
	searchParams,
}: DialogFormProps) {
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!open) return;

		async function loadOptions() {
			for (const field of fields) {
				if (
					field.type !== "foreignKey" ||
					fetchedFields.current.has(field.name)
				)
					continue;
				fetchedFields.current.add(field.name);
				try {
					const options = await getFilterOptions(field.name as OptionField);
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				} catch (error) {
					fetchedFields.current.delete(field.name);
					console.error(error);
				}
			}
		}

		loadOptions();
	}, [open, fields]);

	if (!open) return;

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
					const name = field.name;
					return field.type === "string" ? (
						<Input
							key={field.name}
							name={field.name}
							type={field.name === "email" ? "email" : "text"}
							label={getFieldName(field.name)}
							defaultValue={searchParams.get(name) ?? undefined}
						/>
					) : field.type === "number" ? (
						<div key={field.name} className="flex w-full gap-2">
							<Input
								type="number"
								name={`${field.name}From`}
								label={`${getFieldName(field.name)} from`}
								defaultValue={searchParams.get(`${name}From`) ?? undefined}
								step={field.step ?? "1"}
							/>
							<Input
								type="number"
								name={`${field.name}To`}
								label={`${getFieldName(field.name)} to`}
								defaultValue={searchParams.get(`${name}To`) ?? undefined}
								step={field.step ?? "1"}
							/>
						</div>
					) : field.type === "date" ? (
						<RangePicker
							key={field.name}
							fromName={`${field.name}From`}
							toName={`${field.name}To`}
							label={getFieldName(field.name)}
							defaultValues={{
								from: searchParams.get(`${name}From`) ?? undefined,
								to: searchParams.get(`${name}To`) ?? undefined,
							}}
							time
						/>
					) : field.type === "enum" ? (
						<Select
							multiple
							key={field.name}
							name={field.name}
							placeholder={"Select options"}
							label={getFieldName(field.name)}
							defaultValue={searchParams.getAll(name) ?? ["ALL"]}
							items={[
								{ label: "Any", value: "ALL" },
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : field.type === "foreignKey" ? (
						<Select
							multiple
							key={field.name}
							name={field.name}
							placeholder={"Select options"}
							label={getFieldName(field.name)}
							defaultValue={searchParams.getAll(name) ?? ["ALL"]}
							items={[
								{ label: "Any", value: "ALL" },
								...(optionsCache[field.name] ?? []),
							]}
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
