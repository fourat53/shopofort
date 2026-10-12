import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export default function ImageCarousel({ images }: { images: string[] }) {
	return images.length === 0 ? (
		<div className="h-[calc(100vh-152px)] w-full bg-chart-1/40 dark:bg-sidebar-accent/40 flex items-center justify-center border rounded-lg text-muted-foreground">
			No images available
		</div>
	) : (
		<Carousel className="bg-mist-300 dark:bg-mist-950/80 rounded-xl">
			<CarouselContent>
				{images.map((image, index) => (
					<CarouselItem
						key={index}
						className="h-[calc(100vh-152px)] p-0 pl-4 flex justify-center items-center"
					>
						<Image
							src={image}
							alt={image}
							width={1000}
							height={1000}
							className="h-[calc(100vh-152px)] w-auto"
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
