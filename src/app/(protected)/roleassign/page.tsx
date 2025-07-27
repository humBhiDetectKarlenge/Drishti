'use client';

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

interface User {
  uid: string;
  displayName: string;
  email: string;
  userType: string;
}

const ROLE_OPTIONS = ['crowd', 'doctor', 'police', 'help', 'security'];

export default function RoleAssignPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const fetched = snapshot.docs.map((docSnap) => ({
          uid: docSnap.id,
          ...(docSnap.data() as Omit<User, 'uid'>),
        }));
        setUsers(fetched);
        setFilteredUsers(fetched);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUsers(
      users.filter((u) => u.email.toLowerCase().includes(lower))
    );
  }, [search, users]);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { userType: newRole });

      setUsers((prev) =>
        prev.map((user) =>
          user.uid === uid ? { ...user, userType: newRole } : user
        )
      );
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Role Assignment
      </Typography>

      <TextField
        label="Search by email"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredUsers.map((user) => (
            <div key={user.uid}>
              <ListItem
                secondaryAction={
                  <Select
                    value={user.userType}
                    size="small"
                    onChange={(e) =>
                      handleRoleChange(user.uid, e.target.value)
                    }
                    sx={{ minWidth: 120 }}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                }
              >
                <ListItemText
                  primary={user.displayName || user.email}
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </Container>
  );
}
