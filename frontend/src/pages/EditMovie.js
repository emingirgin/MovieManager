import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const EditMovie = () => {
  const { id } = useParams();

  return (
    <Container>
      <Typography variant="h4">Edit Movie</Typography>
      {/* Edit movie form will go here */}
    </Container>
  );
};

export default EditMovie; 