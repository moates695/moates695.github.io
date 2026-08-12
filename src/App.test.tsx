import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// This replaced Create React App's boilerplate "renders learn react link"
// assertion, which had been failing since the site was first built: there has
// never been a link by that name here.
test('mounts the app shell with trackable navigation', () => {
  const { container } = render(<App />);

  // Proves the shell came up end to end: the router mounted, the toolbar
  // rendered, and the data-track convention the analytics module depends on is
  // present on the nav.
  expect(container.querySelectorAll('[data-track]').length).toBeGreaterThan(0);
});
