export const requestLogger = (req, res, next) => {
    console.log(`Resource requested: ${req.method} ${req.originalUrl}`);
    next();
};
