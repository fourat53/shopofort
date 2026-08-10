import DeleteButton from "@/components/buttons/delete-button";
import EditButton from "@/components/buttons/edit-button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CellContent from "./CellContent";
import type { EntityRowsType, HasImage } from "./DataTableLayout";

interface DataTableProps {
	header: string[];
	hasImage: HasImage;
	entityRows: EntityRowsType;
}

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
						<TableHead
							key={item}
							border={index !== 0}
							className={
								hasImage === "multiple"
									? "w-62 text-center"
									: hasImage === "one"
										? "min-w-18 text-center"
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
					rows.map((row) => (
						<TableRow key={row.id}>
							{Object.values(row).map((value, colIndex) => (
								<TableCell
									border={colIndex !== 0}
									key={`cell-${row.id}-${colIndex}`}
									className={
										hasImage === "multiple"
											? "h-18.25"
											: hasImage === "one"
												? "h-18.25"
												: "h-8.25"
									}
								>
									<CellContent
										value={value}
										headerName={header[colIndex]}
										colIndex={colIndex}
										rowId={row.id}
									/>
								</TableCell>
							))}
							<TableCell border className="py-0.5 w-20 text-center">
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
