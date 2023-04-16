import { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import Card from '../UI/Card';
import ClothItem from './ClothItem';
import classes from './AvailableCloths.module.css';
import CartContext from '../../store/cart-context';
import LoginContext from '../../store/login-context';

const AvailableCloths = () => {
  const [cloths, setcloths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const cartCtx = useContext(CartContext);
  const loginCtx = useContext(LoginContext);

  useEffect(() => {
    const fetchcloths = async () => {
      const userJson = sessionStorage.getItem('login');
      let user;
      if(userJson){
        user = JSON.parse(userJson)
      }
      //https://bwb2dm566c.execute-api.us-east-1.amazonaws.com/listproducts
      const clothResponse = await fetch(
        'https://bwb2dm566c.execute-api.us-east-1.amazonaws.com/listproducts'
      );
      const cartresponse = await fetch(
        `https://qz7sjegncd.execute-api.us-east-1.amazonaws.com/getc?id=${loginCtx.userDetails.Uid || user.Uid}&producttype=cloth`
      )

      if (!clothResponse.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await clothResponse.json();
      const cartData = await cartresponse.json();

      for (const key in cartData){
        const item = {
          cartid: cartData[key].cid,
          id: cartData[key].pid,
          name: responseData[cartData[key].pid].name,
          amount: cartData[key].quantity,
          price: responseData[cartData[key].pid].price
        }
        cartCtx.fetchCartItems(item);
      }

      const loadedcloths = [];

      for (const key in responseData) {
        loadedcloths.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
          image: responseData[key].image
        });
      }

      setcloths(loadedcloths);
      setIsLoading(false);
    };

    fetchcloths().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.clothsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.clothsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const clothsList = cloths.map((cloth) => (
    <ClothItem
      key={cloth.id}
      id={cloth.id}
      name={cloth.name}
      description={cloth.description}
      price={cloth.price}
      image={cloth.image}
    />
  ));

  return (
    <section className={classes.cloths}>
      <Card>
        <Row xs={1} md={3} className="g-4">
          {clothsList}
        </Row>
      </Card>
    </section>
  );
};

export default AvailableCloths;
