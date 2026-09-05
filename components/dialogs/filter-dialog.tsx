"use client";

import { IconArrowBackUp, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import FilterForm from "@/components/forms/filter-form";
import CurrentEntity from "@/components/title/CurrentEntity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/fields";

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
					searchParams={searchParams}
					isPending={isPending}
					startTransition={startTransition}
				/>
			</Dialog>
		</div>
	);
}
