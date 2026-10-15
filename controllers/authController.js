const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = [];

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            role: "user"
        };

        users.push(user);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const setupKey = process.env.ADMIN_SETUP_KEY;
        console.log("Setup key loaded:", Boolean(setupKey));
        console.log("Setup key length:", setupKey?.length ?? 0);
        console.log("Header received:", Boolean(req.headers["x-admin-setup-key"]));

        if (!setupKey || req.headers["x-admin-setup-key"] !== setupKey) {
            return res.status(403).json({
                success: false,
                message: "Admin setup not authorized"
            });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (typeof email !== "string" ||
            typeof name !== "string" ||
            typeof password !== "string" ||
            password.length < 12 ||
            password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Use valid details and a password of 12–72 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin"
        };

        users.push(user);

        return res.status(201).json({
            success: true,
            message: "Admin account created",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Admin registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create admin account"
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    registerAdmin
};