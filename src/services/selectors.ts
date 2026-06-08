import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.data;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBurgerConstructor = (state: RootState) =>
  state.burgerConstructor;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderByNumber = (state: RootState) =>
  state.order.orderByNumber;
export const selectOrderByNumberRequest = (state: RootState) =>
  state.order.orderByNumberRequest;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;

export const selectProfileOrders = (state: RootState) => state.orders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.orders.isLoading;
