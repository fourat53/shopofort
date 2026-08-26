"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { StringNumber } from "@/lib/entity/types";

type Row = { id: StringNumber };

let selectedIds = new Set<StringNumber>();

const emptySelection = new Set<StringNumber>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function getSnapshot() {
	return selectedIds;
}

function getServerSnapshot() {
	return emptySelection;
}

function updateSelection(
	updater: (current: Set<StringNumber>) => Set<StringNumber>,
) {
	selectedIds = updater(selectedIds);

	for (const listener of listeners) {
		listener();
	}
}

function useSelection<T extends Row>(rows: T[]) {
	const currentSelectedIds = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	useEffect(() => {
		const rowIds = new Set(rows.map((row) => row.id));

		const pruned = new Set([...selectedIds].filter((id) => rowIds.has(id)));

		if (pruned.size !== selectedIds.size) {
			selectedIds = pruned;

			for (const listener of listeners) {
				listener();
			}
		}
	}, [rows]);

	const someSelected = currentSelectedIds.size > 0;

	const allSelected =
		rows.length > 0 && rows.every((row) => currentSelectedIds.has(row.id));

	const toggleAll = (checked: boolean) => {
		updateSelection((current) => {
			const next = new Set(current);

			if (checked) {
				for (const row of rows) {
					next.add(row.id);
				}
			} else {
				for (const row of rows) {
					next.delete(row.id);
				}
			}

			return next;
		});
	};

	const toggleRow = (id: StringNumber, checked: boolean) => {
		updateSelection((current) => {
			const next = new Set(current);

			if (checked) {
				next.add(id);
			} else {
				next.delete(id);
			}

			return next;
		});
	};

	const selectedRows = rows.filter((row) => currentSelectedIds.has(row.id));

	return {
		selectedIds: currentSelectedIds,
		selectedRows,
		someSelected,
		allSelected,
		toggleAll,
		toggleRow,
	};
}

export { useSelection };
