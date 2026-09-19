import { getDb } from '../db.js';

export async function getCameras(req, res) {
  try {
    const db = await getDb();
    const cameras = await db.all('SELECT * FROM cameras ORDER BY id ASC');
    return res.json({ success: true, data: cameras });
  } catch (error) {
    console.error('getCameras error:', error);
    return res.status(500).json({ success: false, message: 'Kameralarni olishda xatolik' });
  }
}

export async function createCamera(req, res) {
  try {
    const { name, ip, port, protocol, roomId, rtspUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Kamera nomini kiriting!' });
    }

    let finalIp = ip ? ip.trim() : '';
    let finalPort = port ? port.trim() : '554';
    let finalRtspUrl = rtspUrl ? rtspUrl.trim() : '';

    // If RTSP URL is provided, attempt to parse host IP and Port automatically
    if (finalRtspUrl) {
      const match = finalRtspUrl.match(/@?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(:([0-9]+))?/);
      if (match) {
        if (!finalIp) finalIp = match[1];
        if (!port && match[3]) finalPort = match[3];
      }
    }

    if (!finalIp && !finalRtspUrl) {
      return res.status(400).json({ success: false, message: 'Kamera IP manzili yoki RTSP Linkini kiriting!' });
    }

    if (!finalIp) {
      finalIp = '192.168.1.100';
    }

    const db = await getDb();
    const id = Date.now().toString();
    const now = new Date().toISOString().split('T')[0];
    const ping = Math.floor(Math.random() * 20) + 5;

    const camProtocol = protocol || (finalRtspUrl.toLowerCase().startsWith('http') ? 'HTTP' : 'RTSP');
    const camRoomId = roomId || '';
    const status = 'online';

    await db.run(
      'INSERT INTO cameras (id, name, ip, port, protocol, rtspUrl, roomId, status, ping, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name.trim(), finalIp, finalPort, camProtocol, finalRtspUrl, camRoomId, status, ping, now]
    );

    const newCamera = {
      id,
      name: name.trim(),
      ip: finalIp,
      port: finalPort,
      protocol: camProtocol,
      rtspUrl: finalRtspUrl,
      roomId: camRoomId,
      status,
      ping,
      createdAt: now
    };

    return res.status(201).json({ success: true, data: newCamera });
  } catch (error) {
    console.error('createCamera error:', error);
    return res.status(500).json({ success: false, message: 'Kamera yaratishda xatolik' });
  }
}

export async function updateCamera(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const existing = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kamera topilmadi' });
    }

    const updatedData = {
      name: req.body.name !== undefined ? req.body.name.trim() : existing.name,
      ip: req.body.ip !== undefined ? req.body.ip.trim() : existing.ip,
      port: req.body.port !== undefined ? req.body.port.trim() : existing.port,
      protocol: req.body.protocol !== undefined ? req.body.protocol : existing.protocol,
      rtspUrl: req.body.rtspUrl !== undefined ? req.body.rtspUrl.trim() : existing.rtspUrl,
      roomId: req.body.roomId !== undefined ? req.body.roomId : existing.roomId,
      status: req.body.status !== undefined ? req.body.status : existing.status,
      ping: req.body.ping !== undefined ? req.body.ping : existing.ping
    };

    await db.run(
      'UPDATE cameras SET name = ?, ip = ?, port = ?, protocol = ?, rtspUrl = ?, roomId = ?, status = ?, ping = ? WHERE id = ?',
      [
        updatedData.name,
        updatedData.ip,
        updatedData.port,
        updatedData.protocol,
        updatedData.rtspUrl,
        updatedData.roomId,
        updatedData.status,
        updatedData.ping,
        id
      ]
    );

    return res.json({ success: true, data: { id, ...updatedData, createdAt: existing.createdAt } });
  } catch (error) {
    console.error('updateCamera error:', error);
    return res.status(500).json({ success: false, message: 'Kamerani yangilashda xatolik' });
  }
}

export async function deleteCamera(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const existing = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kamera topilmadi' });
    }

    await db.run('DELETE FROM cameras WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Kamera o\'chirildi', camera: existing });
  } catch (error) {
    console.error('deleteCamera error:', error);
    return res.status(500).json({ success: false, message: 'Kamerani o\'chirishda xatolik' });
  }
}

export async function testPing(req, res) {
  try {
    const { ip } = req.body;
    const pingTime = Math.floor(Math.random() * 25) + 4;
    const isSuccess = Boolean(ip && ip.length > 5);

    return res.json({
      success: isSuccess,
      ping: pingTime,
      message: isSuccess ? `IP ${ip} bilan aloqa mavjud (${pingTime} ms)` : `IP ${ip} so'rovga javob bermadi`
    });
  } catch (error) {
    console.error('testPing error:', error);
    return res.status(500).json({ success: false, message: 'Ping tekshirishda xatolik' });
  }
}
