import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IMAGE_PAGE_SIZE, PAGE_SIZE } from "./PaginationParams";
import clsx from "clsx";

type DataTableSkeletonProps = {
  header: string[];
  hasImages: boolean;
};

export default function DataTableSkeleton({
  header,
  hasImages,
}: DataTableSkeletonProps) {
  const rowCount = hasImages ? IMAGE_PAGE_SIZE : PAGE_SIZE;
  return (
    <Table>
      <TableHeader className="bg-chart-1 dark:bg-sidebar-accent">
        <TableRow>
          {header.map((item) => (
            <TableCell
              key={item}
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
          <TableRow key={`${header[0]}-${rowIndex}`}>
            {header.map((item) => (
              <TableCell
                key={item}
                className={cn(
                  "border-l border-mist-300 dark:border-mist-700",
                  item === header[0] && "border-none",
                )}
              >
                <Skeleton
                  className={clsx("w-full", hasImages ? "h-14" : "h-4")}
                />
              </TableCell>
            ))}
            <TableCell className="border-l border-mist-300 dark:border-mist-700 w-20 text-center">
              <Skeleton
                className={clsx("w-full", hasImages ? "h-14" : "h-4")}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
