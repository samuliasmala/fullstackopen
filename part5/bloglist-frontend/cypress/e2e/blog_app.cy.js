describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'test',
      name: 'Test User',
      password: 'longpassword',
    });
    cy.visit('/');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });
});
