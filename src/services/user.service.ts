import {ChangePasswordDTO, IService} from '../interfaces';
import {UserRepository} from '../repositories';
import {verifyPassword, hashPassword} from '../helpers';
import {BadRequestError, UnAuthorizedError, NotFoundError, CustomErrorCode} from '../exceptions';

class UserService {

    static initialize() {
        new UserService();
    }

    public static async changePassword(userId: string, input: ChangePasswordDTO): Promise<IService> {
        const {currentPassword, newPassword} = input;

        // 1. Confirm the user exists
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new NotFoundError({
                msg: 'User not found',
                errorCode: CustomErrorCode.RESOURCE_NOT_FOUND,
            });
        }

        // 2. Fetch credentials separately
        const userAuth = await UserRepository.findAuthByUserId(userId);
        if (!userAuth) {
            throw new NotFoundError({
                msg: 'User credentials not found',
                errorCode: CustomErrorCode.RESOURCE_NOT_FOUND,
            });
        }

        // 3. Verify current password is correct
        const isMatch = await verifyPassword(currentPassword, userAuth.passwordHash);
        if (!isMatch) {
            throw new UnAuthorizedError({
                msg: 'Current password is incorrect',
                errorCode: CustomErrorCode.AUTH_INVALID,
            });
        }

        // 4. New password must differ from the current one
        const isSamePassword = await verifyPassword(newPassword, userAuth.passwordHash);
        if (isSamePassword) {
            throw new BadRequestError({
                msg: 'New password must be different from current password',
                errorCode: CustomErrorCode.INVALID_INPUT,
            });
        }

        // 5. Hash and persist new password
        const newPasswordHash = await hashPassword(newPassword);
        await UserRepository.updatePasswordHash(userId, newPasswordHash);

        return {
            success: true,
            message: 'Password changed successfully',
        };
    }

}

export default UserService;
