/**
 * Singleton socket instances.
 * Auth is token-based: the in-memory access token from Redux is passed in
 * socket.handshake.auth.token — never stored in localStorage or cookies.
 */
import { io, type Socket } from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

let contactsSocket: Socket | null = null;
let batchSocket: Socket | null = null;

const buildOpts = (token: string) => ({
  withCredentials: true,
  transports: ["polling", "websocket"] as ["polling", "websocket"],
  autoConnect: false,
  auth: { token },
});

export const initSockets = (token: string): void => {
  // Create or reconnect with the latest token
  if (!contactsSocket) {
    contactsSocket = io(`${SERVER_URL}/contacts`, buildOpts(token));
  } else {
    const tokenChanged = (contactsSocket.auth as { token?: string }).token !== token;
    contactsSocket.auth = { token };
    // Force reconnect so the new token is sent immediately (not deferred to next auto-reconnect)
    if (tokenChanged && contactsSocket.connected) {
      contactsSocket.disconnect().connect();
    }
  }

  if (!batchSocket) {
    batchSocket = io(`${SERVER_URL}/batch`, buildOpts(token));
  } else {
    const tokenChanged = (batchSocket.auth as { token?: string }).token !== token;
    batchSocket.auth = { token };
    if (tokenChanged && batchSocket.connected) {
      batchSocket.disconnect().connect();
    }
  }

  if (!contactsSocket.connected) contactsSocket.connect();
  if (!batchSocket.connected) batchSocket.connect();
};

export const getContactsSocket = (): Socket => {
  if (!contactsSocket) throw new Error("Socket not initialized. Call initSockets(token) first.");
  return contactsSocket;
};

export const getBatchSocket = (): Socket => {
  if (!batchSocket) throw new Error("Socket not initialized. Call initSockets(token) first.");
  return batchSocket;
};

export const disconnectAllSockets = () => {
  contactsSocket?.disconnect();
  batchSocket?.disconnect();
  contactsSocket = null;
  batchSocket = null;
};
