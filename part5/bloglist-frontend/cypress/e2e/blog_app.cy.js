const userData = {
  username: 'test',
  name: 'Test User',
  password: 'longpassword',
};

const blogData = {
  title: 'Build a Blog using Next.JS and DEV.to',
  author: 'Martin Paucot',
  url: 'https://dev.to/martinp/build-a-blog-using-nextjs-and-devto-15a5',
  likes: 7,
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

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog(blogData);
      });

      it('it can be liked', function () {
        cy.contains(blogData.title).parent().as('theBlog');
        cy.get('@theBlog').contains('button', 'view').click();
        cy.get('@theBlog').contains('button', 'like').click();
        cy.get('@theBlog').contains(`likes ${blogData.likes + 1}`);
      });

      it('it can be removed by the creator', function () {
        cy.contains(blogData.title).parent().as('theBlog');
        cy.get('@theBlog').contains('button', 'view').click();
        cy.get('@theBlog').contains('button', 'delete').click();
        cy.contains(blogData.title).should('not.exist');
      });

      it('delete button only seen by the creator', function () {
        // delete button visible for the creator
        cy.contains(blogData.title).parent().as('theBlog');
        cy.get('@theBlog').contains('button', 'view').click();
        cy.get('@theBlog').contains('button', 'delete');

        // delete button not visible for other users
        const anotherUserData = {
          username: 'test2',
          name: 'Test User2',
          password: 'longpassword2',
        };
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUserData);
        const { username, password } = anotherUserData;
        cy.login({ username, password });

        cy.contains(blogData.title).parent().as('theBlog');
        cy.get('@theBlog').contains('button', 'view').click();
        cy.get('@theBlog').contains('button', 'delete').should('not.exist');
      });
    });

    it('blogs are sorted by likes', function () {
      // Create blogs with different likes
      cy.createBlog({ ...blogData, title: 'Blog1', likes: 7 });
      cy.createBlog({ ...blogData, title: 'Blog2', likes: 0 });
      cy.createBlog({ ...blogData, title: 'Blog3', likes: 21 });
      cy.createBlog({ ...blogData, title: 'Blog4', likes: 3 });
      cy.createBlog({ ...blogData, title: 'Blog5', likes: 128 });

      // Verify blogs are sorted by likes
      cy.get('.blog').eq(0).contains('Blog5'); // likes: 128
      cy.get('.blog').eq(1).contains('Blog3'); // likes: 21
      cy.get('.blog').eq(2).contains('Blog1'); // likes: 7
      cy.get('.blog').eq(3).contains('Blog4'); // likes: 3
      cy.get('.blog').eq(4).contains('Blog2'); // likes: 0
    });
  });
});
