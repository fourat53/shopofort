import { IconList } from "@tabler/icons-react";
import ListDataTable from "@/components/data-table/ListDataTable";
import ListImageCarousel from "@/components/dialog-content/ListImageCarousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getListHeader } from "@/lib/entity/headers";
import {
	type EntityRow,
	EntityType,
	type ListEntityRow,
} from "@/lib/entity/types";
import {
	getFieldEntity,
	getFieldName,
	getSingleName,
	isTabValue,
} from "@/lib/functions/client";
import { uploadConfig } from "@/lib/uploadthing/client";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListDialogProps<T extends EntityType> {
	entity: T;
	row?: EntityRow<T>;
	disabled?: boolean;
}

export default function ListDialog<T extends EntityType>({
	entity,
	row,
	disabled,
}: ListDialogProps<T>) {
	if (
		[
			EntityType["order-items"],
			EntityType["cart-items"],
			EntityType.users,
		].includes(entity)
	)
		return null;

	if (!row || disabled)
		return (
			<Button
				variant="ghost"
				aria-label="View lists"
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconList className="size-4 text-mist-700 dark:text-mist-300" />}
			/>
		);

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							aria-label="View lists"
							disabled={disabled}
							className="size-6 p-1"
							icon={
								<IconList className="size-4 text-mist-700 dark:text-mist-300" />
							}
						/>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>View {getSingleName(entity)} lists</TooltipContent>
			</Tooltip>

			<DialogContent
				showCloseButton
				className="p-4 min-w-[calc(100vw-100px)] flex flex-col gap-4"
			>
				<Tabs className="w-full flex flex-col items-center gap-4">
					<TabsList>
						{Object.entries(row).map(([name, value]) => {
							const { field } = uploadConfig[entity] ?? {};
							return (
								isTabValue(value, name, field) && (
									<TabsTrigger key={name} value={name}>
										{getFieldName(name)}
									</TabsTrigger>
								)
							);
						})}
					</TabsList>
					{Object.entries(row).map(([name, value]) => {
						const { field } = uploadConfig[entity] ?? {};
						const tabEntity = getFieldEntity(name);
						const header = getListHeader(tabEntity);
						return (
							isTabValue(value, name, field) && (
								<TabsContent
									key={name}
									value={name}
									className="w-full h-[calc(100vh-152px)]"
								>
									{name === field ? (
										<ListImageCarousel images={value as string[]} />
									) : (
										<ListDataTable<typeof tabEntity>
											entity={tabEntity}
											header={header}
											rows={value as ListEntityRow<typeof tabEntity>[]}
											className="h-[calc(100vh-152px)]"
										/>
									)}
								</TabsContent>
							)
						);
					})}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
