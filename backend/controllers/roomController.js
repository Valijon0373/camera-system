import { getDb } from '../db.js';

export async function getRooms(req, res) {
  try {
    const db = await getDb();
    const rooms = await db.all('SELECT * FROM rooms ORDER BY id ASC');
    return res.json({ success: true, data: rooms });
  } catch (error) {
    console.error('getRooms error:', error);
    return res.status(500).json({ success: false, message: 'Xonalarni olishda xatolik' });
  }
}

export async function createRoom(req, res) {
  try {
    const { number, name, description } = req.body;
    if (!number || !name) {
      return res.status(400).json({ success: false, message: 'Xona raqami va nomini kiriting' });
    }

    const db = await getDb();
    const id = Date.now().toString();
    const now = new Date().toISOString().split('T')[0];
    const roomDesc = description ? description.trim() : 'Xona tavsifi';

    await db.run(
      'INSERT INTO rooms (id, number, name, description, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, number.trim(), name.trim(), roomDesc, now]
    );

    const newRoom = { id, number: number.trim(), name: name.trim(), description: roomDesc, createdAt: now };
    return res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    console.error('createRoom error:', error);
    return res.status(500).json({ success: false, message: 'Xona yaratishda xatolik' });
  }
}

export async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const { number, name, description } = req.body;

    const db = await getDb();
    const existing = await db.get('SELECT * FROM rooms WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Xona topilmadi' });
    }

    const updatedNumber = number !== undefined ? number.trim() : existing.number;
    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;

    await db.run(
      'UPDATE rooms SET number = ?, name = ?, description = ? WHERE id = ?',
      [updatedNumber, updatedName, updatedDesc, id]
    );

    const updatedRoom = { ...existing, number: updatedNumber, name: updatedName, description: updatedDesc };
    return res.json({ success: true, data: updatedRoom });
  } catch (error) {
    console.error('updateRoom error:', error);
    return res.status(500).json({ success: false, message: 'Xonani yangilashda xatolik' });
  }
}

export async function deleteRoom(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM rooms WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Xona topilmadi' });
    }

    await db.run('DELETE FROM rooms WHERE id = ?', [id]);
    // Reset roomId on cameras assigned to this room
    await db.run('UPDATE cameras SET roomId = "" WHERE roomId = ?', [id]);

    return res.json({ success: true, message: 'Xona o\'chirildi', room: existing });
  } catch (error) {
    console.error('deleteRoom error:', error);
    return res.status(500).json({ success: false, message: 'Xonani o\'chirishda xatolik' });
  }
}
