import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../helpers";
import { UpdateProfileRequest } from "../schemas";
import UserService from "../services/user.service";

class UserController {

    static initialize() {
        new UserController();
    }

    public static async getProfile(request: FastifyRequest, reply: FastifyReply) {
        // userId comes from the authenticated JWT token
        const userId = <string>request.headers['x-user-id'];

        const result = await UserService.getProfile(userId);
        return sendResponse(reply, result);
    }

    public static async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        // 1. Validate the request body
        const body = UpdateProfileRequest.parse(request.body ?? {});

        // 2. userId comes from the authenticated JWT token
        const userId = <string>request.headers['x-user-id'];

        // 3. Call the service
        const result = await UserService.updateProfile({
            userId,
            ...body
        });

        return sendResponse(reply, result);
    }

}

export {UserController}