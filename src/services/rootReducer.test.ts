import { rootReducer } from './rootReducer';
import { initialState as ingredientsInitial } from './slices/ingredientsSlice';
import { initialState as burgerConstructorInitial } from './slices/burgerConstructorSlice';
import { initialState as orderInitial } from './slices/orderSlice';
import { initialState as userInitial } from './slices/userSlice';
import { initialState as feedInitial } from './slices/feedSlice';
import { initialState as ordersInitial } from './slices/ordersSlice';

const expectedInitialState = {
  ingredients: ingredientsInitial,
  burgerConstructor: burgerConstructorInitial,
  order: orderInitial,
  user: userInitial,
  feed: feedInitial,
  orders: ordersInitial
};

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(expectedInitialState);
  });
});
