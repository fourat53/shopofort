"use client";

import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { updateEntities } from "@/actions/EntityActions";
import DialogForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	CurrentEntity,
	getEntityFields,
	type ValueType,
} from "@/lib/entity/current-entity";
import { getPluralFromName } from "@/lib/entity/entity-header";

interface BulkEditDialogProps<T> {
	rows: T[];
}

export default function EditBulkDialog<
	T extends Record<string, unknown> & { id: number | string },
>({ rows }: BulkEditDialogProps<T>) {
	const router = useRouter();
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const ids = useMemo(() => rows.map((row) => row.id), [rows]);
	const fields = useMemo(() => getEntityFields(entity, "edit"), [entity]);

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		try {
			await updateEntities(entity, ids, formData);
			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Error updating entities:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity || ids.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={loading || !entity}
					className="rounded-xl size-6 p-0"
					border={false}
				>
					<IconEdit className="h-4 w-4 text-mist-400" />
				</Button>
			</DialogTrigger>
			<DialogForm
				type="edit"
				entity={entity}
				label={`Update the selected ${ids.length} ${getPluralFromName(entity)}`}
				fields={fields}
				loading={loading}
				open={open}
				setOpen={setOpen}
				handleSubmit={handleSubmit}
				rowImages={rows[0].images as string[]}
				getValue={(field) => rows[0][field.name] as ValueType}
			/>
		</Dialog>
	);
}
