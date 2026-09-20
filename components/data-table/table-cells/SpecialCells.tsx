import clsx from "clsx";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
	OrderStatus,
	ProductColor,
	type ProductSize,
} from "@/lib/entity/types";

function ColorCell({
	value,
	className,
}: {
	value: ProductColor;
	className?: string;
}) {
	return (
		<Badge
			className={clsx(
				className,
				value === ProductColor.Red &&
					"bg-red-200/50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
				value === ProductColor.Green &&
					"bg-green-200/50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
				value === ProductColor.Blue &&
					"bg-blue-200/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
				value === ProductColor.Yellow &&
					"bg-yellow-200/50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
				value === ProductColor.Purple &&
					"bg-purple-200/50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
				value === ProductColor.Orange &&
					"bg-orange-200/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
				value === ProductColor.Pink &&
					"bg-pink-200/50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
				value === ProductColor.White &&
					"bg-zinc-300/30 dark:bg-zinc-700/80 text-zinc-500/75 dark:text-zinc-200",
				value === ProductColor.Gray &&
					"bg-zinc-300/50 dark:bg-zinc-700/40 text-zinc-500 dark:text-zinc-400",
				value === ProductColor.Black &&
					"bg-zinc-300/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-400/75",
			)}
		>
			{value}
		</Badge>
	);
}

function ColorsCell({ value }: { value: ProductColor[] }) {
	return (
		<div className="w-full grid grid-cols-4 justify-between items-center gap-1">
			{value.map((item, index) => (
				<ColorCell key={index} value={item} className="w-full" />
			))}
		</div>
	);
}

function SizeCell({ value }: { value: ProductSize }) {
	return (
		<Badge
			variant="outline"
			className="rounded-lg bg-mist-300/40 dark:bg-mist-700/60"
		>
			{value}
		</Badge>
	);
}

function SizesCell({ value }: { value: ProductSize[] }) {
	return (
		<div className="flex items-center gap-1.5">
			{value.map((item, index) => (
				<SizeCell key={index} value={item} />
			))}
		</div>
	);
}

function ImageCell({ value, small }: { value: string; small?: boolean }) {
	const imageSize = small ? 32 : 58;
	return (
		<Image
			src={String(value)}
			alt={String(value)}
			width={1000}
			height={1000}
			loading="eager"
			className="rounded-md object-cover"
			style={{
				height: imageSize + "px",
				width: imageSize + "px",
				minWidth: imageSize + "px",
			}}
		/>
	);
}

function ImagesCell({ value, small }: { value: string[]; small?: boolean }) {
	return (
		<div className="h-14.5 flex gap-2 overflow-y-auto">
			{value.map((item, index) => (
				<ImageCell key={index} value={item} small={small} />
			))}
		</div>
	);
}

function OrderStatusCell({ value }: { value: string }) {
	return (
		<Badge
			className={clsx(
				value === OrderStatus.PENDING &&
					"bg-yellow-200/50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
				value === OrderStatus.PROCESSING &&
					"bg-blue-200/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
				value === OrderStatus.SHIPPED &&
					"bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
				value === OrderStatus.DELIVERED &&
					"bg-green-200/50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
				value === OrderStatus.CANCELLED &&
					"bg-red-200/50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
			)}
		>
			{value}
		</Badge>
	);
}

export {
	ColorCell,
	ColorsCell,
	ImageCell,
	ImagesCell,
	OrderStatusCell,
	SizeCell,
	SizesCell,
};
