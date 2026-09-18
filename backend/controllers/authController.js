import { getDb } from '../db.js';

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username va parol kiritilishi shart' });
    }

    const db = await getDb();
    const user = await db.get(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?',
      [username.trim(), password]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Login yoki parol noto\'g\'ri!' });
    }

    const formattedUser = {
      ...user,
      allowedCameras: user.allowedCameras ? JSON.parse(user.allowedCameras) : []
    };

    return res.json({
      success: true,
      message: 'Muvaffaqiyatli tizimga kirildi',
      user: formattedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server xatoligi' });
  }
}
