import SortableTableHead from "@/components/data-table/table-cells/SortableTableHead";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import ListDialog from "@/components/dialogs/list-dialog";
import {
	IMAGE_PAGE_SIZE,
	PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
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
import type { HeaderItem } from "@/lib/entity/entity-header";
import type { EntityType } from "@/lib/entity/types";

interface DataTableSkeletonProps {
	entity: EntityType;
	header: HeaderItem[];
	hasImage?: boolean;
	pageSize?: number;
}

export default function DataTableSkeleton({
	entity,
	header,
	hasImage = false,
	pageSize = hasImage ? IMAGE_PAGE_SIZE : PAGE_SIZE,
}: DataTableSkeletonProps) {
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
							entity={entity}
						/>
					))}
					<TableHead border className="py-0 text-center">
						Actions
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: pageSize }, (_, rIndex) => (
					<TableRow key={rIndex}>
						<TableCell className="w-8 min-w-8 max-w-8">
							<Checkbox />
						</TableCell>
						{header.map((item) => (
							<TableCell
								key={item.name}
								border
								className={hasImage ? "h-18.5" : "h-[33.6px]"}
								style={{
									width: item.width,
									minWidth: item.width,
								}}
							>
								<Skeleton
									className={
										item.name === "picture" ? "h-14.5 rounded-xl" : "h-4"
									}
								/>
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
							<div className="flex items-center justify-center gap-1.5">
								<ListDialog entity={entity} disabled />
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
