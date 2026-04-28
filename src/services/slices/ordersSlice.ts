import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TProfileWsMessage = {
  orders: TOrder[];
};

export const ordersWsConnect = createAction('orders/wsConnect');
export const ordersWsDisconnect = createAction('orders/wsDisconnect');
export const ordersWsOnMessage = createAction<TProfileWsMessage>(
  'orders/wsOnMessage'
);

export type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetch',
  getOrdersApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(ordersWsOnMessage, (state, action) => {
      action.payload.orders.forEach((order) => {
        const index = state.orders.findIndex((item) => item._id === order._id);

        if (index === -1) {
          state.orders.unshift(order);
        } else {
          state.orders[index] = order;
        }
      });
    });

    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
