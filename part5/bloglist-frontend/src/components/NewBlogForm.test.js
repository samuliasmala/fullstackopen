import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewBlogForm } from './NewBlogForm';

const blogData = {
  title: 'Build a Blog using Next.JS and DEV.to',
  author: 'Martin Paucot',
  url: 'https://dev.to/martinp/build-a-blog-using-nextjs-and-devto-15a5',
};

const createBlogMock = jest.fn();

describe('<NewBlogForm />', () => {
  test('blog is created with correct data', async () => {
    const { container } = render(<NewBlogForm createBlog={createBlogMock} />);
    const { title, author, url } = blogData;
    const user = userEvent.setup();
    await user.type(container.querySelector('input[name="Title"]'), title);
    await user.type(container.querySelector('input[name="Author"]'), author);
    await user.type(container.querySelector('input[name="Url"]'), url);
    await user.click(screen.getByText('create'));

    expect(createBlogMock.mock.calls).toHaveLength(1);
    expect(createBlogMock.mock.calls[0][0]).toEqual(blogData);
  });
});
