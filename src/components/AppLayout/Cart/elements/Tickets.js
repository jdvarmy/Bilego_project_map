import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import Ticket from './Ticket';
import { inject, observer } from 'mobx-react';

const Wrapper = styled(Scrollbars)`
    max-height: 239px;
`;

@inject('cartStore', 'serverDataStore')
@observer
class Tickets extends React.Component{
    render(){
        const { cartStore: { tickets }, serverDataStore: { coupon } } = this.props;

        return(
            <Wrapper>
                {tickets && tickets.map( (ticket) => {
                    const couponTicket = (Array.isArray(coupon?.tickets) && coupon.tickets.find(t => t.id === ticket.id));
                    const realTicket =  couponTicket ? { ...ticket, price: couponTicket.total } : ticket;

                    return <Ticket ticket={realTicket} key={realTicket.id} />
                } )}
            </Wrapper>
        );
    }
}

export default Tickets;
