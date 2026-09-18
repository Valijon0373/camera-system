import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

export async function initDb() {
  const db = await getDb();

  // Create Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'operator',
      allowedCameras TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL
    );
  `);

  // Create Rooms Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      createdAt TEXT NOT NULL
    );
  `);

  // Create Cameras Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cameras (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      ip TEXT NOT NULL,
      port TEXT DEFAULT '554',
      protocol TEXT DEFAULT 'RTSP',
      roomId TEXT DEFAULT '',
      status TEXT DEFAULT 'online',
      ping INTEGER DEFAULT 10,
      createdAt TEXT NOT NULL
    );
  `);

  // Create Logs Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      user TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed default admin ONLY if users table is empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding initial admin user into database...');
    const now = new Date().toISOString().split('T')[0];

    // Seed ONLY 1 Admin User
    await db.run(
      'INSERT INTO users (id, fullName, username, password, role, allowedCameras, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['1', 'Bosh Administrator', 'admin', '123456', 'admin', JSON.stringify(['all']), now]
    );

    console.log('Admin user seeded successfully.');
  }

  return db;
}
