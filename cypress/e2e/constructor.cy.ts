const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const SAUCE_NAME = 'Соус Spicy-X';

const addIngredient = (name: string) => {
  cy.contains('li', name).find('button').contains('Добавить').click();
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
    cy.visit('/');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавляет булку, начинку и соус в конструктор', () => {
      addIngredient(BUN_NAME);
      addIngredient(MAIN_NAME);
      addIngredient(SAUCE_NAME);

      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('(верх)').should('contain', BUN_NAME);
        cy.contains('(низ)').should('contain', BUN_NAME);
        cy.contains(MAIN_NAME).should('exist');
        cy.contains(SAUCE_NAME).should('exist');
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывает модальное окно с данными выбранного ингредиента', () => {
      cy.contains('li', MAIN_NAME).find('a').click();
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('h3', MAIN_NAME).should('be.visible');
      });
    });

    it('закрывает модальное окно по клику на крестик', () => {
      cy.contains('li', MAIN_NAME).find('a').click();
      cy.get('[class*="modal"]').should('exist');
      cy.get('[class*="button"]').click();
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('закрывает модальное окно по клику на оверлей', () => {
      cy.contains('li', SAUCE_NAME).find('a').click();
      cy.get('[class*="modal"]').should('exist');
      cy.get('[class*="overlay"]').click({ force: true });
      cy.get('[class*="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
      window.localStorage.setItem(
        'refreshToken',
        'test-refresh-token'
      );
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      window.localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('оформляет заказ, показывает номер и очищает конструктор', () => {
      addIngredient(BUN_NAME);
      addIngredient(MAIN_NAME);
      addIngredient(SAUCE_NAME);

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.contains('12345').should('be.visible');
      cy.get('[class*="modal"]').should('exist');

      cy.get('[class*="modal"] [class*="button"]').first().click();
      cy.get('[class*="modal"]').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
