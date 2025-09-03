import HomeNavbar from "@/components/Navbar/HomeNavbar";
import KeyFeatures from "@/components/landing/KeyFeatures";
import LoginButton from "@/components/Navbar/LoginButton";
import ImageCarousel from "@/components/landing/ImageCarousel";
import Footer from "@/components/landing/Footer";
import UserTestimonials from "@/components/landing/UserTestimonials";

export default async function Home() {
  return (
    <div className="page">
      <HomeNavbar />
      <div className="pageContainer !gap-5">
        {/**header */}
        <div className="flex flex-col gap-5 text-center">
          <h1
            className="md:text-6xl
          text-[var(--app-blue)] font-extrabold text-3xl"
          >
            All Your Applications.
            <br />
            One Smart Dashboard.
          </h1>
          <p className="text-muted-foreground">
            Huntly Ai imports, summarizes, and organizes job postings into a
            clear pipeline, so you can focus on getting hired.
          </p>
          {/**Login 'Get Started for Free' button */}
          <LoginButton isButton={true} />
        </div>
        <ImageCarousel />
        <KeyFeatures />
      </div>
      <div className="pageContainer !bg-[var(--background)] !gap-5 !min-h-fit md:!py-20">
        <div className="flex flex-col gap-1 text-center">
          <h1
            className="md:text-4xl
          text-[var(--app-blue)] font-extrabold text-xl"
          >
            What Our Users Say
          </h1>
          <p className="text-muted-foreground">
            See what others are saying about Huntly Ai.
          </p>
        </div>
        <UserTestimonials />
      </div>
      <Footer />
    </div>
  );
}
