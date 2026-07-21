import { PAGE_SIZE, IMAGE_PAGE_SIZE } from "./PaginationParams";
import EntityTooltip from "./EntityTooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import clsx from "clsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import EditButton from "@/components/buttons/edit-button";
import DeleteButton from "@/components/buttons/delete-button";

type DataTableProps<T> = {
  header: string[];
  rows: T[];
};

export default function DataTable<
  T extends { id: number } & Record<string, unknown>,
>({ header, rows }: DataTableProps<T>) {
  const serializedRows = JSON.parse(JSON.stringify(rows)) as T[];
  return (
    <Table
      parentClassName={"w-full h-[calc(100vh-166.5px)]"}
      className={clsx(
        ((!header.some((item) => item === "Images") &&
          serializedRows.length < PAGE_SIZE) ||
          (header.some((item) => item === "Images") &&
            serializedRows.length < IMAGE_PAGE_SIZE)) &&
          "border-b border-mist-300 dark:border-mist-700",
      )}
    >
      <TableHeader className="bg-chart-1 dark:bg-sidebar-accent">
        <TableRow>
          {header.map((item) => (
            <TableCell
              key={item}
              className={cn(
                "border-l border-mist-300 dark:border-mist-700",
                item === header[0] && "border-none",
                item === "Images" && "w-62 text-center",
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
        {serializedRows.map((row) => (
          <TableRow key={row.id}>
            {Object.values(row).map((value, colIndex) => (
              <TableCell
                key={`${row.id}-${header[colIndex]}`}
                className={cn(
                  "border-l border-mist-300 dark:border-mist-700",
                  colIndex === 0 && "border-none",
                )}
              >
                {value ? (
                  colIndex > 0 &&
                  header[colIndex].toLowerCase().includes("id") ? (
                    <EntityTooltip
                      headerName={header[colIndex]}
                      idValue={String(value)}
                    />
                  ) : header[colIndex].toLowerCase().includes("status") ? (
                    <p
                      className={cn(
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
                      {String(value)}
                    </p>
                  ) : header[colIndex].toLowerCase() === "images" ? (
                    <div className="flex gap-2 overflow-x-auto w-62 items-center scrollbar-none">
                      {(Array.isArray(value) ? value : [value]).map(
                        (imgSrc, idx) => (
                          <Image
                            key={idx}
                            src={String(imgSrc)}
                            alt="image"
                            loading="eager"
                            width={56}
                            height={56}
                            className="size-14 shrink-0 object-cover rounded-md border border-mist-300 dark:border-mist-700"
                          />
                        ),
                      )}
                    </div>
                  ) : (
                    String(value)
                  )
                ) : (
                  "-"
                )}
              </TableCell>
            ))}
            <TableCell className="p-0.5 border-l border-mist-300 dark:border-mist-700 w-20 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <EditButton row={row} />
                <DeleteButton id={row.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
