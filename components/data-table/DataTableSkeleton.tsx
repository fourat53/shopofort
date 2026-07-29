import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import DeleteButton from "../buttons/delete-button";
import EditButton from "../buttons/edit-button";
import { IMAGE_PAGE_SIZE, PAGE_SIZE } from "./PaginationParams";

type DataTableSkeletonProps = {
	header: string[];
	hasImages?: boolean;
};

export default function DataTableSkeleton({
	header,
	hasImages,
}: DataTableSkeletonProps) {
	const rowCount = hasImages ? IMAGE_PAGE_SIZE : PAGE_SIZE;
	return (
		<Table parentClassName="border border-mist-300 dark:border-mist-700 rounded-lg">
			<TableHeader className="bg-chart-1 dark:bg-sidebar-accent">
				<TableRow>
					{header.map((item, index) => (
						<TableCell
							key={index}
							className={cn(
								"border-l border-mist-300 dark:border-mist-700",
								item === header[0] && "border-none",
							)}
						>
							{item}
						</TableCell>
					))}
					<TableCell className="border-l border-mist-300 dark:border-mist-700 w-20 text-center">
						Actions
					</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rowIndex) => (
					<TableRow key={rowIndex}>
						{header.map((item) => (
							<TableCell
								key={item}
								className={cn(
									"-z-10 border-l border-mist-300 dark:border-mist-700",
									item === header[0] && "border-none",
								)}
							>
								<Skeleton
									className={clsx("w-full", hasImages ? "h-14" : "h-4")}
								/>
							</TableCell>
						))}
						<TableCell className="p-0.5 border-l border-mist-300 dark:border-mist-700 w-20 text-center">
							<div className="flex items-center justify-center gap-1.5">
								<EditButton row={{}} disabled />
								<DeleteButton id={-1} disabled />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
