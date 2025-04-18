// App.jsx - Main application component

import React, { useState, useEffect } from 'react';
import {
    Container, CssBaseline, ThemeProvider, createTheme,
    Paper, Typography, Box, Tabs, Tab, CircularProgress,
    TextField, Button, Divider
} from '@mui/material';
import DocumentSearchForm from "./components/DocumentSearchForm.jsx";


// Create theme
const theme = createTheme({
    spacing: 4,
    palette: {
        primary: {
            main: '#1565c0', // Deep blue
        },
        secondary: {
            main: '#f44336', // Red
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '20px',
                },
            },
        },
    },
});

function App(props) {


    return (
        <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ pt: 2 }}>
            OSHA Publications Database
          </Typography>
            {props.children}
        </Paper>
      </Container>
    </ThemeProvider>
    );
}

export {App};