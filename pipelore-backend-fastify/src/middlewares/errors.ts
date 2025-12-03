export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Helper functions to create common errors
export const notFound = (message = 'Resource not found') => {
    return new AppError(message, 404);
};

export const badRequest = (message = 'Bad request') => {
    return new AppError(message, 400);
};

export const serverError = (message = 'Internal server error') => {
    return new AppError(message, 500, false);
};