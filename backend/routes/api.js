import express from 'express';
import { login } from '../controllers/authController.js';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { getCameras, createCamera, updateCamera, deleteCamera, testPing } from '../controllers/cameraController.js';
import { streamCamera, snapshotCamera } from '../controllers/streamController.js';
import { getLogs, createLog, clearLogs } from '../controllers/logController.js';
import { getSystemStatus, refreshCameraPings } from '../controllers/systemController.js';

const router = express.Router();

// System Status & Real-time Metrics Routes
router.get('/system/status', getSystemStatus);
router.post('/system/refresh-pings', refreshCameraPings);

// Auth Routes
router.post('/auth/login', login);

// User Routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Room Routes
router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// Camera Routes
router.get('/cameras', getCameras);
router.post('/cameras', createCamera);
router.put('/cameras/:id', updateCamera);
router.delete('/cameras/:id', deleteCamera);
router.post('/cameras/test-ping', testPing);
router.get('/cameras/:id/stream', streamCamera);
router.get('/cameras/:id/snapshot', snapshotCamera);

// Log Routes
router.get('/logs', getLogs);
router.post('/logs', createLog);
router.delete('/logs', clearLogs);

export default router;
