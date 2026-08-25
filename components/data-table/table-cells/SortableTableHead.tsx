"use client";

import {
	IconArrowDown,
	IconArrowsSort,
	IconArrowUp,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { sortHref } from "@/components/data-table/PaginationParams";
import { TableHead } from "@/components/ui/table";
import { type Entity, getFieldName } from "@/lib/entity/current-entity";

interface SortableTableHeadProps {
	name: string;
	entity: Entity;
}

export default function SortableTableHead({
	name,
	entity,
}: SortableTableHeadProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const sortBy = searchParams.get("sortBy");
	const order = searchParams.get("order");

	function handleClick() {
		if (name === "picture") return;
		startTransition(() => {
			router.push(sortHref(entity, searchParams, name), {
				scroll: false,
			});
		});
	}

	return (
		<TableHead border aria-disabled={isPending} onClick={handleClick}>
			<div className="relative w-full">
				<div>{getFieldName(name)}</div>
				<div
					className={clsx(
						"absolute right-0 top-1/2 -translate-y-1/2",
						name === "picture" && "hidden",
					)}
				>
					{sortBy === name && order === "asc" ? (
						<IconArrowUp className="h-3.5 w-3.5" />
					) : sortBy === name && order === "desc" ? (
						<IconArrowDown className="h-3.5 w-3.5" />
					) : (
						<IconArrowsSort className="h-3.5 w-3.5 text-muted-foreground" />
					)}
				</div>
			</div>
		</TableHead>
	);
}
