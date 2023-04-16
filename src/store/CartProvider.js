import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === 'FETCH') {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === 'ADD') {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
      fetch('https://rz8h1amav8.execute-api.us-east-1.amazonaws.com/updatecart',{
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type':'application/json'
      },
      body : JSON.stringify({cid: updatedItem.cartid, quantity: updatedItem.amount})
    });
    } else {
      updatedItems = state.items.concat(action.item);
      const userJson = sessionStorage.getItem('login');
      let user;
      if(userJson){
        user = JSON.parse(userJson)
      }
      fetch('https://xhlrgkk5za.execute-api.us-east-1.amazonaws.com/addtocart',{
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type':'application/json'
      },
      body : JSON.stringify({uid: user.Uid, pid: action.item.id, quantity: '1', product: 'cloth'})
    }).then((response)=>{
      return response.json();
    }).then((cart)=>{
      action.item.cartid = cart.cart_id;
    });
  }
    

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id);
      fetch('https://jya0q4i8q3.execute-api.us-east-1.amazonaws.com/deletecart',{
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type':'application/json'
      },
      body : JSON.stringify({cid: existingItem.cartid})
    })
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
      fetch('https://rz8h1amav8.execute-api.us-east-1.amazonaws.com/updatecart',{
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type':'application/json'
      },
      body : JSON.stringify({cid: updatedItem.cartid, quantity: updatedItem.amount})
    });
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
  }

  if(action.type === 'REDEEM') {
    const oldTotalAmount = state.totalAmount;

    return {
      ...state,
      totalAmount: oldTotalAmount - action.redeemAmount
    }
  }

  if (action.type === 'CLEAR') {
    return defaultCartState;
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const fetchCartItemsHandler = (item) => {
    dispatchCartAction({ type: 'FETCH', item: item });
  }

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({type: 'CLEAR'});
  };

  const redeemAmountHandler = (redeemAmount) => {
    dispatchCartAction({type: 'REDEEM', redeemAmount: redeemAmount});
  }

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler,
    fetchCartItems: fetchCartItemsHandler,
    redeemAmount: redeemAmountHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
