import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Register
const register = async (req, res) => {
    const { name, email, password, address, phone, role } = req.body;
    try {
        const user = await User.create({ name, email, password, address, phone, role });
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validPassword(password))) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export default { register, login, getUsers };