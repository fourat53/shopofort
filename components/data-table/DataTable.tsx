import clsx from "clsx";
import Image from "next/image";
import DeleteButton from "@/components/buttons/delete-button";
import EditButton from "@/components/buttons/edit-button";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { EntityRowsType, HasImage } from "./DataTableLayout";
import EntityTooltip from "./EntityTooltip";

type DataTableBaseProps = {
	header: string[];
	hasImage: HasImage;
};

type DataTableProps = DataTableBaseProps & EntityRowsType;

export default function DataTable({
	header,
	hasImage,
	entityRows,
}: DataTableProps) {
	const [entity, rows] = entityRows;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{header.map((item, index) => (
						<TableCell
							key={item}
							border={index !== 0}
							headerCell
							className={clsx(
								hasImage === "multiple" && "w-62 text-center",
								hasImage === "one" && "min-w-18 text-center",
							)}
						>
							{item}
						</TableCell>
					))}
					<TableCell border headerCell className="w-20 text-center">
						Actions
					</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={header.length + 1}
							className="h-40 text-sm text-center"
						>
							No data available
						</TableCell>
					</TableRow>
				) : (
					rows.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							{Object.values(row).map((value, colIndex) => (
								<TableCell
									border={colIndex !== 0}
									key={`cell-${rowIndex}-${colIndex}`}
								>
									{value ? (
										colIndex > 0 && header[colIndex].includes(" ID") ? (
											<EntityTooltip
												headerName={header[colIndex]}
												idValue={value}
											/>
										) : header[colIndex] === "Order Status" ? (
											<p
												className={clsx(
													"w-fit text-center bg-accent text-rose-100 rounded-full flex items-center px-2",
													value === "PENDING" &&
														"bg-[#ffe6a8] text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
													value === "PROCESSING" &&
														"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
													value === "SHIPPED" &&
														"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
													value === "DELIVERED" &&
														"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
													value === "CANCELLED" &&
														"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
												)}
											>
												{value}
											</p>
										) : header[colIndex] === "Picture" ? (
											<Image
												src={value}
												alt={`image-${value}`}
												width={56}
												height={56}
												loading="eager"
												className="size-14 shrink-0 object-cover rounded-full"
											/>
										) : header[colIndex] === "Images" ? (
											<div className="flex gap-2 overflow-x-auto w-62 items-center scrollbar-none">
												{(Array.isArray(value) ? value : [value]).map(
													(imgSrc) => (
														<Image
															key={`${row.id}-${imgSrc}`}
															src={imgSrc}
															alt={`image-${imgSrc}`}
															loading="eager"
															width={56}
															height={56}
															className="size-14 shrink-0 object-cover rounded-md"
														/>
													),
												)}
											</div>
										) : (
											value
										)
									) : (
										"-"
									)}
								</TableCell>
							))}
							<TableCell border className="p-0.5 w-20 text-center">
								<div className="flex items-center justify-center gap-1.5">
									{/* @ts-expect-error - correct type expected */}
									<EditButton entityRow={[entity, row]} />
									<DeleteButton id={row.id} />
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
