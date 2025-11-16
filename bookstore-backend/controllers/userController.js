// controllers/userController.js
import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import 'dotenv/config';
import { Op } from 'sequelize';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/auth.js';

// === REGISTER ===
const register = async (req, res) => {
    const { name, email, password, address, phone, role } = req.body;
    try {
        const user = await User.create({ name, email, password, address, phone, role });
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.success({
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar
            },
            token
        }, 'Đăng ký thành công');
    } catch (err) {
        res.error(err.message || 'Email đã tồn tại', 400);
    }
};

// === LOGIN ===
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validPassword(password))) {
            return res.error('Email hoặc mật khẩu không đúng', 401);
        }

        const accessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: Math.floor(ACCESS_TOKEN_TTL / 1000) }
        );

        const refreshToken = Crypto.randomBytes(64).toString('hex');

        await Session.create({
            user_id: user.user_id,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        });

        res.success({
            accessToken,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar
            }
        }, 'Đăng nhập thành công');
    } catch (err) {
        console.error('Login error:', err);
        res.error('Lỗi server', 500);
    }
};

// === GET ALL USERS (ADMIN ONLY) ===
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'name', 'email', 'role', 'phone', 'address', 'avatar']
        });
        res.success(users, 'Lấy danh sách người dùng thành công');
    } catch (err) {
        res.error('Lỗi server', 500);
    }
};

// === LOGOUT ===
const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await Session.destroy({ where: { refresh_token: refreshToken } });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
        }
        res.success(null, 'Đăng xuất thành công', 204);
    } catch (err) {
        res.error('Lỗi hệ thống', 500);
    }
};

// === REFRESH TOKEN ===
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.error('Không tìm thấy refresh token', 401);

        const session = await Session.findOne({
            where: {
                refresh_token: refreshToken,
                expires_at: { [Op.gt]: new Date() }
            }
        });

        if (!session) return res.error('Refresh token không hợp lệ hoặc đã hết hạn', 403);

        const user = await User.findByPk(session.user_id);
        if (!user) return res.error('Người dùng không tồn tại', 404);

        const accessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: Math.floor(ACCESS_TOKEN_TTL / 1000) }
        );

        res.success({ accessToken, expiresIn: ACCESS_TOKEN_TTL / 1000 });
    } catch (err) {
        res.error('Lỗi hệ thống', 500);
    }
};

export default { register, login, getUsers, signOut, refreshToken };