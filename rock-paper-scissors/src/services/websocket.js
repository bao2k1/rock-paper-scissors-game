// src/services/websocket.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://192.168.2.21:8080/ws';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connectionPromise = null;
  }

  connect(onConnect) {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws-game'),
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        console.log('Connected to WebSocket');
        if (onConnect) onConnect();
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('WebSocket error:', frame);
        reject(new Error('Failed to connect to game server'));
      };

      this.client.onWebSocketError = (event) => {
        console.error('WebSocket error:', event);
        reject(new Error('Failed to connect to game server'));
      };

      this.client.activate();
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.client) {
      Array.from(this.subscriptions.values()).forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      this.connectionPromise = null;
    }
  }

  subscribe(destination, callback) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      });

      this.subscriptions.set(destination, subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send(destination, data) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}

export default new WebSocketService();