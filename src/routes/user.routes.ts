import {FastifyInstance, FastifyReply, FastifyRequest,} from "fastify";
import {UserCtrl} from "../controllers";

UserCtrl.initialize();

export async function UserRouter(app: FastifyInstance) {
    app.post("/v1/users/me", async (request: FastifyRequest, reply: FastifyReply) => UserCtrl.getUserProfile(request, reply));
}