import React, {useState, useContext} from "react";
import classes from "./Redeem.module.css"
import LoginContext from "../../store/login-context";

const Redeem = ({onRedeem}) =>{
    const loginCtx = useContext(LoginContext);
    const [redeemAmount, setRedeemAmount] = useState(loginCtx.availableRewards);
    

    return <>
        <div className={classes.total}>
            <span>Available Rewards</span>
            <span>{loginCtx.availableRewards}</span>
        </div>
        <div className={classes.actions}    >
            <input type="text" className={classes.input} value={redeemAmount} onChange={(event)=>setRedeemAmount(event.target.value)} />
            <button type="button" className={classes.button} onClick={()=>onRedeem(redeemAmount)}>Redeem Now</button>
        </div>
    </>
}

export default Redeem;