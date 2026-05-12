import {prisma} from "../lib/db";
import {IService} from "../interfaces";
import {CustomErrorCode, NotFoundError} from "../exceptions";

class UserService {
    static initialize() {
        new UserService();
    }

    public static async getUserById(userId: string): Promise<IService> {
        const user = await prisma.users.findFirst({
            where: {id: userId}
        });

        if (!user) {
            throw new NotFoundError({msg: "User not found", errorCode: CustomErrorCode.RESOURCE_NOT_FOUND})
        }

        return {
            success: true,
            message: "User profile retrieved successfully",
            data: {
                user
            }
        }
    }

}

export default UserService;
