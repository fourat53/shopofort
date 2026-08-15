import { clsx } from "clsx";
import type { HasImage } from "@/components/data-table/DataTable";
import {
	IMAGE_PAGE_SIZE,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { HeaderType } from "@/lib/entity/entity-headers";

interface DataTableSkeletonProps {
	header: HeaderType;
	hasImage?: HasImage;
}

export default function DataTableSkeleton({
	header,
	hasImage = "none",
}: DataTableSkeletonProps) {
	const rowCount = hasImage !== "none" ? IMAGE_PAGE_SIZE : PAGE_SIZE;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{header.map((item, index) => (
						<TableHead key={index} border={index !== 0}>
							{item.label}
						</TableHead>
					))}
					<TableHead border>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rowIndex) => (
					<TableRow key={rowIndex}>
						{header.map((item, index) => (
							<TableCell
								key={item.label}
								border={index !== 0}
								className={clsx("truncate", hasImage !== "none" && "h-18")}
								style={{
									width: `${item.width}px`,
									minWidth: `${item.width}px`,
									maxWidth: `${item.width}px`,
								}}
							>
								{item.label === "Images" ? (
									<div className="w-fit flex gap-2">
										{Array.from({ length: 4 }).map((_, index) => (
											<Skeleton key={index} className="size-14" />
										))}
									</div>
								) : (
									<Skeleton
										className={clsx(
											"h-4",
											item.label === "Picture" && "h-14 rounded-xl",
										)}
									/>
								)}
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-30 min-w-30 max-w-30">
							<div className="flex items-center justify-center gap-1.5">
								<EditDialog row={{ id: "" }} disabled />
								<DeleteDialog id={""} disabled />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
