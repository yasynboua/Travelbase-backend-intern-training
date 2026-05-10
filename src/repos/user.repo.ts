import { prisma } from "../lib/db";
import { UpdateProfileDTO } from "../interfaces";

class UserRepository {

    public static async findById(userId: string) {
        return prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                company: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    public static async updateProfile(input: UpdateProfileDTO) {
        const { userId, ...rest } = input;
        return prisma.users.update({
            where: { id: userId },
            data: { ...rest },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                company: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

}

export default UserRepository;