import React from 'react';
import ReactDOM from 'react-dom';
import SalonDetails from './SalonDetails';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SalonDetails />, div);
  ReactDOM.unmountComponentAtNode(div);
});