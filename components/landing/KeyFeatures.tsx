import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Group,
  ListCheck,
  LucideIcon,
  RefreshCw,
} from "lucide-react";

interface KeyFeature {
  icon: LucideIcon;
  header: string;
  content: string;
}

export default function KeyFeatures() {
  const keyFeatures: KeyFeature[] = [
    {
      icon: FileText,
      header: "Summarize any Job Posting",
      content:
        "Get concise summaries of job descriptions, saving you time and helping you quickly assess opportunities.",
    },
    {
      icon: ListCheck,
      header: "Track your Progress",
      content:
        "Visualize your application progress with a clear and simple dashboard, so you always know where you stand.",
    },
    {
      icon: Group,
      header: "Keep All your Resumes in One Place",
      content:
        "Store all your resumes within Huntly Ai, keeping everything organized and letting Huntly Ai find jobs tailored for each specific resume.",
    },
    {
      icon: RefreshCw,
      header: "Always in Sync",
      content:
        "Your data is automatically synced across all your devices, ensuring you're always up to date.",
    },
  ];
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-3">
      <h2 className="font-bold text-xl">Key Features</h2>
      <div
        className="md:flex-row md:justify-between
          flex flex-col gap-3"
      >
        {keyFeatures.map((keyFeature, index) => {
          const Icon = keyFeature.icon;
          return (
            <Card
              className="md:w-[24%]
            bg-[var(--background)] gap-3"
              key={index}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon />
                  <h1 className="font-bold text-lg text-[var(--app-blue)]">
                    {keyFeature.header}
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {keyFeature.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
