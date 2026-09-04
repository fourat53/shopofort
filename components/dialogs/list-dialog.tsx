import { IconList } from "@tabler/icons-react";
import Image from "next/image";
import { Suspense } from "react";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
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
import DataTable from "../data-table/DataTable";

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
				className="[calc(100vh-100px)] min-w-fit overflow-y-hidden flex flex-col gap-4"
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
						const entity: EntityType = getFieldEntity(name) as EntityType;
						const header = getHeader(entity);
						return (
							<TabsContent
								key={name}
								value={name}
								className="h-[calc(100vh-152px)] min-w-[70vw]"
							>
								{name === "images" &&
								value.every((i) => typeof i === "string") ? (
									<ImageCarousel images={value} />
								) : (
									<Suspense
										fallback={
											<DataTableSkeleton entity={entity} header={header} />
										}
									>
										<DataTable<ListRowType>
											dialog
											entity={entity}
											header={header}
											rows={name in row ? (row[name] as ListRowType[]) : []}
											className="h-[calc(100vh-152px)]"
										/>
									</Suspense>
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
	if (images.length === 0)
		return (
			<div className="w-full h-[calc(100vh-152px)] bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground">
				No images available
			</div>
		);
	return (
		<Carousel>
			<CarouselContent className="w-[70vw]">
				{images.map((image, index) => (
					<CarouselItem
						key={index}
						className="p-0 h-[calc(100vh-152px)] bg-mist-300 dark:bg-mist-950 flex justify-center items-center rounded-xl"
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
			{images.length > 1 && (
				<>
					<CarouselPrevious />
					<CarouselNext />
				</>
			)}
		</Carousel>
	);
}
