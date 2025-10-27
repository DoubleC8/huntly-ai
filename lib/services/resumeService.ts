import { deleteUserResume } from "@/app/actions/resume/delete/deleteUserResume";
import { makeResumeDefault, updateUserResume, updateUserResumeJobTitle } from "@/app/actions/resume/update/updateUserResume";


export const resumeService = {
    async updateResume(resumeUrl: string, fileName: string){
        return await updateUserResume({ resumeUrl, filename: fileName });
    }, 
    async toggleDefault(resumeId: string){
        return await makeResumeDefault(resumeId);
    },
    async updateResumeJobTitle(
        targetJobTitle: string, 
        resumeId: string,){
        return await updateUserResumeJobTitle({ targetJobTitle, resumeId });
    }, 
    async deleteResume(resumeId: string, filePath: string){
        return await deleteUserResume(resumeId, filePath);
    }
}