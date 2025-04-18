// App.jsx - Main application component

import React, { useState, useEffect } from 'react';
import {
  Container, CssBaseline, ThemeProvider, createTheme,
  Paper, Typography, Box, Tabs, Tab, CircularProgress,
  TextField, Button, Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import DateSearch from './components/DateSearch.jsx';
import StandardSearch from './components/StandardSearch.jsx';
import OshActSearch from './components/OshActSearch.jsx';
import PublicationList from './components/PublicationList.jsx';
import PublicationDetail from './components/PublicationDetail.jsx';


// Create theme
const theme = createTheme({
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

          {/* Search bar */}
          <Box sx={{ display: 'flex', p: 2 }}>
            <TextField
                fullWidth
                label="Search publications"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={handleSearch}
                startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
              <Tab label="Browse" />
              <Tab label="By Date" />
              <Tab label="By Standard" />
              <Tab label="By OSH Act" />
            </Tabs>
          </Box>
        </Paper>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedPublication ? (
            <PublicationDetail
                publication={selectedPublication}
                onBack={handleBackToList}
            />
        ) : showSearchResults ? (
            <div>Search Results</div>
        ) : (
            <>
            {/* Tab Content */}
              <Box sx={{ mt: 3 }}>
              {/* Browse Tab */}
                {tabValue === 0 && (
                    <PublicationList onSelectPublication={handlePublicationSelect} />
                )}

                {/* By Date Tab */}
                {tabValue === 1 && (
                    <DateSearch
                        dates={filterOptions.dates}
                        onSelectPublication={handlePublicationSelect}
                    />
                )}

                {/* By Standard Tab */}
                {tabValue === 2 && (
                    <StandardSearch
                        standards={filterOptions.standardNumbers}
                        onSelectPublication={handlePublicationSelect}
                    />
                )}

                {/* By OSH Act Tab */}
                {tabValue === 3 && (
                    <OshActSearch
                        sections={filterOptions.oshActSections}
                        onSelectPublication={handlePublicationSelect}
                    />
                )}
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export App;