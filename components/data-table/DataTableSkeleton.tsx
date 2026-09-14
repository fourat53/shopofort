import SortHead from "@/components/data-table/table-cells/SortHead";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import ListDialog from "@/components/dialogs/list-dialog";
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
import type { HeaderItem } from "@/lib/entity/headers";
import type { EntityType } from "@/lib/entity/types";
import { uploadConfig } from "@/lib/uploadthing/client";

interface DataTableSkeletonProps {
	entity: EntityType;
	header: HeaderItem[];
	pageSize: number;
}

export default function DataTableSkeleton({
	entity,
	header,
	pageSize,
}: DataTableSkeletonProps) {
	const { field, multiple } = uploadConfig[entity] ?? {};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<Checkbox />
					</TableHead>
					{header.map((item) => (
						<SortHead key={item.name} name={item.name} entity={entity} />
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
								className={item.name === field ? "size-18.5" : "h-[33.6px]"}
								style={{
									width: item.width,
									minWidth: item.width,
								}}
							>
								{item.name === field && multiple ? (
									<div className="flex gap-2 overflow-y-auto">
										{Array.from({ length: 3 }, (_, index) => (
											<Skeleton key={index} className="size-14.5 rounded-xl" />
										))}
									</div>
								) : (
									<Skeleton
										className={
											item.name === field && !multiple
												? "size-14.5 rounded-xl"
												: "h-4"
										}
									/>
								)}
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-26 max-w-26 min-w-26">
							<div className="flex items-center justify-center gap-1.5">
								<ListDialog entity={entity} disabled />
								<EditDialog entity={entity} disabled />
								<DeleteDialog entity={entity} disabled />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
