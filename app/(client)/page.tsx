import ClientFooter from "@/components/home/ClientFooter";
import HeroSection from "@/components/home/HeroSection";
import NewsLetter from "@/components/home/NewsLetter";
import PopularCategories from "@/components/home/PopularCategories";
import TrendingProducts from "@/components/home/TrendingProducts";

export default function Home() {
	return (
		<>
			<HeroSection />
			<TrendingProducts />
			<PopularCategories />
			<NewsLetter />
			<ClientFooter />
		</>
	);
}
