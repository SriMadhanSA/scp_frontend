import { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Layout/Header';
import Cloths from './components/Cloths';
import Cart from './components/Cart/Cart';
import Profile from './components/Cart/Profile';
import CartProvider from './store/CartProvider';
import LoginContext from './store/login-context';
import { useNavigate } from "react-router-dom";

function App() {
  const [cartIsShown, setCartIsShown] = useState(false);
  const [profileIsShown, setProfileIsShown] = useState(false);
  const loginCtx = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!loginCtx.isLoggedIn){
      const user = sessionStorage.getItem('login');
      if(user){
          loginCtx.addUser(JSON.parse(user));
      } else {
        navigate('/');
      }
    }
  },[]);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  const showProfileHandler = () => {
    setProfileIsShown(true);
  };

  const hideProfileHandler = () => {
    setProfileIsShown(false);
  };
  return (
    <CartProvider>
      {cartIsShown && <Cart onClose={hideCartHandler} />}
      <Profile onClose={hideProfileHandler} show={profileIsShown}/>
      <Header onShowCart={showCartHandler} onShowProfile={showProfileHandler}/>
      <main>
        <Cloths />
      </main>
    </CartProvider>
  );
}

export default App;
