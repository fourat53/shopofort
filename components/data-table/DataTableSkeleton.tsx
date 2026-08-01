import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import type { HasImage } from "./DataTableLayout";
import { IMAGE_PAGE_SIZE, PAGE_SIZE } from "./PaginationParams";

type DataTableSkeletonProps = {
	header: string[];
	hasImage?: HasImage;
};

export default function DataTableSkeleton({
	header,
	hasImage = "none",
}: DataTableSkeletonProps) {
	const rowCount = hasImage !== "none" ? IMAGE_PAGE_SIZE : PAGE_SIZE;
	return (
		<Table>
			<TableHeader className="bg-chart-1 dark:bg-sidebar-accent">
				<TableRow>
					{header.map((item, index) => (
						<TableCell key={index} border={index !== 0}>
							{item}
						</TableCell>
					))}
					<TableCell className="w-20 text-center">Actions</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rowIndex) => (
					<TableRow key={rowIndex}>
						{header.map((item, index) => (
							<TableCell key={item} border={index !== 0}>
								<Skeleton
									className={`w-full ${hasImage !== "none" ? "h-14" : "h-4"}`}
								/>
							</TableCell>
						))}
						<TableCell border className="p-0.5 w-20 text-center">
							<div className="flex items-center justify-center gap-1.5">
								<Button
									variant="ghost"
									border={false}
									disabled
									className="rounded-xl size-6 p-0"
								>
									<IconEdit className="h-4 w-4 text-mist-400" />
								</Button>
								<Button
									variant="ghost"
									border={false}
									disabled
									className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
								>
									<IconTrash className="h-4 w-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
