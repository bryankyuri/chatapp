// src/utils/socket.js
import { io } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:3000';
const SOCKET_URL = 'https://chatappserver-ebuc.onrender.com'
export const socket = io(SOCKET_URL);