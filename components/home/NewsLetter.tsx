import { Input } from "@/components/form-items/input";
import { Button } from "@/components/ui/button";

export default function NewsLetter() {
	return (
		<section className="py-16 border-y bg-background flex flex-col gap-4 text-center">
			<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
				Join Our Newsletter
			</h2>
			<p className="text-muted-foreground max-w-2xl mx-auto">
				Subscribe to get special offers, free giveaways, and once-in-a-lifetime
				deals.
			</p>
			<form className="pb-2 w-full flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
				<Input
					type="email"
					placeholder="Enter your email"
					className="h-10 text-sm rounded-xl"
				/>
				<Button className="h-10 text-sm px-4">Subscribe</Button>
			</form>
		</section>
	);
}
