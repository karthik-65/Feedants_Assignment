import React, { createContext, useContext, useState, useEffect } from 'react';
import { competitionApi } from '../api/competitionApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userList = await competitionApi.getDemoUsers();
      setUsers(userList);
      if (userList.length > 0 && !currentUser) {
        // Default to first user (Ananya Sharma - registered)
        setCurrentUser(userList[0]);
      }
    } catch (err) {
      console.warn('Failed to load users from backend:', err.message);
      // Fallback mock user if backend not reached yet
      const fallbackUser = {
        _id: '67890abcdef1234567890abc',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com'
      };
      setUsers([fallbackUser]);
      setCurrentUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ users, currentUser, switchUser, refreshUsers: fetchUsers, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
