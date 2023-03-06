import loadingGif from "../assets/loading_running.gif";
import Features from "../components/homePage/Features";
import Footer from "../components/homePage/Footer";
import Hero from "../components/homePage/Hero";
import Team from "../components/homePage/Team";

// Using components from: https://tailblocks.cc/

const HomePage = () => {
    return (
        <>
        <Hero />
        <Features />
        <Team />
        <Footer />
        </>
    )
};

export default HomePage;
