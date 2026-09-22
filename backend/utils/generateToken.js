import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "skillswap_jwt_super_secret_production_key_2026";
    return jwt.sign(
        {
            id: userId,
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

export default generateToken;