"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface ImageUploadProps {
	images: File[];
	onChange: (files: File[]) => void;
	className?: string;
}

export function ImageUpload({ images, onChange, className }: ImageUploadProps) {
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

	useEffect(() => {
		return () => {
			for (const image of images) {
				URL.revokeObjectURL(URL.createObjectURL(image));
			}
		};
	}, [images]);

	return (
		<div className={className}>
			<Label className="pb-1.5">Product Images</Label>

			{/* Hidden File Input */}
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				multiple
				accept="image/*"
				className="hidden"
			/>

			<div
				className={cn(
					"w-full grid grid-cols-3 gap-2 items-center",
					images.length === 0 && "grid-cols-1",
				)}
			>
				{/* Image Previews */}
				{images.map((img, idx) => (
					<div
						key={idx}
						className="relative w-28 h-28 border border-mist-400/70 dark:border-mist-700 rounded-lg overflow-hidden group"
					>
						<Image
							src={URL.createObjectURL(img)}
							alt={`Preview ${idx}`}
							fill
							className="h-full w-fit object-cover"
						/>
						<button
							type="button"
							onClick={() => removeImage(idx)}
							className="hover:cursor-pointer absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<IconX className="w-3 h-3" />
						</button>
					</div>
				))}

				{/* Clickable Upload Dropzone */}
				<button
					type="button"
					onClick={handleDivClick}
					className={cn(
						"w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-mist-400/70 dark:border-mist-700 rounded-lg cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-800 transition-colors",
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
