import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

const blog = {
  title: 'Build a Blog using Next.JS and DEV.to',
  author: 'Martin Paucot',
  url: 'https://dev.to/martinp/build-a-blog-using-nextjs-and-devto-15a5',
  likes: 17,
  user: {
    username: 'test',
    name: 'Test User',
    id: '64adc28e7f019d4badf98813',
  },
  id: '64ae634bb8d3dd9fc8448242',
};

describe('<Blog />', () => {
  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        increaseLikes={jest.fn()}
        isOwnBlog={true}
        deleteBlog={jest.fn()}
      />,
    );
  });

  test('initially renders only title and author', () => {
    expect(screen.getByText(blog.title, { exact: false })).toBeDefined();
    expect(screen.getByText(blog.author, { exact: false })).toBeDefined();
    expect(screen.queryByText(blog.url, { exact: false })).toBeNull();
  });
});
