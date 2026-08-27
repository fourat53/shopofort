"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
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

		for (const key of ["page", "sortBy", "order"]) {
			const value = searchParams.get(key);
			if (value !== null) newParams.set(key, value);
		}

		const qs = newParams.toString();
		const newUrl = qs ? `${pathname}?${qs}` : pathname;

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
			if (field.type === "number") {
				const min = field.min ?? 0;
				const max = field.max ?? 10000;

				const fromName = `${field.name}From`;
				const toName = `${field.name}To`;

				const from = formData.get(fromName)?.toString() ?? "";
				const to = formData.get(toName)?.toString() ?? "";

				if (Number(from) !== min) newParams.set(fromName, from);
				else newParams.delete(fromName);

				if (Number(to) !== max) newParams.set(toName, to);
				else newParams.delete(toName);
				continue;
			}

			if (field.type === "enum" || field.type === "foreignKey") {
				const values = formData
					.getAll(field.name)
					.map((value) => value.toString())
					.filter((value) => value !== "ALL");
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
					open={open}
					setOpen={setOpen}
					isPending={isPending}
					handleSubmit={handleSubmit}
					searchParams={searchParams}
				/>
			</Dialog>
		</div>
	);
}
