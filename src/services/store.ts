import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { rootReducer } from './rootReducer';
import { socketMiddleware } from './middleware/socketMiddleware';
import {
  feedWsConnect,
  feedWsDisconnect,
  feedWsOnMessage
} from './slices/feedSlice';
import {
  ordersWsConnect,
  ordersWsDisconnect,
  ordersWsOnMessage
} from './slices/ordersSlice';

const WS_URL =
  process.env.BURGER_API_URL?.replace('https', 'wss').replace('/api', '/orders') ??
  'wss://norma.education-services.ru/orders';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(
        WS_URL,
        {
          connect: feedWsConnect.type,
          disconnect: feedWsDisconnect.type,
          onMessage: feedWsOnMessage.type
        },
        false
      ),
      socketMiddleware(
        WS_URL,
        {
          connect: ordersWsConnect.type,
          disconnect: ordersWsDisconnect.type,
          onMessage: ordersWsOnMessage.type
        },
        true
      )
    )
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
