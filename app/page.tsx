import { auth } from "@/auth";
import HomeNavbar from "@/components/Navbar/HomeNavbar";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <HomeNavbar session={session} />
      <main className="w-full h-screen flex flex-col bg-gradient-to-tr from-[#ffffff] from-60% to-[#12ABCD]">
        <div className="container w-3/4 h-3/4 flex flex-col gap-5 text-center my-auto mx-auto">
          <h1 className="text-lg font-semibold">
            Land your next job with AI precision. <br />{" "}
            <span className="text-4xl font-extrabold text-[#120ACD]">
              DO IT WITH HUNTLY AI.
            </span>
          </h1>
          <h2 className="font-semibold">
            Huntly AI scans, summarizes, and tracks job listings, so you can
            focus on applying, not organizing.
          </h2>

          <Button className="bg-[var(--ring)] font-extrabold text-lg w-3/4 mx-auto ">
            Try Huntly Ai for Free
          </Button>
        </div>
      </main>
    </>
  );
}
