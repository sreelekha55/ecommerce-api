// middleware/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    res.json({
        message: err.message,
        // Show stack trace only in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorMiddleware;
