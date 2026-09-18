import { getDb } from '../db.js';

export async function getLogs(req, res) {
  try {
    const db = await getDb();
    const logs = await db.all('SELECT * FROM logs ORDER BY id DESC LIMIT 100');
    return res.json({ success: true, data: logs });
  } catch (error) {
    console.error('getLogs error:', error);
    return res.status(500).json({ success: false, message: 'Loglarni olishda xatolik' });
  }
}

export async function createLog(req, res) {
  try {
    const { type, message, user } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Log xabari ko\'rsatilmadi' });
    }

    const db = await getDb();
    const id = Date.now().toString();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const timestamp = `${dateStr} ${timeStr}`;
    const logUser = user || 'System';
    const logType = type || 'system';

    await db.run(
      'INSERT INTO logs (id, timestamp, date, time, type, message, user, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, timestamp, dateStr, timeStr, logType, message, logUser, dateStr]
    );

    const newLog = {
      id,
      timestamp,
      date: dateStr,
      time: timeStr,
      type: logType,
      message,
      user: logUser,
      createdAt: dateStr
    };

    return res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    console.error('createLog error:', error);
    return res.status(500).json({ success: false, message: 'Log yaratishda xatolik' });
  }
}

export async function clearLogs(req, res) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM logs');
    return res.json({ success: true, message: 'Barcha loglar tozalandi' });
  } catch (error) {
    console.error('clearLogs error:', error);
    return res.status(500).json({ success: false, message: 'Loglarni tozalashda xatolik' });
  }
}
