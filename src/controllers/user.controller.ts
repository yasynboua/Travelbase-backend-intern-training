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
    }

}

export const UserCtrl = UserController;