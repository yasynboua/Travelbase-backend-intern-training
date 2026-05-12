<<<<<<< HEAD
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
=======
import {FastifyReply, FastifyRequest} from "fastify";
import UserService from "../services/user.service";
import {sendResponse} from "../helpers";

UserService.initialize();

class UserController {
    static initialize() {
        new UserController();
    }

    public static async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
        const userId = <string>request.user?.id;
        const response = await UserService.getUserById(userId);
        return sendResponse(reply, response);
>>>>>>> upstream/master
    }

}

<<<<<<< HEAD
export const UserController = UserControllerClass;
=======
export const UserCtrl = UserController;
>>>>>>> upstream/master
