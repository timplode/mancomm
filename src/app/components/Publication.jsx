
import React, {useEffect, useState} from 'react';
import {
    Paper, Typography, Box, Button, Chip, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {useParams} from "react-router";
const api_host = process.env.REACT_APP_API_HOST;
function Publication() {
    const { id } = useParams();
    const [publication, setPublication] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:3001/document/" + id)
            .then(res => res.status === 200
                    ? res.json()
                    : null)
            .then(res => setPublication(res))
            .then(() => setLoading(false))
            .catch((e) => {
                setLoading(false)
                console.log(e.message)
            })
    }, [])


    if (loading) {
        return <div>Loading Publication</div>
    }

    if (publication === null) {
        return <div>Publication Not Found</div>
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