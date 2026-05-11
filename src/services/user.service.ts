import { IService } from "../interfaces";
import { UpdateProfileDTO } from "../interfaces";
import { BadRequestError, CustomErrorCode } from "../exceptions";
import UserRepository from "../repos/user.repo";

class UserService {

    static initialize() {
        new UserService();
    }

    public static async getProfile(userId: string): Promise<IService> {

        // 1. Find the user by id
        const user = await UserRepository.findById(userId);

        // 2. If not found, throw error
        if (!user) {
            throw new BadRequestError({
                msg: "User not found",
                errorCode: CustomErrorCode.RESOURCE_NOT_FOUND
            });
        }

        // 3. Return the user
        return {
            success: true,
            message: "Profile fetched successfully",
            data: { user }
        };
    }

    public static async updateProfile(input: UpdateProfileDTO): Promise<IService> {

        // 1. Check the user exists first
        const existingUser = await UserRepository.findById(input.userId);

        // 2. If not found, throw error
        if (!existingUser) {
            throw new BadRequestError({
                msg: "User not found",
                errorCode: CustomErrorCode.RESOURCE_NOT_FOUND
            });
        }

        // 3. Update the profile
        const updatedUser = await UserRepository.updateProfile(input);

        // 4. Return the updated user
        return {
            success: true,
            message: "Profile updated successfully",
            data: { user: updatedUser }
        };
    }

}

export default UserService;