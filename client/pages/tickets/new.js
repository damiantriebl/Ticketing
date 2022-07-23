import { useState } from "react";
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
 
const newTickets = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: () => Router.push('/')

    });

    const handlerOnBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
           return;
        }
        setPrice(value.toFixed(2));
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        doRequest();
    }
    return (
        <>
            <h1>New Tickets</h1>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <label>
                        Title:
                        <input type="text" onChange={(e)=>setTitle(e.currentTarget.value)} value={title} className="form-control" name="title" />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Price:
                        <input type="text" className="form-control" onBlur={handlerOnBlur} onChange={(e)=>setPrice(e.currentTarget.value)} value={price} name="price" />
                    </label>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Create Ticket</button>
                </div>
                {errors}
            </form>
        </>
    )
}

export default newTickets;