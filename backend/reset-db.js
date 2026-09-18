import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function reset() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec('DELETE FROM rooms;');
  await db.exec('DELETE FROM cameras;');
  await db.exec('DELETE FROM logs;');
  await db.exec('DELETE FROM users;');

  const now = new Date().toISOString().split('T')[0];
  await db.run(
    'INSERT INTO users (id, fullName, username, password, role, allowedCameras, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['1', 'Bosh Administrator', 'admin', '123456', 'admin', JSON.stringify(['all']), now]
  );

  console.log('Database cleaned successfully!');
  const users = await db.all('SELECT * FROM users');
  const rooms = await db.all('SELECT * FROM rooms');
  const cameras = await db.all('SELECT * FROM cameras');
  const logs = await db.all('SELECT * FROM logs');

  console.log('Users count:', users.length, users);
  console.log('Rooms count:', rooms.length);
  console.log('Cameras count:', cameras.length);
  console.log('Logs count:', logs.length);
}

reset();
