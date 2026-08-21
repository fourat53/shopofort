"use client";

import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { createEntity } from "@/actions/EntityActions";
import DialogForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity, getEntityFields } from "@/lib/entity/current-entity";
import { getSingleFromName } from "@/lib/entity/entity-header";

export default function CreateDialog() {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const fields = useMemo(() => getEntityFields(entity, "create"), [entity]);

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		try {
			await createEntity(entity, formData);
		} catch (error) {
			console.error("Error creating entity:", error);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	if (!entity || entity === "user") return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<IconPlus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogForm
				type="create"
				entity={entity}
				label={`Create ${getSingleFromName(entity)}`}
				fields={fields}
				loading={loading}
				open={open}
				setOpen={setOpen}
				handleSubmit={handleSubmit}
				getValue={(field) => field.defaultValue}
			/>
		</Dialog>
	);
}
