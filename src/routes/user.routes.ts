import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {UserController} from '../controllers';
import {requireAuth} from '../middleware/auth.middleware';

UserController.initialize();

export async function UserRouter(app: FastifyInstance) {
    app.patch(
        '/v1/user/change-password',
        {preHandler: requireAuth},
        async (request: FastifyRequest, reply: FastifyReply) => UserController.changePassword(request, reply)
    );
}
