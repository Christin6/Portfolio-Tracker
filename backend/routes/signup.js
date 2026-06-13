const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signupRouter = require("express").Router();
const User = require("../models/user");

signupRouter.post('/', async (request, response) => {
    try {
        const { username, name, password } = request.body;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({
                error: "Password must be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.",
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            name,
            passwordHash,
        });

        const savedUser = await user.save();

        response.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000) {
            return response.status(409).json({ error: "Username already taken" });
        }
        response.status(500).json({ error: err.message });
    }
});

module.exports = signupRouter;
