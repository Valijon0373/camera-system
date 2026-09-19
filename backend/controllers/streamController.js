import { spawn } from 'child_process';
import { getDb } from '../db.js';

function getCameraSourceUrl(camera) {
  const custom = (camera.rtspUrl || '').trim();
  if (custom) return custom;

  const ip = (camera.ip || '').trim();
  const port = (camera.port || '554').toString().trim();
  const protocol = (camera.protocol || 'RTSP').toLowerCase();

  if (!ip) return '';
  if (protocol === 'http' || protocol === 'https') {
    return `${protocol}://${ip}:${port}/`;
  }
  return `rtsp://${ip}:${port}/`;
}

function buildFfmpegArgs(sourceUrl, mode) {
  const isRtsp = sourceUrl.toLowerCase().startsWith('rtsp://');
  const args = ['-hide_banner', '-loglevel', 'error'];

  if (isRtsp) {
    args.push('-rtsp_transport', 'tcp', '-timeout', '8000000');
  }

  args.push('-i', sourceUrl);

  if (mode === 'snapshot') {
    args.push('-frames:v', '1', '-q:v', '5', '-f', 'image2', 'pipe:1');
  } else {
    args.push(
      '-an',
      '-vf', 'scale=960:-2',
      '-q:v', '6',
      '-f', 'mpjpeg',
      'pipe:1'
    );
  }

  return args;
}

function startFfmpeg(sourceUrl, mode) {
  return spawn('ffmpeg', buildFfmpegArgs(sourceUrl, mode), {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

async function loadCamera(id) {
  const db = await getDb();
  return db.get('SELECT * FROM cameras WHERE id = ?', [id]);
}

export async function streamCamera(req, res) {
  try {
    const camera = await loadCamera(req.params.id);
    if (!camera) {
      return res.status(404).json({ success: false, message: 'Kamera topilmadi' });
    }

    const sourceUrl = getCameraSourceUrl(camera);
    if (!sourceUrl) {
      return res.status(400).json({ success: false, message: 'Kamera manzili kiritilmagan' });
    }

    req.socket.setTimeout(0);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=ffmpeg');

    const ff = startFfmpeg(sourceUrl, 'stream');
    let started = false;
    let stderr = '';

    ff.stdout.on('data', (chunk) => {
      started = true;
      if (!res.writableEnded) res.write(chunk);
    });

    ff.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 4000) stderr = stderr.slice(-4000);
    });

    const stop = () => {
      if (!ff.killed) {
        ff.kill();
      }
    };

    req.on('close', stop);
    req.on('end', stop);

    ff.on('close', (code) => {
      if (!started && !res.headersSent) {
        return res.status(502).json({
          success: false,
          message: 'Kameraga ulanish muvaffaqiyatsiz',
          detail: stderr.trim() || `ffmpeg exit ${code}`
        });
      }
      if (!res.writableEnded) res.end();
    });

    ff.on('error', (err) => {
      console.error('ffmpeg spawn error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'ffmpeg topilmadi yoki ishga tushmadi. FFmpeg o\'rnatilganini tekshiring.'
        });
      } else if (!res.writableEnded) {
        res.end();
      }
    });
  } catch (error) {
    console.error('streamCamera error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Video oqimini olishda xatolik' });
    }
  }
}

export async function snapshotCamera(req, res) {
  try {
    const camera = await loadCamera(req.params.id);
    if (!camera) {
      return res.status(404).json({ success: false, message: 'Kamera topilmadi' });
    }

    const sourceUrl = getCameraSourceUrl(camera);
    if (!sourceUrl) {
      return res.status(400).json({ success: false, message: 'Kamera manzili kiritilmagan' });
    }

    const ff = startFfmpeg(sourceUrl, 'snapshot');
    const chunks = [];
    let stderr = '';

    const timer = setTimeout(() => {
      if (!ff.killed) ff.kill();
    }, 12000);

    ff.stdout.on('data', (chunk) => chunks.push(chunk));
    ff.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    ff.on('close', (code) => {
      clearTimeout(timer);
      const buffer = Buffer.concat(chunks);
      if (!buffer.length) {
        return res.status(502).json({
          success: false,
          message: 'Kameradan rasm olinmadi',
          detail: stderr.trim() || `ffmpeg exit ${code}`
        });
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(buffer);
    });

    ff.on('error', (err) => {
      clearTimeout(timer);
      console.error('ffmpeg snapshot error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'ffmpeg ishga tushmadi' });
      }
    });
  } catch (error) {
    console.error('snapshotCamera error:', error);
    return res.status(500).json({ success: false, message: 'Snapshot olishda xatolik' });
  }
}
