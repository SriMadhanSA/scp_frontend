import { useReducer } from 'react';

import LoginContext from './login-context';

const defaultLoginState = {
    isLoggedIn: false,
    userDetails: {},
    availableRewards: 0
};

const loginReducer = (state, action) => {
  if (action.type === 'LOGIN') {

    return {
      isLoggedIn: true,
      userDetails: action.user,
      availableRewards: 0
    };
  }

  if(action.type === 'ADDREWARD') {
     
    return {
      ...state,
      availableRewards: action.rewards
    };
  }

  if (action.type === 'LOGOUT') {
    return defaultLoginState;
  }

  return defaultLoginState;
};

const LoginProvider = (props) => {
  const [loginState, dispatchLoginAction] = useReducer(
    loginReducer,
    defaultLoginState
  );

  const addUserHandler = (user) => {
    dispatchLoginAction({ type: 'LOGIN', user: user });
  };

  const addRewardsHandler = (rewards) => {
    dispatchLoginAction({ type: 'ADDREWARD', rewards: rewards });
  }

  const removeUserHandler = () => {
    dispatchLoginAction({type: 'LOGOUT'});
  };

  const loginContext = {
    isLoggedIn: loginState.isLoggedIn,
    userDetails: loginState.userDetails,
    availableRewards: loginState.availableRewards,
    addUser: addUserHandler,
    removeUser: removeUserHandler,
    addRewards: addRewardsHandler
  };

  return (
    <LoginContext.Provider value={loginContext}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
