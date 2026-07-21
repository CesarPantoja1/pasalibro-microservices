import React from 'react';
import { useParams } from 'react-router-dom';

function BookDetail() {
  const { id } = useParams();

  return (
    <main>
      <h1>Book Detail</h1>
      <p>Detalle del libro con id: {id}</p>
    </main>
  );
}

export default BookDetail;
