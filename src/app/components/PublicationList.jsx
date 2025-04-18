// components/PublicationList.jsx
import React, { useState, useEffect } from 'react';
import {
    List, ListItem, ListItemText, Divider, Typography,
    Pagination, Box, CircularProgress, Paper, Alert
} from '@mui/material';

function PublicationList({ publications: propPublications, isLoading: propIsLoading, onSelectPublication, hideControls }) {
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(propIsLoading !== undefined ? propIsLoading : true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // If publications are passed as props, use them
    useEffect(() => {
        if (propPublications) {
            setPublications(propPublications);
            setIsLoading(false);
        }
    }, [propPublications]);

    // Otherwise, fetch publications from API with pagination
    useEffect(() => {
        if (propPublications) return;

        const fetchPublications = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/publications?page=${page}&limit=10`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch publications');
                }

                const data = await response.json();
                setPublications(data.publications);
                setTotalPages(data.pagination.pages);
            } catch (error) {
                console.error('Error fetching publications:', error);
                setError('An error occurred while fetching publications. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublications();
    }, [page, propPublications]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (publications.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No publications found.</Typography>
      </Paper>
        );
    }

    return (
        <Box>
      <List component={Paper} sx={{ mb: 3 }}>
        {publications.map((publication, index) => (
            <React.Fragment key={publication._id}>
            <ListItem
                button
                onClick={() => onSelectPublication(publication)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 2
                }}
            >
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {publication.title}
              </Typography>

              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Date: {publication.publicationDate}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {publication.standardNumber !== 'N/A' && `Standard: ${publication.standardNumber}`}
                    {publication.standardNumber !== 'N/A' && publication.oshActSection !== 'N/A' && ' | '}
                    {publication.oshActSection !== 'N/A' && `OSH Act: ${publication.oshActSection}`}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                {publication.contentSummary}
              </Typography>
            </ListItem>
                {index < publications.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

            {!hideControls && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
          />
        </Box>
            )}
    </Box>
    );
}

export default PublicationList;
