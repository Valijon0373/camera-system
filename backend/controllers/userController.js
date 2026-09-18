import { getDb } from '../db.js';

export async function getUsers(req, res) {
  try {
    const db = await getDb();
    const users = await db.all('SELECT * FROM users ORDER BY createdAt DESC');
    const formatted = users.map(u => ({
      ...u,
      allowedCameras: u.allowedCameras ? JSON.parse(u.allowedCameras) : []
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Foydalanuvchilarni olishda xatolik' });
  }
}

export async function createUser(req, res) {
  try {
    const { fullName, username, password, role, allowedCameras } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Barcha maydonlarni to\'ldiring' });
    }

    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [username.trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Ushbu nomdagi foydalanuvchi mavjud!' });
    }

    const id = Date.now().toString();
    const now = new Date().toISOString().split('T')[0];
    const userRole = role || 'operator';
    
    // Fetch all cameras if role is admin or fallback
    let finalAllowed = allowedCameras;
    if (!finalAllowed || !Array.isArray(finalAllowed) || finalAllowed.length === 0) {
      if (userRole === 'admin') {
        finalAllowed = ['all'];
      } else {
        const cams = await db.all('SELECT id FROM cameras');
        finalAllowed = cams.map(c => c.id);
      }
    }

    const allowedJson = JSON.stringify(finalAllowed);
    const userFullName = fullName && fullName.trim() ? fullName.trim() : username.trim();

    await db.run(
      'INSERT INTO users (id, fullName, username, password, role, allowedCameras, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userFullName, username.trim(), password.trim(), userRole, allowedJson, now]
    );

    const newUser = {
      id,
      fullName: userFullName,
      username: username.trim(),
      password: password.trim(),
      role: userRole,
      allowedCameras: finalAllowed,
      createdAt: now
    };

    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('createUser error:', error);
    return res.status(500).json({ success: false, message: 'Foydalanuvchi yaratishda xatolik' });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { fullName, username, password, role, allowedCameras } = req.body;

    const db = await getDb();
    const existing = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    const updatedFullName = fullName !== undefined ? fullName : existing.fullName;
    const updatedUsername = username !== undefined ? username.trim() : existing.username;
    const updatedPassword = password !== undefined ? password : existing.password;
    const updatedRole = role !== undefined ? role : existing.role;
    const updatedAllowed = allowedCameras !== undefined ? JSON.stringify(allowedCameras) : existing.allowedCameras;

    await db.run(
      'UPDATE users SET fullName = ?, username = ?, password = ?, role = ?, allowedCameras = ? WHERE id = ?',
      [updatedFullName, updatedUsername, updatedPassword, updatedRole, updatedAllowed, id]
    );

    const updatedUser = {
      id,
      fullName: updatedFullName,
      username: updatedUsername,
      password: updatedPassword,
      role: updatedRole,
      allowedCameras: typeof updatedAllowed === 'string' ? JSON.parse(updatedAllowed) : updatedAllowed,
      createdAt: existing.createdAt
    };

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('updateUser error:', error);
    return res.status(500).json({ success: false, message: 'Foydalanuvchini yangilashda xatolik' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    if (user.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Asosiy admin hisobini o\'chirish mumkin emas!' });
    }

    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Foydalanuvchi o\'chirildi' });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({ success: false, message: 'Foydalanuvchini o\'chirishda xatolik' });
  }
}
