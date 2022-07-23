import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const OrderShow = ({order, currentUser}) => {
    const [timerUp, setTimerUp] = useState(0)
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    useEffect(()=>{
        const checkTime =  () => {
            const timerLeft = new Date(order.expiresAt )  - new Date();
            setTimerUp(Math.round(timerLeft / 1000));
        }
        checkTime();
        const timerId = setInterval(checkTime, 1000);
        return () => {clearInterval(timerId)}
    },[])
    if(timerUp < 0) return <div>Order Expired</div>
    return (
        <>
            <div>Order Show</div>
            <h1>Time to pay: {timerUp} sec</h1>
            <StripeCheckout
                token={(token) => doRequest({token: token.id})}
                stripeKey="pk_test_51LEhkYDGBBvTto15KED2Fowk4nV7j2lTn4FFUvvTvsjgwsdhY94fHimvrJc7tvvVSi5jnXByBRpBZEA1qS1xTn7t00obOz29JE"
                email={currentUser.email}
                amount={order.ticket.price * 100}
            />
            {errors}
        </>
    )
}
OrderShow.getInitialProps = async (context, client, currentUser) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`)
    return {order: data}
}
export default OrderShow;