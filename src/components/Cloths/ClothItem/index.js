import { useContext } from 'react';
import Card from 'react-bootstrap/Card';

import ClothItemForm from './ClothItemForm';
import classes from './ClothItem.module.css';
import CartContext from '../../../store/cart-context';
import Col from 'react-bootstrap/Col';

const ClothItem = (props) => {
  const cartCtx = useContext(CartContext);

  const price = `$${props.price.toFixed(2)}`;

  const addToCartHandler = amount => {
    cartCtx.addItem({
      id: props.id,
      name: props.name,
      amount: amount,
      price: props.price
    });
  };

  return (
    <Col>
      <Card style={{ width: '16rem' }}>
        <Card.Img variant="top" src={props.image} style={{height: '16rem'}}/>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>
            <div className={classes.description}>{props.description}</div>
            <div className={classes.price}>{price}</div>
          </Card.Text>
          <ClothItemForm onAddToCart={addToCartHandler} />
        </Card.Body>
      </Card>
    </Col>
  )
}
export default ClothItem;
