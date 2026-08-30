"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import { isDate } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import FilterForm from "@/components/forms/filter-form";
import CurrentEntity from "@/components/title/CurrentEntity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/entity-fields";

export default function FilterDialog() {
	const entity = CurrentEntity();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState<boolean>(false);

	const fields = useMemo(() => getEntityFields(entity, "filter"), [entity]);
	const hasFilters = [...searchParams.keys()].some(
		(key) => !["page", "sortBy", "order"].includes(key),
	);

	function handleClear() {
		const newParams = new URLSearchParams();

		newParams.set("page", "1");

		for (const key of ["sortBy", "order"]) {
			const value = searchParams.get(key);
			if (value !== null) newParams.set(key, value);
		}

		const qs = newParams.toString();
		const newUrl = `${pathname}?${qs}`;

		startTransition(() => {
			router.push(newUrl);
		});
	}

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

				if (from && Number(from) !== min) {
					newParams.set(fromName, from);
				} else {
					newParams.delete(fromName);
				}

				if (to && Number(to) !== max) {
					newParams.set(toName, to);
				} else {
					newParams.delete(toName);
				}

				continue;
			}

			if (type === "date") {
				const fromName = `${name}From`;
				const toName = `${name}To`;

				const from = formData.get(fromName)?.toString() ?? "";
				const to = formData.get(toName)?.toString() ?? "";

				if (from && isDate(from)) {
					newParams.set(fromName, from);
				} else {
					newParams.delete(fromName);
				}

				if (to && isDate(to)) {
					newParams.set(toName, to);
				} else {
					newParams.delete(toName);
				}

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

	if (!entity) return;

	return (
		<div
			className={clsx("flex gap-1.5", entity !== "users" && "pr-1.5 border-r")}
		>
			{hasFilters && (
				<Button
					variant="outline"
					onClick={handleClear}
					className="size-8 p-2"
					icon={<IconArrowBackUp className="size-4" />}
				/>
			)}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						className="size-8 p-2"
						icon={<IconFilter className="size-4" />}
					/>
				</DialogTrigger>
				<FilterForm
					fields={fields}
					entity={entity}
					setOpen={setOpen}
					isPending={isPending}
					handleSubmit={handleSubmit}
					searchParams={searchParams}
				/>
			</Dialog>
		</div>
	);
}
