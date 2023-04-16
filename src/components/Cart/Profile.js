import React, { useEffect, useState, useContext } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

import RewardItem from './RewardItem';
import classes from './Profile.module.css';
import LoginContext from '../../store/login-context';
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
  const [rewards, setRewards] = useState([]);
  const [redeem, setRedeem] = useState(0);
  let totalRewards = 0;

  const loginCtx = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://tyidl9uarf.execute-api.us-east-1.amazonaws.com/getreward?id=${loginCtx.userDetails.Uid}&producttype=cloth`)
      .then(response => response.json())
      .then(rewards => {
        setRewards(rewards['rewards']);
        setRedeem(rewards['redeem']);
      });
  }, [])

  useEffect(() => {
    loginCtx.addRewards(totalRewards - redeem)
  }, [redeem])

  const logoutHandler = () => {
    loginCtx.removeUser();
    sessionStorage.clear();
    navigate('/');
  }

  const rewardItems = (
    <table>
      <tr>
        <th>OrderID</th>
        <th>Order Amount</th>
        <th>Reward Earned</th>
      </tr>
      {rewards.map((item, index) => {
        totalRewards = totalRewards + item.rewards;
        if (index >= rewards.length - 5) {
          return (
            <RewardItem
              key={item.oid}
              orderId={item.oid}
              orderTotal={item.ordertotal}
              rewardsEarned={item.rewards}
            />
          )
        }
      })}
    </table>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      <button className={classes.button} onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );

  return (
    <React.Fragment>
      <div className={classes.total}>
        <span className={classes.title}>Total Rewards Earned</span>
        <span>{totalRewards}</span>
      </div>
      <div className={classes.total}>
        <span className={classes.title}>Available Rewards</span>
        <span>{loginCtx.availableRewards}</span>
      </div>
      <h2 className={classes.title}> Last 5 Rewards Details</h2>
      {rewardItems}
      {modalActions}
    </React.Fragment>
  );
};

const ProfileCanvas = (props) => {
  return (<Offcanvas show={props.show} onHide={props.onClose} placement='end'>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Rewards</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <Profile onClose={props.onClose}/>
    </Offcanvas.Body>
  </Offcanvas>
  )
}
export default ProfileCanvas;
