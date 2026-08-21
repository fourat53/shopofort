"use client";

import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { updateEntity } from "@/actions/EntityActions";
import DialogForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	CurrentEntity,
	getEntityFields,
	type ValueType,
} from "@/lib/entity/current-entity";
import { getSingleFromName } from "@/lib/entity/entity-header";

interface EditDialogProps<T> {
	row: T;
	disabled?: boolean;
}

export default function EditDialog<
	T extends Record<string, unknown> & { id: number | string },
>({ row, disabled }: EditDialogProps<T>) {
	const router = useRouter();
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const fields = useMemo(() => getEntityFields(entity, "edit"), [entity]);

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		try {
			await updateEntity(entity, row.id, formData);
			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Error updating entity:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled || loading || !entity}
					className="rounded-xl size-6 p-0"
					border={false}
				>
					<IconEdit className="h-4 w-4 text-mist-400" />
				</Button>
			</DialogTrigger>
			<DialogForm
				type="edit"
				entity={entity}
				label={`Update ${getSingleFromName(entity)}`}
				fields={fields}
				loading={loading}
				open={open}
				setOpen={setOpen}
				handleSubmit={handleSubmit}
				rowImages={row.images as string[]}
				getValue={(field) => row[field.name] as ValueType}
			/>
		</Dialog>
	);
}
