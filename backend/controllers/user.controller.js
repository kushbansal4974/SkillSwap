import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const formatUserResponse = (user) => ({
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
    bio: user.bio || (user.role === 'creator' ? 'Professional creator offering high-quality gig services.' : 'Client looking for talented creators.'),
    skills: user.skills || [],
    location: user.location || 'India',
    createdAt: user.createdAt,
});

// =========================
// REGISTER USER
// =========================
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role, bio, skills, avatar, location } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        // Validate role
        if (role && !["creator", "client"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either creator or client",
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "client",
            bio: bio || "",
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : []),
            avatar: avatar || "",
            location: location || "India",
        });

        // Generate token
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: formatUserResponse(user),
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// LOGIN USER
// =========================
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Password is select:false, so explicitly select it
        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: formatUserResponse(user),
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// GET CURRENT USER
// =========================
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: formatUserResponse(user),
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// LOGOUT USER
// =========================
export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// UPDATE PROFILE
// =========================
export const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, skills, avatar, location, role, currentPassword, newPassword } = req.body;
        const updates = {};

        if (name !== undefined) {
            const trimmedName = name.trim();
            if (trimmedName.length < 2 || trimmedName.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 2 and 50 characters",
                });
            }
            updates.name = trimmedName;
        }

        if (bio !== undefined) updates.bio = bio.trim();
        if (location !== undefined) updates.location = location.trim();
        if (avatar !== undefined) updates.avatar = avatar.trim();
        
        if (role !== undefined && ["creator", "client"].includes(role)) {
            updates.role = role;
        }

        if (skills !== undefined) {
            updates.skills = Array.isArray(skills) 
                ? skills 
                : skills.split(",").map(s => s.trim()).filter(Boolean);
        }

        if (currentPassword && newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters",
                });
            }

            const existingUserWithPass = await User.findById(req.user.id).select("+password");
            if (!existingUserWithPass) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, existingUserWithPass.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Current password does not match",
                });
            }

            updates.password = await bcrypt.hash(newPassword, 12);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: formatUserResponse(user),
            },
        });

    } catch (error) {
        next(error);
    }
};