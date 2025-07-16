export function sendSuccess({ res, message, data = null, status = 200 }) {
    res.status(status).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
}

export function sendError({ res, message, errors = null, status = 400 }) {
    res.status(status).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
}
