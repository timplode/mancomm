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

function App() {
    // State for the current tab
    const [tabValue, setTabValue] = useState(0);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Filter options state
    const [filterOptions, setFilterOptions] = useState({
        dates: [],
        standardNumbers: [],
        oshActSections: [],
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Selected publication state
    const [selectedPublication, setSelectedPublication] = useState(null);

    // Search results
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Tab Change handler
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedPublication(null);
        setShowSearchResults(false);
    };

    // Handle publication selection
    const handlePublicationSelect = (publication) => {
        setSelectedPublication(publication);
    };

    // Handle search submission
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/publications/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: searchQuery }),
            });

            const data = await response.json();
            setSearchResults(data);
            setShowSearchResults(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Error searching publications:', error);
            setIsLoading(false);
        }
    };

    // Load filter options on component mount
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const data = await fetchFilterOptions();
                setFilterOptions(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching filter options:', error);
                setIsLoading(false);
            }
        };

        loadFilterOptions();
    }, []);

    // Handle back button from publication detail
    const handleBackToList = () => {
        setSelectedPublication(null);
    };

    return (
        <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ pt: 2 }}>
            OSHA Publications Database
          </Typography>
            <DocumentSearchForm />


        </Paper>
      </Container>
    </ThemeProvider>
    );
}

export {App};