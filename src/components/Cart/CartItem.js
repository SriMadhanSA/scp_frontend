import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import classes from './CartItem.module.css';

const CartItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;

  return (
    <Col>
      <Card style={{ width: '12rem' }}>
        <Card.Body>
          <Card.Title>
            {props.name}
          </Card.Title>
          <Card.Text>
            <div className={classes.summary}>
              <span className={classes.price}>{price}</span>
              <span className={classes.amount}>x {props.amount}</span>
            </div>
          </Card.Text>
          <div className={classes.actions}>
            <button onClick={props.onRemove}>−</button>
            <button onClick={props.onAdd}>+</button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CartItem;
