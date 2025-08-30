import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id, filePath } = await req.json();

    try{
        const supabase = createClient();
        const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([filePath]);

        if(storageError){
            console.error("Supabase delete error: ", storageError);
            return new Response("Failed to delete file from storage", { status: 500})
        }

        await prisma.resume.delete({
            where: { id }, 
        });

        return new Response("Resume deleted", { status: 200 });
    } catch(error){
        console.log("Delete route fauled:", error);
        return new Response("Server Error", { status: 500 })
    }
}