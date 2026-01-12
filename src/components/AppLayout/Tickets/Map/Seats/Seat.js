import React from 'react'
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { getStrEnding } from '../../../functions/functions';
import Informer from '../../../Informer/Informer';
import { SeatStore } from '../stores/SeatStore';
import { TooltipSeat } from '../Tooltip/TooltipSeat';
import { TooltipPath } from '../Tooltip/TooltipPath';
import { $css } from '../../../../styles/defaults';

const Wrapper = styled('g')``;

const Circle = styled('circle')`
    transition: all 0.1s cubic-bezier(0.39, 0.575, 0.565, 1);
    ${props => props.showText && `
        cursor: pointer;
        filter: drop-shadow( 0px 0px 10px rgba(0,0,0,.1) );`
    }
`;

const Text = styled('text')`
    text-anchor: middle;
    dominant-baseline: middle;
    font-weight: 700;
    fill: #fff;
    cursor: pointer;
`;

@inject('serverDataStore', 'mapStore', 'basketStore', 'dataStore')
@observer
class Seat extends React.Component {
    constructor(props){
        super(props);
        const { id, serverDataStore:{ data: { tickets, ticketcloud } }, el:{name}, row, sector } = props;

        this.seatStore = new SeatStore();
        if( ticketcloud ) {
            this.seatStore.initTicketCloud({name, row, sector, tickets});
        }else {
            this.seatStore.init({id, name, tickets});
        }

        if( this.seatStore.ticket && Array.isArray(this.seatStore.ticket) && 'with_map_sector' === this.seatStore.ticket[0].type ) {
            this.seatStore.addSpecialType();
        }
        this.scale = 1;
    }

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
        const { specialType, ticket } = this.seatStore,
            el = this.el;

        if( this.el && ticket && !Array.isArray(ticket) && !specialType) {
            const { price, price_regular, sector_name, row_name, seat_name } = ticket;

            this.tooltip = new TooltipSeat({price, price_regular, sector_name, row_name, seat_name, el});
        }else if(ticket && Array.isArray(ticket) && specialType){
            const text = 'Входные билеты';
            this.tooltip = new TooltipPath({el, ticketArr: ticket, text});
        }
    }

    handlerHover = () => {
        if(this.seatStore.ticket) {
            const { dataStore:{ isSmallScreen } } = this.props;

            this.scale = this.props.mapStore.scale;
            !isSmallScreen && this.seatStore.onEnter();

            const errorY = this.seatStore.click ? 0 : - 2 * this.scale;
            !isSmallScreen && this.tooltip.create( errorY );
        }
    };

    handlerUnhover = () => {
        this.seatStore.onOver();
        if(this.seatStore.ticket) this.tooltip.delete();
    };

    handlerClick = () => {
        const { onClick, ticket, click } = this.seatStore;
        const { basketStore:{ isFull, toBasket, maxCountInBasket, tickets }, serverDataStore:{ data:{ ticketcloud } } } = this.props;

        if( !click && isFull )
            Informer({
                title: 'Опаньки!',
                text: `В одном заказе можно купить только ${maxCountInBasket} ${getStrEnding(maxCountInBasket, ['билет','билета','билетов'])}.`
            });
        if( (!click && !isFull) || ((click && !isFull)) || (click && isFull) ) {
            if(ticketcloud) {
                if(tickets[0] && tickets[0].type !== ticket.type) {
                    Informer({
                        title: 'Как жаль!',
                        text: `Для данного события установлены ограничения. В один заказ вы можете добавить билеты только одного типа.`
                    });
                    return;
                }
            }
            onClick();
            toBasket(ticket, this.seatStore.click, this.seatStore);
        }
    };

    handlerSpecialClick = () => {
        const { basketStore:{ getModalTickets } } = this.props;
        const { ticket } = this.seatStore;

        getModalTickets(ticket);
    };

    findTicketInBascket = () => {
        const { ticket } = this.seatStore;
        let t = 0;
        this.props.basketStore.ticketsMap.forEach(e => {
            if(Array.isArray(ticket)){
                // eslint-disable-next-line array-callback-return
                ticket.map(k=>{
                    if(e.id === k.id)
                        t += e.count;
                });
            }else{
                if (e.id === ticket.id)
                    t = e.count
            }
        });
        return t;
    };

    render(){
        const {el: {cx, cy, r, name, comp}, id} = this.props;
        const { hover, ticket, click, specialType } = this.seatStore;
        const scale = this.scale;
        let text, radius, style;

        if( ticket ) {
            text = <Text fontSize={(r*1.8 + scale*2.2).toFixed(2)} x={cx} y={(+cy + 2.4*scale).toFixed(2)}>
                {ticket.seat_name}
            </Text>;

            if ( (click && hover) || click ) {
                radius = (r*1.3).toFixed(2);
                style = {fill: 'white', stroke: ticket.color, strokeWidth: `${r}px`}
            }else if( hover ){
                radius = (r*1.8).toFixed(2);
                style = {fill: ticket.color};
            }else{
                radius = r;
                style = {fill: ticket.color};
            }
        }else{
            radius = (r*0.6).toFixed(2);
            style = {fill: $css.colors.grey};
        }

        if(specialType){
            const ticketInBasket = this.findTicketInBascket();
            style = Array.isArray(ticket) && ticket.length===1 && ticket[0].color ? {fill: ticket[0].color} : {fill: $css.colors.url.candy};

            if(ticketInBasket) {
                text = (<Text fontSize={(r * 1.8 + scale * 2.2).toFixed(2)} x={cx} y={(cy * 1 + 2.4 * scale).toFixed(2)}>
                    {ticketInBasket}
                </Text>);
                radius = (r * 1.9).toFixed(2);
            }
        }

        let haveTickets;
        if( ticket !== undefined ) {
            haveTickets =
              Array.isArray(ticket)
                ? ticket.filter(e => e.stock > 0).length > 0
                : ticket.stock > 0;
        }

        if(!haveTickets){
            radius = (r*0.6).toFixed(2);
            style = {fill: $css.colors.grey};
        }

        return (
            <Wrapper
                data-name={name}
                data-component={comp}
                onMouseEnter={this.handlerHover}
                onMouseLeave={this.handlerUnhover}
                onClick={ !specialType ? this.handlerClick : this.handlerSpecialClick}
            >
                <Circle
                    id={id}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    style={style}
                    showText={click || hover}
                />
                {(!click && hover && !specialType) && text}
                {specialType && text}
            </Wrapper>
        )
    }
}

export default Seat;

