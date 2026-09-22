const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(
            (error) => error.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }

    // Duplicate MongoDB key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

export default errorMiddleware;