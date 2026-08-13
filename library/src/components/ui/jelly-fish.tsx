import React from 'react';
import BookDriftLoader from './jelly-fish.jsx';

export const Component = ({ message = "BOOKS • DISCOVERY • KNOWLEDGE • WISDOM" }) => {
  return <BookDriftLoader message={message} />;
};

export default BookDriftLoader;
