"use client";

import { FieldType } from "@/app/actions/profile/delete/deleteUserProfileEntry";
import { profileService } from "@/lib/services/profileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateProfilePayload = 
  | { type: "updateFields"; field: FieldType, value?: string | string[] }
  | { type: "updatePersonalInfo"; 
    githubUrl?: string, 
    linkedInUrl?: string, 
    portfolioUrl?: string, 
    phoneNumber?: string, 
    city?: string }
  | { type: "updateEducation"; 
    school: string, 
    degree: string, 
    id?: string, 
    major?: string, 
    gpa?: string, 
    startDate?: Date, 
    endDate?: Date, 
    onGoing?: boolean}
  | { type: "deleteField";  field: FieldType, value?: string };

export function useProfileMutations(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(payload: UpdateProfilePayload) => {
            switch(payload.type){
                case "updateFields":
                    return profileService.updateFields(payload.field, payload.value);
                case "updatePersonalInfo":
                    return profileService.updatePersonalInfo({
                        githubUrl: payload.githubUrl,
                        linkedInUrl: payload.linkedInUrl,
                        portfolioUrl: payload.portfolioUrl,
                        phoneNumber: payload.phoneNumber,
                        city: payload.city,
                    });
                case "updateEducation":
                    return profileService.updateEducation({
                        school: payload.school,
                        degree: payload.degree,
                        id: payload.id,
                        major: payload.major,
                        gpa: payload.gpa,
                        startDate: payload.startDate,
                        endDate: payload.endDate,
                        onGoing: payload.onGoing,
                    });
                case "deleteField":
                    return profileService.deleteField(payload.field, payload.value);
                default:
                    throw new Error(`Unknown profile update type: ${(payload as UpdateProfilePayload).type}`);
            }
        }, 

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["profileJobs"] });
        }, 

        onError: (err) => {
            console.error("Profile mutation failed:", err);
        },
    })
}