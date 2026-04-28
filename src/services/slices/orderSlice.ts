import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TBurgerConstructorState } from './burgerConstructorSlice';

export type TOrderModalData = {
  number: number;
};

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
  error: string | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
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

    const ids = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

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

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
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
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
