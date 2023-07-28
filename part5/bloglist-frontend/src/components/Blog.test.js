import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const increaseLikesMock = jest.fn();

describe('<Blog />', () => {
  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        increaseLikes={increaseLikesMock}
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

  test('all information shown after view button clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    expect(screen.getByText(blog.title, { exact: false })).toBeDefined();
    expect(screen.getByText(blog.author, { exact: false })).toBeDefined();
    expect(screen.getByText(blog.url)).toBeDefined();
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined();
    expect(screen.getByText(blog.user.name)).toBeDefined();
  });

  test('clicking like-button twice calls event handler twice', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('view'));
    await user.click(screen.getByText('like'));
    await user.click(screen.getByText('like'));

    expect(increaseLikesMock.mock.calls).toHaveLength(2);
  });
});
