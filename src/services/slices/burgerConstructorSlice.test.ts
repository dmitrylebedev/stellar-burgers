import {
  addIngredient,
  burgerConstructorReducer,
  initialState,
  moveIngredient,
  removeIngredient,
  setBun
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png'
};

const mockBun: TIngredient = {
  ...mockIngredient,
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255
};

describe('burgerConstructorReducer', () => {
  it('добавляет булку', () => {
    const state = burgerConstructorReducer(initialState, setBun(mockBun));

    expect(state.bun?.name).toBe(mockBun.name);
    expect(state.bun?.id).toBeDefined();
  });

  it('добавляет ингредиент в начинку', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(mockIngredient.name);
  });

  it('удаляет ингредиент из начинки', () => {
    const withIngredient = burgerConstructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const id = withIngredient.ingredients[0].id;
    const state = burgerConstructorReducer(
      withIngredient,
      removeIngredient(id)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('меняет порядок ингредиентов в начинке', () => {
    const secondIngredient: TIngredient = {
      ...mockIngredient,
      _id: '643d69a5c3f7b9001cfa0943',
      name: 'Соус Spicy-X',
      type: 'sauce'
    };

    let state = burgerConstructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    state = burgerConstructorReducer(state, addIngredient(secondIngredient));
    state = burgerConstructorReducer(
      state,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients[0].name).toBe(secondIngredient.name);
    expect(state.ingredients[1].name).toBe(mockIngredient.name);
  });
});
