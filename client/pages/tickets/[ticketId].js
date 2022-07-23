import  Router  from "next/router";
import useRequest from "../../hooks/use-request";
const TickedShow = ({ticket}) => {
    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>price: ${ticket.price}</h4>
            <button className="btn btn-primary" onClick={() =>doRequest()}>Create Ticket</button>
            {errors}
        </div>
    );
}
TickedShow.getInitialProps = async (context, client, currentUser) => {
    const {ticketId} = context.query;
    const {data} = await client.get(`/api/tickets/${ticketId}`)
    return {ticket: data}
}
export default TickedShow;