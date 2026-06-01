import {
  fetchIngredients,
  ingredientsReducer,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png'
  }
];

describe('ingredientsReducer', () => {
  it('устанавливает isLoading в true при запросе', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('записывает ингредиенты и сбрасывает isLoading при успехе', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.data).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });

  it('записывает ошибку и сбрасывает isLoading при ошибке', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(
        new Error('Ошибка сервера'),
        '',
        undefined,
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
