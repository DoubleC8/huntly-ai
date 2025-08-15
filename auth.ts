import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
        strategy: "jwt", 
    }, 
  providers: [GitHub], 

   //only neccesary if using ORM that will store information in a specific database
    //in our case we are using prisma

    //will handle all of the authentication and creation for us when a user signs in 
  adapter: PrismaAdapter(prisma),

  //ALWAYS SET UP CALLBACKS LIKE THIS
    //were enriching the token in the jwt callback so that we have more user info so we can use it later in the app
    //in the session we are just ensuring that the session returned to the client has the same id and same name from the
    //jwt token

  //this allows us to control what happens in our different stages of authentication 
    callbacks: {
        //this is function that runs once after a user signs in
        //when we run this we will have access about the users jwt
        //gives us access to users token and user info
        async jwt({token, user}) {
            //we're keeping track of a users token
            if(user) {
                token.id = user.id
                token.name = user.name
            }

            return token;
        }, 
        async session({session, token}) {
            if(session.user){ 
                session.user.id = token.id as string
                session.user.name = token.name as string
            }

            return session;
        }
    }
})