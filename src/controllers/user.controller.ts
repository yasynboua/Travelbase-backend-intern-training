import {FastifyReply, FastifyRequest} from 'fastify';
import {sendResponse} from '../helpers';
import {ChangePasswordRequest} from '../schemas';
import UserService from '../services/user.service';

class UserControllerClass {

    static initialize() {
        new UserControllerClass();
    }

    public static async changePassword(request: FastifyRequest, reply: FastifyReply) {
        const {currentPassword, newPassword} = ChangePasswordRequest.parse(request.body ?? {});

        const result = await UserService.changePassword(request.tokenPayload.userId, {
            currentPassword,
            newPassword,
            deviceId: <string>request.headers['x-device-id'],
        });

        return sendResponse(reply, result);
    }

}

export const UserController = UserControllerClass;
