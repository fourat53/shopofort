import { IconList } from "@tabler/icons-react";
import Image from "next/image";
import DataTable from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFieldEntity, getFieldName } from "@/lib/entity/functions";
import { getHeader } from "@/lib/entity/headers";
import { EntityType, type ListRowType, type RowType } from "@/lib/entity/types";
import { uploadConfig } from "@/lib/uploadthing/client";

interface ListDialogProps<T> {
	row?: T;
	entity: EntityType;
	disabled?: boolean;
}

export default async function ListDialog<T extends RowType>({
	row,
	entity,
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
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconList className="size-4 text-mist-400" />}
			/>
		);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					className="size-6 p-1"
					icon={<IconList className="size-4 text-mist-400" />}
				/>
			</DialogTrigger>
			<DialogContent
				showCloseButton
				className="min-w-[calc(100vw-100px)] flex flex-col gap-4"
			>
				<Tabs className="w-full flex flex-col items-center gap-4">
					<TabsList>
						{Object.entries(row).map(([name, value]) => {
							if (!Array.isArray(value)) return null;
							return (
								<TabsTrigger key={name} value={name}>
									{getFieldName(name)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					{Object.entries(row).map(([name, value]) => {
						if (!Array.isArray(value)) return null;
						const tabEntity: EntityType = getFieldEntity(name) as EntityType;
						const header = getHeader(tabEntity);
						const { field, multiple } = uploadConfig[entity] ?? {};
						return (
							<TabsContent
								key={name}
								value={name}
								className="w-full h-[calc(100vh-152px)]"
							>
								{value.every((item) => typeof item === "string") &&
								name === field &&
								multiple ? (
									<ImageCarousel images={value} />
								) : (
									<DataTable<ListRowType>
										entity={tabEntity}
										header={header}
										rows={name in row ? (row[name] as ListRowType[]) : []}
										className="h-[calc(100vh-152px)]"
										dialog
									/>
								)}
							</TabsContent>
						);
					})}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

function ImageCarousel({ images }: { images: string[] }) {
	return images.length === 0 ? (
		<div className="h-[calc(100vh-152px)] w-full bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground">
			No images available
		</div>
	) : (
		<Carousel className="bg-muted dark:bg-mist-950 rounded-xl">
			<CarouselContent>
				{images.map((image, index) => (
					<CarouselItem
						key={index}
						className="h-[calc(100vh-152px)] p-0 pl-4 flex justify-center items-center"
					>
						<Image
							src={image}
							alt={image}
							width={1000}
							height={1000}
							className="h-[calc(100vh-152px)] w-auto"
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
