// app/api/resume/update/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request){
    const session = await auth();
    if(!session) return new Response("Unauthorized", { status: 401 });


    const { resumeUrl } = await req.json();

    await prisma.user.update({
       where: { email: session?.user?.email! }, 
       data: { resumeUrl }
    });

    return new Response("Resume URL updated", { status: 200 })
}
