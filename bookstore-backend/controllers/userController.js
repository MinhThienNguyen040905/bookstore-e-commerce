import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Crypto from 'crypto';
import Session from '../models/Session.js';
import { Op } from 'sequelize';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/auth.js';


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

        const accessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: Math.floor(ACCESS_TOKEN_TTL / 1000) }
        );

        // ← DÒNG NÀY BÂY GIỜ HOẠT ĐỘNG
        const refreshToken = Crypto.randomBytes(64).toString('hex');

        await Session.create({
            user_id: user.user_id,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        });

        res.json({
            msg: 'Login successful',
            accessToken,
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
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

// === LOGOUT: XÓA REFRESH TOKEN ===
export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // Xóa session trong DB (dùng Sequelize)
            await Session.destroy({
                where: { refresh_token: refreshToken }
            });

            // Xóa cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
        }

        return res.status(204).send(); // No Content
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        return res.status(500).json({ msg: 'Lỗi hệ thống' });
    }
};

// === REFRESH TOKEN: CẤP LẠI ACCESS TOKEN ===
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: 'Không tìm thấy refresh token' });
        }

        // Tìm session còn hiệu lực
        const session = await Session.findOne({
            where: {
                refresh_token: refreshToken,
                expires_at: { [Op.gt]: new Date() } // Chưa hết hạn
            }
        });

        if (!session) {
            return res.status(403).json({ msg: 'Refresh token không hợp lệ hoặc đã hết hạn' });
        }

        // Lấy user từ session
        const user = await User.findByPk(session.user_id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Tạo access token mới
        const accessToken = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: Math.floor(ACCESS_TOKEN_TTL / 1000) } // giây
        );

        return res.status(200).json({
            accessToken,
            expiresIn: ACCESS_TOKEN_TTL / 1000 // giây
        });
    } catch (error) {
        console.error('Lỗi khi refresh token:', error);
        return res.status(500).json({ msg: 'Lỗi hệ thống' });
    }
};

export default { register, login, getUsers, signOut, refreshToken };