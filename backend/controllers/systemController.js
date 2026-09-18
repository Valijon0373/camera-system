import { getDb } from '../db.js';
import os from 'os';

const serverStartTime = Date.now();

export async function getSystemStatus(req, res) {
  try {
    const db = await getDb();
    const cameras = await db.all('SELECT * FROM cameras');
    const logs = await db.all('SELECT * FROM logs');
    const rooms = await db.all('SELECT * FROM rooms');
    const users = await db.all('SELECT * FROM users');

    const totalCameras = cameras.length;
    const onlineCameras = cameras.filter(c => c.status === 'online');
    const onlineCount = onlineCameras.length;

    // Calculate real dynamic average ping
    let averagePing = 0;
    if (onlineCount > 0) {
      const sumPing = onlineCameras.reduce((acc, c) => acc + (Number(c.ping) || 10), 0);
      averagePing = Math.round(sumPing / onlineCount);
    }

    // Calculate real dynamic stability percentage
    let systemStability = 100.0;
    if (totalCameras > 0) {
      systemStability = Number(((onlineCount / totalCameras) * 100).toFixed(1));
    }

    // Process Uptime calculation
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

    // System RAM memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    const totalMemMB = Math.round(totalMem / (1024 * 1024));
    const ramUsagePercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

    return res.json({
      success: true,
      data: {
        totalCameras,
        onlineCount,
        offlineCount: totalCameras - onlineCount,
        averagePing: averagePing ? `${averagePing} ms` : '0 ms',
        averagePingValue: averagePing,
        systemStability: `${systemStability}%`,
        systemStabilityValue: systemStability,
        lostFrames: '0%',
        uptimeFormatted,
        uptimeSeconds,
        ramUsageMB: `${usedMemMB} MB / ${totalMemMB} MB`,
        ramUsagePercent: `${ramUsagePercent}%`,
        totalRooms: rooms.length,
        totalUsers: users.length,
        totalLogs: logs.length,
        lastChecked: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('getSystemStatus error:', error);
    return res.status(500).json({ success: false, message: 'Tizim statusini olishda xatolik' });
  }
}

// Background Ping Update for Cameras
export async function refreshCameraPings(req, res) {
  try {
    const db = await getDb();
    const cameras = await db.all('SELECT * FROM cameras');

    for (const cam of cameras) {
      if (cam.status === 'online') {
        const newPing = Math.floor(Math.random() * 15) + 5; // Simulates live network ping check (5-20ms)
        await db.run('UPDATE cameras SET ping = ? WHERE id = ?', [newPing, cam.id]);
      }
    }

    const updatedCameras = await db.all('SELECT * FROM cameras');
    return res.json({ success: true, message: 'Pinglar yangilandi', data: updatedCameras });
  } catch (error) {
    console.error('refreshCameraPings error:', error);
    return res.status(500).json({ success: false, message: 'Pinglarni yangilashda xatolik' });
  }
}
