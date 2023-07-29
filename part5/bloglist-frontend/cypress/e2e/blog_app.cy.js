const userData = {
  username: 'test',
  name: 'Test User',
  password: 'longpassword',
};

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userData);
    cy.visit('/');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type(userData.username);
      cy.get('input[name="Password"]').type(userData.password);
      cy.contains('button', 'login').click();
      cy.contains(`${userData.name} logged in`);
    });

    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"]').type('test');
      cy.get('input[name="Password"]').type('wrong');
      cy.contains('button', 'login').click();
      cy.contains('wrong username or password');
    });
  });
});
