import React, { useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';
import LoginContext from '../../store/login-context';
import Redeem from './Redeem';
import Card from '../UI/Card';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [redeemId, setRedeemId] = useState(0);
  const cartCtx = useContext(CartContext);
  const loginCtx = useContext(LoginContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  useEffect(()=>{
    if(redeemAmount !== 0){
      fetch(`https://lb87cwbbr8.execute-api.us-east-1.amazonaws.com/Redeem?id=${loginCtx.userDetails.Uid}&producttype=cloth`, {
        method: 'POST',
        mode: 'cors',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          rewards: redeemAmount
        }),
      }).then(response=>response.json()).then(redeemId => setRedeemId(redeemId));
      cartCtx.redeemAmount(redeemAmount);
      loginCtx.addRewards(loginCtx.availableRewards - redeemAmount);
    }
  },[redeemAmount])

  useEffect(()=>{
    fetch(`https://tyidl9uarf.execute-api.us-east-1.amazonaws.com/getreward?id=${loginCtx.userDetails.Uid}&producttype=cloth`)
    .then(response => response.json())
    .then(res => {
      let totalRewards =0;
    res.rewards.map((item) => {
      totalRewards = totalRewards + item.rewards;
    });
    loginCtx.addRewards(totalRewards - res.redeem);
    });
  },[])

  const CancelHandler = () =>{
    props.onClose();
    loginCtx.addRewards(loginCtx.availableRewards + redeemAmount);
    cartCtx.redeemAmount(-redeemAmount);
  }

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    console.log(cartCtx.items)
    await fetch('https://wh4ynquypf.execute-api.us-east-1.amazonaws.com/placeorder', {
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items,
        orderedAmount: cartCtx.totalAmount,
        uid: loginCtx.userDetails.Uid,
        product: 'cloth',
        redeemid: redeemId
      }),
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <Card>
    <Row xs={1} md={3} className="g-4">
    {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </Row>
  </Card>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartCtx.items.length > 0 && cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (<>
        <Redeem onRedeem={(redeemAmount)=>setRedeemAmount(redeemAmount)}/>
        <Checkout onConfirm={submitOrderHandler} onCancel={CancelHandler} />
        </>
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
