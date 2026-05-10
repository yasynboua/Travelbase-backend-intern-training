export interface UpdateProfileDTO {
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    company?: string;
    bio?: string;
}