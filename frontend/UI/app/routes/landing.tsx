import Header from "~/components/landing/Header";
import HeroBanner from "~/components/landing/HeroBanner";
import Banner1 from "~/components/landing/Banner1";
import Banner2 from "~/components/landing/Banner2";
import Banner3 from "~/components/landing/Banner3";
import Footer from "~/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroBanner />
      <Banner1 />
      <Banner2 />
      <Banner3 />
      <Footer />
    </div>
  );
}
