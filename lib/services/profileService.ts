import { DeleteUserField, FieldType } from "@/app/actions/profile/delete/deleteUserProfileEntry";
import { UpdateUserEducation, UpdateUserField, UpdateUserPersonalInfo } from "@/app/actions/profile/update/updateUserInfo";

export const profileService = {
    async updateFields(field: FieldType, value?: string | string[]){
        return await UpdateUserField(field, value);
    },

    async updatePersonalInfo(values: {
        githubUrl?: string;
        linkedInUrl?: string;
        portfolioUrl?: string;
        phoneNumber?: string;
        city?: string;
    }){
        return await UpdateUserPersonalInfo(values);
    }, 

    async updateEducation(values: {
        school: string;
        degree: string;
        id?: string;
        major?: string;
        gpa?: string;
        startDate?: Date;
        endDate?: Date;
        onGoing?: boolean;
    }){
        return await UpdateUserEducation(values);
    }, 

    async deleteField(field: FieldType, value?: string){
        return await DeleteUserField(field, value);
    }
}