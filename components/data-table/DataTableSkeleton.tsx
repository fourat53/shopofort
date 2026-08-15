import { IconSelect } from "@tabler/icons-react";
import { clsx } from "clsx";
import type { HasImage } from "@/components/data-table/DataTable";
import {
	IMAGE_PAGE_SIZE,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
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
					<TableHead>
						<IconSelect className="size-4" />
					</TableHead>
					{header.map((item) => (
						<TableHead key={item.label} border>
							{item.label}
						</TableHead>
					))}
					<TableHead border>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rIndex) => (
					<TableRow key={rIndex}>
						<TableCell className="w-8 max-w-8">
							<Checkbox />
						</TableCell>
						{header.map((item) => (
							<TableCell
								key={item.label}
								border
								className={clsx(hasImage !== "none" && "h-18")}
								style={{ width: item.width, minWidth: item.width }}
							>
								{item.label === "Images" ? (
									<div className="w-fit flex gap-2">
										{Array.from({ length: 4 }).map((_, cIndex) => (
											<Skeleton key={cIndex} className="size-14" />
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
						<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
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
