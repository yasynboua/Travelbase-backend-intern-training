import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserController } from "../controllers";

UserController.initialize();

export async function UserRouter(app: FastifyInstance) {
    
    app.get("/v1/users/profile", async (request: FastifyRequest, reply: FastifyReply) => UserController.getProfile(request, reply));

    app.patch("/v1/users/profile", async (request: FastifyRequest, reply: FastifyReply) => UserController.updateProfile(request, reply));

}