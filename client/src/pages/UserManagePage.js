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
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserManagePage() {
  const [users, setUsers] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const userList = await response.json();
        setUsers(userList);
      } else {
        console.error('Failed to fetch user data');
        toast.error('Failed to load users list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [] /* run only on first render of the component */)


  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('User deleted!');
        fetchUsers();
      } else {
        console.error('Delete request failed');
        toast.error('Failed to delete the user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete the user');
    }
  };


  // new user dialog - START --------------------------------------

  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', role: '', password: '' });

  const handleCreateUser = () => {
    setOpenNewUserDialog(true);
  };

  const handleCloseNewUserDialog = () => {
    setOpenNewUserDialog(false);
    setNewUser({ email: '', role: '', password: '' });
  };

  const handleDialogInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleDialogCreate = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        // If create API call is successful, refresh the user list
        toast.success('User created!');
        fetchUsers();
        handleCloseNewUserDialog();
      } else {
        console.error('Create request failed');
        toast.error('Failed to create the user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create the user');
    }
  };

  // new user dialog - END --------------------------------------


  // edit user dialog - START -----------------------------------

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUserId(null);
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user._id === userId);
    setEditingUserId(userId);
    setEditedUser({ ...userToEdit });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/users/${editingUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        await fetchUsers(); // Fetch updated user list
        toast.success('User updated successfully');
        handleCloseEditDialog();
      } else {
        console.error('Edit request failed');
        toast.error('Failed to update the user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update the user');
    }
  };

  // edit user dialog - END -----------------------------------

  return (
    <div>
      <h1>User List</h1>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateUser}>
        Create User
      </Button>
      <ToastContainer position="top-right" autoClose={5000} />
      {loading ? (
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
        ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(typeof users === 'undefined') ? (
              <p>Loading...</p>
              ) : (
              users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}>
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
      <Dialog open={openNewUserDialog} onClose={handleCloseNewUserDialog}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Role"
            name="role"
            value={newUser.role}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleDialogInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewUserDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            name="email"
            value={editedUser.email || ''}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Role"
            name="role"
            value={editedUser.role || ''}
            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            name="password"
            value={editedUser.password || ''}
            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
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

export default UserManagePage;
