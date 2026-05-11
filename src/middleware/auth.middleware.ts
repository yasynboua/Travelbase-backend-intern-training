import {FastifyReply, FastifyRequest} from 'fastify';
import {verifyToken, TOKEN_TYPE, TokenPayload} from '../helpers';
import {UnAuthorizedError} from '../exceptions';
import {CustomErrorCode} from '../exceptions';

declare module 'fastify' {
    interface FastifyRequest {
        tokenPayload: TokenPayload;
    }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnAuthorizedError({
            msg: 'Missing or malformed authorization header',
            errorCode: CustomErrorCode.AUTH_MISSING,
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);

        if (payload.tokenType !== TOKEN_TYPE.AUTH_TOKEN) {
            throw new UnAuthorizedError({
                msg: 'Invalid token type',
                errorCode: CustomErrorCode.AUTH_INVALID,
            });
        }

        request.tokenPayload = payload;
    } catch {
        throw new UnAuthorizedError({
            msg: 'Invalid or expired token',
            errorCode: CustomErrorCode.AUTH_EXPIRED,
        });
    }
}
