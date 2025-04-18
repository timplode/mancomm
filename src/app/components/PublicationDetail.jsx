// components/PublicationDetail.jsx
import React from 'react';
import {
    Paper, Typography, Box, Button, Chip, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function PublicationDetail({ publication, onBack }) {
    if (!publication) {
        return null;
    }

    return (
        <Paper elevation={2} sx={{p: 3}}>
          <Button
              startIcon={<ArrowBackIcon/>}
              onClick={onBack}
              sx={{mb: 2}}
          >
            Back to List
          </Button>

      <Typography variant="h5" component="h1" gutterBottom>
          {publication.title}</Typography>
        </Paper>)

}

export default PublicationDetail