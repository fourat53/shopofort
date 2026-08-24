import { clsx } from "clsx";
import {
	IMAGE_PAGE_SIZE,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import SortableTableHead from "@/components/data-table/table-cells/SortableTableHead";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { HeaderType } from "@/lib/entity/entity-header";
import ListDialog from "../dialogs/list-dialog";

interface DataTableSkeletonProps {
	header: HeaderType;
	basePath: string;
	hasImage?: "none" | "one" | "multiple";
}

export default function DataTableSkeleton({
	header,
	basePath,
	hasImage = "none",
}: DataTableSkeletonProps) {
	const rowCount = hasImage !== "none" ? IMAGE_PAGE_SIZE : PAGE_SIZE;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<Checkbox />
					</TableHead>
					{header.map((item) => (
						<SortableTableHead
							key={item.name}
							name={item.name}
							basePath={basePath}
						/>
					))}
					<TableHead border className="py-0 text-center">
						Actions
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rIndex) => (
					<TableRow key={rIndex}>
						<TableCell className="w-8 min-w-8 max-w-8">
							<Checkbox />
						</TableCell>
						{header.map((item) => (
							<TableCell
								key={item.name}
								border
								className={clsx(hasImage !== "none" && "h-18")}
								style={{ width: item.width, minWidth: item.width }}
							>
								{item.name === "images" ? (
									<div className="w-fit flex gap-2">
										{Array.from({ length: 4 }).map((_, cIndex) => (
											<Skeleton key={cIndex} className="size-14" />
										))}
									</div>
								) : (
									<Skeleton
										className={clsx(
											"h-4",
											item.name === "picture" && "h-14 rounded-xl",
										)}
									/>
								)}
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
							<div className="flex items-center justify-center gap-1.5">
								<ListDialog disabled />
								<EditDialog disabled />
								<DeleteDialog disabled />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
