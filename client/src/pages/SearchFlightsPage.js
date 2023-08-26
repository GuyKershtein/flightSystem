import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Autocomplete
} from '@mui/material';
import { format } from 'date-fns';

import { airports } from '../data/airports';

const SearchFlightsPage = () => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    from: formatDate(today),
    to: formatDate(nextWeek),
    displayOnlyDiscounted: false,
  });

  const [searchResults, setSearchResults] = useState([]);

  const handleSearchFieldChange = (event) => {
    const { name, value } = event.target;
    setSearchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSearchData((prevData) => ({ ...prevData, [name]: checked }));
  };

  const handleSearch = async () => {
    // Build the query parameters based on searchData
    const queryParams = [];
    if (searchData.source) queryParams.push(`source=${searchData.source}`);
    if (searchData.destination) queryParams.push(`destination=${searchData.destination}`);
    if (searchData.from) queryParams.push(`from=${format(new Date(searchData.from), 'yyyy-MM-dd')}`);
    if (searchData.to) queryParams.push(`to=${format(new Date(searchData.to), 'yyyy-MM-dd')}`);
    if (searchData.displayOnlyDiscounted) queryParams.push('displayOnlyDiscounted=true');

    // Construct the API URL
    const apiUrl = `/api/flights?${queryParams.join('&')}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const isSearchButtonDisabled = () => {
    return !searchData.source || !searchData.destination || !searchData.from || !searchData.to;
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Flight Search</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === searchData.source)}
            onChange={(event, newValue) => {
              setSearchData((prevFlight) => ({ ...prevFlight, source: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Source" />}
            style={{ marginRight: '10px', minWidth: '300px' }}
          />
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === searchData.destination)}
            onChange={(event, newValue) => {
              setSearchData((prevFlight) => ({ ...prevFlight, destination: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Destination" />}
            style={{ marginRight: '10px', minWidth: '300px' }}
          />
          <TextField
            name="from"
            label="From"
            type="date"
            value={searchData.from}
            onChange={handleSearchFieldChange}
            margin="dense"
            style={{ marginRight: '10px', minWidth: '150px' }}
          />
          <TextField
            name="to"
            label="To"
            type="date"
            value={searchData.to}
            onChange={handleSearchFieldChange}
            margin="dense"
            style={{ marginRight: '10px', minWidth: '150px' }}
          />
          <label style={{ marginRight: '10px' }}>
            Only Discounted
            <input
              name="displayOnlyDiscounted"
              type="checkbox"
              checked={searchData.displayOnlyDiscounted}
              onChange={handleCheckboxChange}
            />
          </label>
          <Button variant="contained" color="primary" 
                  onClick={handleSearch} disabled={isSearchButtonDisabled()} >
            Search
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{new Date(result.from).toLocaleString()}</TableCell>
                <TableCell>{new Date(result.to).toLocaleString()}</TableCell>
                <TableCell>{result.discountedPrice ? result.discountedPrice : result.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SearchFlightsPage;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

