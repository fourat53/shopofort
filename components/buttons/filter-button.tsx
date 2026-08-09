"use client";

import { IconFilter } from "@tabler/icons-react";
import { useState } from "react";
import { filterEntity } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity } from "./current-entity";

export default function FilterButton({ disabled }: { disabled?: boolean }) {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleFilter = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!entity) return;
		setLoading(true);
		try {
			await filterEntity(entity);
		} catch (error) {
			console.error("Failed to filter entity", error);
		} finally {
			setLoading(false);
			setOpen(false);
			entity === "user" && window.location.reload();
		}
	};

	if (!entity) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled || loading || !entity}>
					<IconFilter className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="w-90">
				<DialogTitle>Filter {entity}</DialogTitle>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button onClick={handleFilter} loading={loading}>
						Filter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
