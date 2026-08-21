"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ImageItem = string | File;

interface ImageUploadProps {
	name?: string;
	label?: string;
	images: ImageItem[];
	onChange: (images: ImageItem[]) => void;
	className?: string;
	required?: boolean;
}

function ImagePreview({
	item,
	onRemove,
}: {
	item: ImageItem;
	onRemove: () => void;
}) {
	const isFile = item instanceof File;
	const [objectUrl] = useState<string | null>(() =>
		isFile ? URL.createObjectURL(item) : null,
	);

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [objectUrl]);

	const src = isFile ? objectUrl : item;

	return (
		<div className="relative w-28 h-28 border rounded-lg overflow-hidden group">
			{src ? (
				<Image
					src={src}
					alt={isFile ? item.name : `Image ${src}`}
					fill
					className="h-full w-fit object-cover"
				/>
			) : null}
			<button
				type="button"
				onClick={onRemove}
				className="hover:cursor-pointer absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<IconX className="w-3 h-3" />
			</button>
		</div>
	);
}

export function ImageUpload({
	name,
	label,
	images,
	onChange,
	className,
	required,
}: ImageUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDivClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			onChange([...images, ...selectedFiles]);
		}
		e.target.value = "";
	};

	const removeImage = (indexToRemove: number) => {
		onChange(images.filter((_, index) => index !== indexToRemove));
	};

	return (
		<div className={className}>
			<Label className="pb-1.5" required={required}>
				{label}
			</Label>

			<input
				name={name}
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				multiple
				accept="image/*"
				className="sr-only"
				required={required}
			/>

			<div
				className={cn(
					"w-full grid grid-cols-3 gap-2 items-center",
					images.length === 0 && "grid-cols-1",
				)}
			>
				{images.map((item, idx) => (
					<ImagePreview
						key={
							item instanceof File
								? `${item.name}-${item.lastModified}-${item.size}`
								: item
						}
						item={item}
						onRemove={() => removeImage(idx)}
					/>
				))}

				<button
					type="button"
					onClick={handleDivClick}
					className={cn(
						"w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-800 transition-colors",
						images.length % 3 === 0 && "w-full col-span-3",
						images.length % 3 === 1 && "w-full col-span-2",
					)}
				>
					<IconUpload className="w-6 h-6 text-mist-400 mb-1" />
					<span className="text-xs text-mist-500">Upload</span>
				</button>
			</div>
		</div>
	);
}
