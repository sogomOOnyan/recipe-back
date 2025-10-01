module.exports = (message = "Error occurred", status = 500) => {
    const error = new Error(message);
    error.status = status;
    throw error
}