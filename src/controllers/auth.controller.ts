import authService from "../services/auth.service";
import AuthService from "../services/auth.service";
import {FastifyReply, FastifyRequest} from "fastify";
import {sendResponse} from "../helpers";
import {LoginRequest, SignupRequest} from "../schemas";

class AuthController {
    constructor() {
        authService.initialize();
    }

    static initialize() {
        new AuthController();
    }

    public static async signup(request: FastifyRequest, reply: FastifyReply) {
        const body = SignupRequest.parse(request.body ?? {});
        const result = await AuthService.signup({
            ...body,
            deviceId: <string>request.headers['x-device-id'],
        });
        return sendResponse(reply, result, 201);
    }

    public static async login(request: FastifyRequest, reply: FastifyReply) {
        const {email, password} = LoginRequest.parse(request.body ?? {});
        const result = await AuthService.login({
            deviceId: <string>request.headers['x-device-id'],
            email,
            password,
        });
        return sendResponse(reply, result);
    }
}

export const AuthenticationController = AuthController;