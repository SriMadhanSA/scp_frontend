import { Fragment } from 'react';

import HeaderCartButton from './HeaderCartButton';
import ProfileButton from './ProfileButton';
import clothsShoppingImage from '../../assets/onlineShopping.jpg';
import classes from './Header.module.css';

const Header = (props) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1 className={classes.title}>Clothing Air</h1>
        <HeaderCartButton onClick={props.onShowCart} />
        <ProfileButton onClick={props.onShowProfile}/>
      </header>
      <div className={classes['main-image']}>
        <img src={clothsShoppingImage} alt='Fantastic cloths!' />
      </div>
    </Fragment>
  );
};

export default Header;
