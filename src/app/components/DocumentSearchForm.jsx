import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    FormControl,
    FormLabel,
    Paper,
    Typography,
    Box,
    Grid,
    Container,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import SearchResults from "./SearchResults.jsx";

const api_host = process.env.REACT_APP_API_HOST;

const DocumentSearchForm = () => {
    // Form state
    const [fromYear, setFromYear] = useState('');
    const [toYear, setToYear] = useState('');
    const [selectedStandard, setSelectedStandard] = useState(null);
    const [standardOptions, setStandardOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([])

    // Validation state
    const [yearErrors, setYearErrors] = useState({
        fromYear: '',
        toYear: ''
    });

    // Fetch standard options on component mount
    useEffect(() => {
        const fetchStandards = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/standard');

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setStandardOptions(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching standard options:', err);
                setError('Failed to load standard options. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStandards();
    }, []);

    // Handle year input changes with validation
    const handleYearChange = (e, yearType) => {
        const value = e.target.value;

        if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
            if (yearType === 'from') {
                setFromYear(value);
            } else {
                setToYear(value);
            }

            validateYear(value, yearType);
        }
    };

    // Validate year inputs
    const validateYear = (value, yearType) => {
        let error = '';

        if (value !== '') {
            const year = parseInt(value, 10);

            if (value.length !== 4) {
                error = 'Year must be in YYYY format';
            } else if (year < 1975 || year > 2025) {
                error = 'Year must be between 1975 and 2025';
            }
        }

        setYearErrors(prev => ({
            ...prev,
            [yearType === 'from' ? 'fromYear' : 'toYear']: error
        }));

        return error === '';
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs before submission
        const isFromYearValid = validateYear(fromYear, 'from');
        const isToYearValid = validateYear(toYear, 'to');

        if (!isFromYearValid || !isToYearValid) {
            return;
        }

        // Build query parameters
        const params = new URLSearchParams();

        if (fromYear) {
            params.append('fromYear', fromYear);
        }

        if (toYear) {
            params.append('toYear', toYear);
        }

        // Add selected standard number if one is selected
        if (selectedStandard) {
            params.append('standardNumber', selectedStandard.id);
        }

        // Make API call
        const url = `http://localhost:3001/search?${params.toString()}`;

        console.log('Sending request to:', url);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data);
                setResults(data)
            })
            .catch(error => {
                setResults([])
                console.error('Error searching documents:', error);
            });
    };

    return (
        <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Search
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Publication Date (Optional)</FormLabel>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <TextField
                      label="From Year"
                      fullWidth
                      value={fromYear}
                      onChange={(e) => handleYearChange(e, 'from')}
                      placeholder="YYYY"
                      error={!!yearErrors.fromYear}
                      helperText={yearErrors.fromYear}
                      inputProps={{
                          maxLength: 4,
                          inputMode: 'numeric'
                      }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                      label="To Year"
                      fullWidth
                      value={toYear}
                      onChange={(e) => handleYearChange(e, 'to')}
                      placeholder="YYYY"
                      error={!!yearErrors.toYear}
                      helperText={yearErrors.toYear}
                      inputProps={{
                          maxLength: 4,
                          inputMode: 'numeric'
                      }}
                  />
                </Grid>
              </Grid>
            </FormControl>
          </Box>

          <Box mb={4}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Standard Number</FormLabel>
              <Box mt={1}>
                <Autocomplete
                    id="standardNumber"
                    options={standardOptions}
                    value={selectedStandard}
                    onChange={(event, newValue) => {
                        setSelectedStandard(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select Standard"
                            placeholder="Type to search"
                            error={!!error}
                            helperText={error}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                          </>
                                ),
                            }}
                        />
                    )}
                    loading={loading}
                    freeSolo={false} // Restricts to only predefined options
                />
              </Box>
            </FormControl>
          </Box>

          <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
          >
            Search
          </Button>
        </form>
      </Paper>
            {results.length > 0 && <SearchResults results={results} />}
    </Container>
    );
};

export default DocumentSearchForm;