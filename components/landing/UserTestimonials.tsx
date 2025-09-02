import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

interface Testimony {
  userImage: string;
  userName: string;
  userOccupation: string;
  content: string;
}

const userTestimonials: Testimony[] = [
  {
    userImage: "/user1.jpg",
    userName: "Chimney Crooks",
    userOccupation: "Software Engineer, SF",
    content:
      "Huntly AI completely transformed how I track my job applications. The dashboard is clean, and the resume upload feature is seamless.",
  },
  {
    userImage: "/user2.jpg",
    userName: "Gerbert Rodriguez",
    userOccupation: "Product Designer, NY",
    content:
      "The ability to tailor resumes and track interviews in one place saved me hours. Highly recommend this for any job seeker.",
  },
  {
    userImage: "/user3.jpg",
    userName: "Connor",
    userOccupation: "Data Analyst, TX",
    content:
      "Huntly AI gave me clarity and momentum in my job hunt. The visual tracker and AI summaries helped me stay focused and informed.",
  },
];

export default function UserTestimonials() {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-3">
      <div
        className="md:flex-row md:justify-between
          flex flex-col gap-3"
      >
        {userTestimonials.map((testimony, index) => (
          <Card className="md:w-[32%] bg-[var(--background)] gap-1" key={index}>
            <CardHeader className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={testimony.userImage}
                  alt="User profile"
                  fill
                  className="object-cover"
                />
              </div>
              <CardTitle className="text-sm font-semibold flex flex-col">
                <p>{testimony.userName}</p>
                <p className="text-muted-foreground">
                  {testimony.userOccupation}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                “{testimony.content}”
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
