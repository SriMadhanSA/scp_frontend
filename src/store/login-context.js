import React from 'react';

const LoginContext = React.createContext({
  isLoggedIn: false,
  userDetails: {},
  availableRewards: 0,
  addUser: (user) => {},
  removeUser: () => {},
  addRewards: (rewards) => {}
});

export default LoginContext;