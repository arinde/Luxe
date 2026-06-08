import { HeroSection } from "@/components/home/Hero";
import ProductsSection from "@/components/home/Products";
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