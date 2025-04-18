// components/OshActSearch.jsx
import React, { useState } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem,
    Button, Box, Typography, Alert, TextField
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import PublicationList from './PublicationList.jsx';

function OshActSearch({ sections, onSelectPublication }) {
    const [selectedSection, setSelectedSection] = useState(null);
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!selectedSection) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/publications/oshact?section=${encodeURIComponent(selectedSection)}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch publications');
            }

            const data = await response.json();
            setPublications(data);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching publications by OSH Act section:', error);
            setError('An error occurred while fetching publications. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
      <Typography variant="h6" gutterBottom>
        Search by OSH Act Section
      </Typography>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Autocomplete
            fullWidth
            options={sections}
            value={selectedSection}
            onChange={(event, newValue) => {
                setSelectedSection(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="OSH Act Section" />}
        />

        <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!selectedSection || isLoading}
            sx={{ ml: 2 }}
        >
          Search
        </Button>
      </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {hasSearched && (
                <Box>
          <Typography variant="subtitle1" gutterBottom>
            {publications.length} publications found for OSH Act section: {selectedSection}
          </Typography>

          <PublicationList
              publications={publications}
              isLoading={isLoading}
              onSelectPublication={onSelectPublication}
              hideControls
          />
        </Box>
            )}
    </Box>
    );
}

export default OshActSearch;
