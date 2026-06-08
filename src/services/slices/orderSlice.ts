import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { TBurgerConstructorState } from './burgerConstructorSlice';

export type TOrderModalData = {
  number: number;
};

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
  orderByNumber: TOrder | null;
  orderByNumberRequest: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  orderByNumberRequest: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (_, { getState, rejectWithValue }) => {
    const { burgerConstructor } = getState() as {
      burgerConstructor: TBurgerConstructorState;
    };
    const { bun, ingredients } = burgerConstructor;

    if (!bun) {
      return rejectWithValue('Не выбрана булка');
    }

    const ids = [bun._id, ...ingredients.map((item) => item._id), bun._id];

    try {
      const data = await orderBurgerApi(ids);
      return { number: data.order.number };
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ?? 'Ошибка создания заказа'
      );
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
      state.orderByNumberRequest = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) ?? 'Ошибка';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderByNumberRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberRequest = false;
        state.orderByNumber = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderByNumberRequest = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderModal, clearOrderByNumber } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
