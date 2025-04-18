
import React, {useEffect, useState} from 'react';
import {
    Paper, Typography, Box, Button, Chip, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {useParams} from "react-router";

function Publication() {
    const { id } = useParams();
    const [publication, setPublication] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3001/document/" + id)
            .then(res => res.json())
            .then(pub => setPublication(pub))
    }, [])

    if (publication === null) {
        return <div>Loading Publication</div>
    }

    return (
        <Paper elevation={2} sx={{p: 3}}>
          <Button
              startIcon={<ArrowBackIcon/>}
              onClick={() => history.back()}
              sx={{mb: 2}}
          >
            Back to List
          </Button>

      <Typography variant="h5" component="h1" gutterBottom>
          {publication.title}</Typography>
            <div><pre>{publication.content}</pre></div>
        </Paper>)

}

export default Publication