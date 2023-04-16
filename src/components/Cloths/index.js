import { Fragment } from 'react';

import ClothsSummary from './ClothsSummary';
import AvailableCloths from './AvailableCloths';

const Cloths = () => {
  return (
    <Fragment>
      <ClothsSummary />
      <AvailableCloths />
    </Fragment>
  );
};

export default Cloths;
