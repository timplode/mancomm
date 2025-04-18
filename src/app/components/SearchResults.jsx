import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Pagination,
    TextField,
    InputAdornment,
    Divider, Button
} from '@mui/material';
import { Search} from 'lucide-react';

// Sample data for demonstration
const sampleResults = [
    {
        id: 1,
        title: "Advanced Machine Learning Techniques",
        publicationDate: "2024-01-15",
        standardNumber: "ISBN 978-3-16-148410-0",
        content: "This paper explores recent advancements in machine learning, focusing on transformer architectures and their applications in natural language processing."
    },
    {
        id: 2,
        title: "Quantum Computing: Present and Future",
        publicationDate: "2023-11-20",
        standardNumber: "DOI 10.1109/5.771073",
        content: "An overview of the current state of quantum computing technology and potential applications in cryptography, optimization problems, and material science simulation."
    },
    {
        id: 3,
        title: "Sustainable Energy Systems",
        publicationDate: "2024-03-05",
        standardNumber: "ISSN 1558-7908",
        content: "This research paper discusses renewable energy integration strategies for urban environments, with case studies from multiple metropolitan areas."
    },
    {
        id: 4,
        title: "Neural Networks in Medical Diagnosis",
        publicationDate: "2023-09-12",
        standardNumber: "ISBN 978-0-12-385152-1",
        content: "An examination of how deep learning algorithms are revolutionizing medical image analysis and contributing to more accurate disease diagnosis."
    },
    {
        id: 5,
        title: "Climate Change Mitigation Strategies",
        publicationDate: "2024-02-28",
        standardNumber: "DOI 10.1016/j.envint.2022.11.003",
        content: "This comprehensive review analyzes various approaches to reducing carbon emissions across industrial sectors and evaluates their effectiveness."
    }
];

export default function SearchResults(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const resultsPerPage = 5;

    // Filter results based on search query
    const filteredResults = props.results.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.standardNumber.includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const pageCount = Math.ceil(filteredResults.length / resultsPerPage);
    const displayedResults = filteredResults.slice(
        (page - 1) * resultsPerPage,
        page * resultsPerPage
    );

    // Handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Box className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <Typography variant="h4" className="text-gray-800 mb-6">
        Search Results
      </Typography>

            {/* Search input */}
            <TextField
                fullWidth
                placeholder="Search within results..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1); // Reset to first page on new search
                }}
                className="mb-6"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
                    ),
                }}
            />

            {displayedResults.length > 0 ? (
                <>
          {/* Results count */}
                    <Typography variant="body2" className="text-gray-600 mb-4">
            Showing {displayedResults.length} of {filteredResults.length} results
          </Typography>

                    {/* Results cards */}
                    {displayedResults.map((result) => (
                        <Card key={result.id} className="mb-4 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Typography variant="h6" className="text-indigo-700 font-medium mb-2">
                  {result.title}
                </Typography>

                <Box className="flex flex-wrap gap-4 mb-3">
                  <Box className="flex items-center text-gray-600">
                    <Typography variant="body2">
                      {formatDate(result.publicationDate)}
                    </Typography>
                  </Box>

                  <Box className="flex items-center text-gray-600">
                    <Typography variant="body2">
                      {result.standardNumber}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="my-2" />

                <Typography variant="body1" className="text-gray-700 mt-2">
                  {result.content.substr(0, 200)}
                </Typography>
                  <Button href={"/publication/"+result.id}>Full Document</Button>
              </CardContent>
            </Card>
                    ))}

                    {/* Pagination */}
                    <Box className="flex justify-center mt-6">
            <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
          </Box>
        </>
            ) : (
                <Box className="text-center py-10">
          <Typography variant="h6" className="text-gray-500">
            No results found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-2">
            Try adjusting your search terms
          </Typography>
        </Box>
            )}
    </Box>
    );
}