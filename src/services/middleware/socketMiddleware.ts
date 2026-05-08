import { Middleware } from '@reduxjs/toolkit';
import { getCookie } from '../../utils/cookie';

type TWsActionTypes = {
  connect: string;
  disconnect: string;
  onMessage: string;
};

export const socketMiddleware = (
  wsUrl: string,
  actionTypes: TWsActionTypes,
  withToken = false
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const typedAction = action as { type: string; payload?: unknown };

      if (typedAction.type === actionTypes.connect) {
        if (socket?.readyState === WebSocket.OPEN) {
          return next(action);
        }

        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          if (withToken) {
            const token = getCookie('accessToken');
            if (token) {
              socket?.send(
                JSON.stringify({
                  token: token.replace(/^Bearer\s+/i, '')
                })
              );
            }
          }
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.success) {
            dispatch({ type: actionTypes.onMessage, payload: data });
          }
        };

        socket.onerror = () => {
          socket?.close();
        };

        socket.onclose = () => {
          socket = null;
        };
      }

      if (typedAction.type === actionTypes.disconnect && socket) {
        socket.close(1000);
        socket = null;
      }

      return next(action);
    };
  };
};
