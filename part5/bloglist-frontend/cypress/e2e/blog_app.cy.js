const userData = {
  username: 'test',
  name: 'Test User',
  password: 'longpassword',
};

const blogData = {
  title: 'Build a Blog using Next.JS and DEV.to',
  author: 'Martin Paucot',
  url: 'https://dev.to/martinp/build-a-blog-using-nextjs-and-devto-15a5',
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

  describe('When logged in', function () {
    beforeEach(function () {
      const { username, password } = userData;
      cy.login({ username, password });
    });

    it('A blog can be created', function () {
      cy.contains('button', 'add blog').click();
      cy.get('input[name="Title"]').type(blogData.title);
      cy.get('input[name="Author"]').type(blogData.author);
      cy.get('input[name="Url"]').type(blogData.url);
      cy.contains('button', 'create').click();
      cy.contains(blogData.title);
    });
  });
});
