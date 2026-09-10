import { IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

export default function ClientFooter() {
	return (
		<footer className="px-12">
			<div className="p-12 pr-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
				<div className="col-span-2 lg:col-span-2">
					<div className="flex items-center gap-2 mb-6">
						<IconShoppingBag className="size-8 text-primary" />
						<span className="text-2xl font-black tracking-tighter">
							Shopofort
						</span>
					</div>
					<p className="text-muted-foreground max-w-xs mb-6 leading-relaxed text-sm">
						The ultimate destination for modern fashion, accessories, and the
						latest tech gadgets.
					</p>
				</div>

				<div>
					<h4 className="font-bold mb-4">Shop</h4>
					<ul className="space-y-3 text-sm text-muted-foreground">
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Men's Fashion
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Women's Fashion
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Kids & Babies
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Accessories
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="font-bold mb-4">Support</h4>
					<ul className="space-y-3 text-sm text-muted-foreground">
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Help Center
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Track Order
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Returns & Refunds
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Contact Us
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="font-bold mb-4">Company</h4>
					<ul className="space-y-3 text-sm text-muted-foreground">
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								About Us
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Careers
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-primary transition-colors">
								Terms of Service
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="p-5 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
				<p>© 2026 Shopofort Inc. All rights reserved.</p>
				<div className="flex gap-4">
					<Link href="#" className="hover:text-primary">
						Facebook
					</Link>
					<Link href="#" className="hover:text-primary">
						Twitter
					</Link>
					<Link href="#" className="hover:text-primary">
						Instagram
					</Link>
				</div>
			</div>
		</footer>
	);
}
