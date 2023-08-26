import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { format } from 'date-fns';

import { airports } from '../data/airports';

function FlightManagePage() {
  const [flights, setFlights] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/flights');
      if (response.ok) {
        const flightList = await response.json();
        setFlights(flightList);
      } else {
        console.error('Failed to fetch flight data');
        toast.error('Failed to load flights list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load flights list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [] /* run only on first render of the component */)


  const handleDelete = async (flightId) => {
    try {
      const response = await fetch(`/api/flights/${flightId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Flight deleted!');
        fetchFlights();
      } else {
        console.error('Delete request failed');
        toast.error('Failed to delete the flight');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete the flight');
    }
  };


  // new flight dialog - START --------------------------------------

  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newFlight, setNewFlight] = useState({
    source: null,
    destination: null,
    from: null,
    to: null,
    price: null,
    discountedPrice: null,
  });

  const handleCreateFlight = () => {
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
    setNewFlight({
      source: null,
      destination: null,
      from: null,
      to: null,
      price: null,
      discountedPrice: null,
    });
  };

  const handleDialogInputChange = (event) => {
    const { name, value } = event.target;
    setNewFlight(prevFlight => ({ ...prevFlight, [name]: value }));
  };

  const handleDialogCreate = async () => {
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFlight)
      });

      if (response.ok) {
        // If create API call is successful, refresh the flight list
        toast.success('Flight created!');
        fetchFlights();
        handleCloseNewDialog();
      } else {
        console.error('Create request failed');
        toast.error('Failed to create the flight');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create the flight');
    }
  };

  // new flight dialog - END --------------------------------------


  // edit flight dialog - START -----------------------------------

  const [editingflightId, setEditingflightId] = useState(null);
  const [editedFlight, setEditedFlight] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingflightId(null);
  };

  const handleEdit = (flightId) => {
    const flightToEdit = flights.find(flight => flight._id === flightId);
    setEditingflightId(flightId);
    console.log('flightToEdit', flightToEdit);
    setEditedFlight({ ...flightToEdit });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/flights/${editingflightId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedFlight)
      });

      if (response.ok) {
        await fetchFlights(); // Fetch updated flight list
        toast.success('Flight updated successfully');
        handleCloseEditDialog();
      } else {
        console.error('Edit request failed');
        toast.error('Failed to update the flight');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update the flight');
    }
  };

  // edit flight dialog - END -----------------------------------

  return (
    <div>
      <h1>Flights</h1>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateFlight}>
        Create Flight
      </Button>
      <ToastContainer position="top-right" autoClose={5000} />
      {loading ? (
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
        ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(typeof flights === 'undefined') ? (
              <p>Loading...</p>
              ) : (
              flights.map((flight, i) => (
                <TableRow key={i}>
                  <TableCell>{flight.source}</TableCell>
                  <TableCell>{flight.destination}</TableCell>
                  <TableCell>{new Date(flight.from).toLocaleString()}</TableCell>
                  <TableCell>{new Date(flight.to).toLocaleString()}</TableCell>
                  <TableCell>{flight.price}</TableCell>
                  <TableCell>{flight.discountedPrice}</TableCell>
                   <TableCell>
                    <IconButton onClick={() => handleEdit(flight._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(flight._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      )}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog}>
        <DialogTitle>Add new flight</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === newFlight.source)}
            onChange={(event, newValue) => {
              setNewFlight((prevFlight) => ({ ...prevFlight, source: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Source" margin="dense" />}
          />
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === newFlight.destination)}
            onChange={(event, newValue) => {
              setNewFlight((prevFlight) => ({ ...prevFlight, destination: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Destination" margin="dense" />}
          />
          <TextField
            label="From"
            name="from"
            type="datetime-local"
            value={newFlight.from}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            name="to"
            type="datetime-local"
            value={newFlight.to}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newFlight.price}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Discounted Price"
            name="discountedPrice"
            type="number"
            value={newFlight.discountedPrice}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Flight</DialogTitle>
        <DialogContent>
           <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === editedFlight.source)}
            onChange={(event, newValue) => {
              setEditedFlight((prevFlight) => ({ ...prevFlight, source: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Source" margin="dense" />}
          />
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => option.label}
            value={airports.find((option) => option.value === editedFlight.destination)}
            onChange={(event, newValue) => {
              setEditedFlight((prevFlight) => ({ ...prevFlight, destination: newValue.value }));
            }}
            renderInput={(params) => <TextField {...params} label="Destination" margin="dense" />}
          />
          <TextField
            label="From"
            name="from"
            type="datetime-local"
            value={editedFlight.from ? format(new Date(editedFlight.from), "yyyy-MM-dd'T'HH:mm") : editedFlight.from}
            onChange={(e) => setEditedFlight({ ...editedFlight, from: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            name="to"
            type="datetime-local"
            value={editedFlight.from ? format(new Date(editedFlight.to), "yyyy-MM-dd'T'HH:mm") : editedFlight.from}
            onChange={(e) => setEditedFlight({ ...editedFlight, to: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={editedFlight.price}
            onChange={(e) => setEditedFlight({ ...editedFlight, price: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Discounted Price"
            name="discountedPrice"
            type="number"
            value={editedFlight.discountedPrice}
            onChange={(e) => setEditedFlight({ ...editedFlight, discountedPrice: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FlightManagePage;
