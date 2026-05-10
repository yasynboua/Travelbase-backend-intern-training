import {CustomErrorCode} from './error.code.js';
import {ErrorFaultType} from './global.error.js';

interface CustomErrorOptions {
    message: string;
    statusCode: number;
    errorCode: CustomErrorCode;
    fault?: ErrorFaultType;
    retryable?: boolean;
}

export class CustomError extends Error {
    statusCode: number;
    errorCode: CustomErrorCode;
    fault: ErrorFaultType;
    isOperational: boolean;
    retryable: boolean;
    data?: Record<string, unknown>;

    constructor({
                    message,
                    statusCode,
                    errorCode,
                    fault = ErrorFaultType.CLIENT,
                    retryable = false,
                }: CustomErrorOptions) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.fault = fault;
        this.isOperational = true;
        this.retryable = retryable;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg, statusCode: 400, errorCode});
        this.name = 'BadRequestError';
        this.errorCode = errorCode ?? CustomErrorCode.BAD_REQUEST;
    }
}

export class UnAuthorizedError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'UnAuthorized', statusCode: 401, errorCode});
        this.name = 'UnAuthorizedError';
        this.errorCode = errorCode ?? CustomErrorCode.ACCESS_DENIED;
    }
}

export class ForbiddenError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'Forbidden', statusCode: 403, errorCode});
        this.name = 'ForbiddenError';
        this.errorCode = errorCode ?? CustomErrorCode.ACTION_NOT_ALLOWED;
    }
}

export class ServiceUnavailableError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'Service Unavailable', statusCode: 503, errorCode});
        this.name = 'ServiceUnavailableError';
        this.fault = ErrorFaultType.SERVER;
        this.errorCode = errorCode;
    }
}

export class NotFoundError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'NotFoundError', statusCode: 404, errorCode});
        this.name = 'NotFoundError';
        this.errorCode = errorCode ?? CustomErrorCode.RESOURCE_NOT_FOUND;
    }
}

export class DuplicateResourceError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'DuplicateResourceError', statusCode: 409, errorCode});
        this.name = 'DuplicateResourceError';
        this.errorCode = errorCode ?? CustomErrorCode.DUPLICATE_RESOURCE;
    }
}

export class TenantAccessError extends CustomError {
    constructor({msg, errorCode}: { msg: string, errorCode: CustomErrorCode }) {
        super({message: msg || 'TenantAccessError', statusCode: 403, errorCode});
        this.name = 'TenantAccessError';
        this.errorCode = errorCode ?? CustomErrorCode.ACCESS_DENIED;
    }
}
