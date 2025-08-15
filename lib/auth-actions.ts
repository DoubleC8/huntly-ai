import { signIn, signOut } from "@/auth"

export const login = async () => {
    await signIn("github", {redirectTo: "jobs/dashboard"})
}

export const logout = async () => {
    await signOut();
}