// components/DateSearch.jsx
import React, { useState } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem,
    Button, Box, Typography, Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import PublicationList from './PublicationList.jsx';

function DateSearch({ dates, onSelectPublication }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleSearch = async () => {
        if (!selectedDate) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/publications/date?date=${selectedDate}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch publications');
            }

            const data = await response.json();
            setPublications(data);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching publications by date:', error);
            setError('An error occurred while fetching publications. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
      <Typography variant="h6" gutterBottom>
        Search by Publication Date
      </Typography>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Publication Date</InputLabel>
          <Select
              value={selectedDate}
              onChange={handleDateChange}
              label="Publication Date"
          >
            {dates.map((date) => (
                <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!selectedDate || isLoading}
            sx={{ ml: 2 }}
        >
          Search
        </Button>
      </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {hasSearched && (
                <Box>
          <Typography variant="subtitle1" gutterBottom>
            {publications.length} publications found for date: {selectedDate}
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

export default DateSearch;
