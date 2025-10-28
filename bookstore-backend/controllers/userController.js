import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
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
        // 1. Tìm user theo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // 2. Kiểm tra mật khẩu
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // 3. Tạo access token (JWT)
        const accessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: Math.floor(ACCESS_TOKEN_TTL / 1000) } // chuyển ms sang giây
        );

        // 4. Tạo refresh token (ngẫu nhiên, không phải JWT)
        const refreshToken = Crypto.randomBytes(64).toString('hex');

        // 5. Lưu session vào DB
        await Session.create({
            user_id: user.user_id,     // Sửa: user_id (không phải userId)
            refresh_token: refreshToken, // Sửa: refresh_token
            expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // 6. Gửi refresh token qua cookie (httpOnly, secure)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,     // Chỉ server đọc được
            secure: true,       // Chỉ gửi qua HTTPS
            sameSite: 'none',   // Cho phép cross-site (frontend/backend khác domain)
            maxAge: REFRESH_TOKEN_TTL,
        });

        // 7. Trả về access token + thông tin user
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