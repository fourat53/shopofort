import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DeleteButton from "../buttons/delete-button";
import EditButton from "../buttons/edit-button";
import type { HasImage } from "./DataTable";
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
			<TableHeader>
				<TableRow>
					{header.map((item, index) => (
						<TableHead
							key={index}
							border={index !== 0}
							className={
								item === "User ID"
									? "w-64"
									: item === "Images"
										? "w-66"
										: item === "Picture"
											? "w-18 max-w-18"
											: ""
							}
						>
							{item}
						</TableHead>
					))}
					<TableHead border className="w-20 text-center">
						Actions
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rowCount }, (_, rowIndex) => (
					<TableRow key={rowIndex}>
						{header.map((item, index) => (
							<TableCell
								key={item}
								border={index !== 0}
								className={
									item === "Images"
										? "h-18.5 w-66"
										: item === "Picture"
											? "h-18.5 w-18 max-w-18"
											: "h-8.5"
								}
							>
								{item === "Images" ? (
									<div className="w-fit flex gap-2">
										{Array.from({ length: 4 }).map((_, index) => (
											<Skeleton key={index} className="size-14" />
										))}
									</div>
								) : (
									<Skeleton
										className={`${item === "Picture" ? "size-14" : "w-full h-4"}`}
									/>
								)}
							</TableCell>
						))}
						<TableCell border className="py-0.5 w-20">
							<div className="flex items-center justify-center gap-1.5">
								<EditButton row={{ id: "" }} disabled />
								<DeleteButton id={""} disabled />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
