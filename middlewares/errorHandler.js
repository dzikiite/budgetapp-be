export const errorHandler = (err, req, res, next) => {
    res.status(err.status || 400).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || [],
    });
};
