import { HeroSection } from "@/app/home/component/Hero";
import ProductsSection from "@/app/home/component/Products";
import Footer from "@/components/layout/Footer";


export default function Home() {
    return(
        <div>
            <HeroSection />
            <ProductsSection />
            <Footer />
        </div>
    )
}