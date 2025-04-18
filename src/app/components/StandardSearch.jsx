// components/StandardSearch.jsx
import React, { useState } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem,
    Button, Box, Typography, Alert, TextField
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import PublicationList from './PublicationList.jsx';

function StandardSearch({ standards, onSelectPublication }) {
    const [selectedStandard, setSelectedStandard] = useState(null);
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!selectedStandard) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/publications/standard?standard=${encodeURIComponent(selectedStandard)}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch publications');
            }

            const data = await response.json();
            setPublications(data);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching publications by standard:', error);
            setError('An error occurred while fetching publications. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
      <Typography variant="h6" gutterBottom>
        Search by Standard Number
      </Typography>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Autocomplete
            fullWidth
            options={standards}
            value={selectedStandard}
            onChange={(event, newValue) => {
                setSelectedStandard(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Standard Number" />}
        />

        <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!selectedStandard || isLoading}
            sx={{ ml: 2 }}
        >
          Search
        </Button>
      </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {hasSearched && (
                <Box>
          <Typography variant="subtitle1" gutterBottom>
            {publications.length} publications found for standard: {selectedStandard}
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

export default StandardSearch;
