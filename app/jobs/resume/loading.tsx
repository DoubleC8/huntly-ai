import { LoaderCircle } from "lucide-react";

export default function loading() {
  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Resume</h1>
      </div>
      <div className="pageContainer !justify-center !items-center">
        <div className="flex flex-col gap-3 justify-center items-center">
          <LoaderCircle
            size={30}
            className="text-[var(--app-blue)] animate-spin"
          />
          <p>Loading Resumes</p>
        </div>
      </div>
    </div>
  );
}
