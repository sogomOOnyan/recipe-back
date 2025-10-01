module.exports = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.code || 500;
    const message = err.message || "Something went wrong on the server."
    res.status(statusCode).json({
        message,
        code: statusCode,
        status: "error"
    })
}