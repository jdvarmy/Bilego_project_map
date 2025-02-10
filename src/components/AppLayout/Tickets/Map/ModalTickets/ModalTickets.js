import React, { Fragment } from 'react';
import { $css, StyledModal, StyledBoxButton } from '../../../../styles/defaults';
import { inject, observer } from 'mobx-react';
import {getStrEnding, moneyFormating} from '../../../functions/functions';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import Informer from '../../../Informer/Informer';

const Font = styled('div')`
    font-size: 18px;
    color: ${$css.colors.black};
`;
const Number = styled(Font)`
    display: inline-block;
    margin: 0 15px;
    font-size: 20px;
    font-weight: 600;
`;
const UpFont = styled(Font)`
    font-weight: 500;
`;
const LoFont = styled('div')`
    font-size: 11px;
`;
const Wrapper = styled(Row)`
    padding: 10px 0;
`;
const Modal = styled(StyledModal)`
    & .ant-modal-body{
        padding: 14px 24px;
    }
`;

@inject('basketStore', 'serverDataStore')
@observer
class ModalTickets extends React.Component{
    getTicketById = id => {
        let nodes = [];
        const { basketStore:{ tickets } } = this.props;
        // eslint-disable-next-line array-callback-return
        tickets.map(ticket=>{
            if(ticket.id === id) nodes.push(ticket)
        });

        return nodes;
    };

    plus = (el) => (event) => {
        const { basketStore:{ toBasket, isFull, maxCountInBasket, tickets }, serverDataStore:{ data:{ ticketcloud } } }  = this.props;
        if( isFull ){
            Informer({
                title: 'Опаньки!',
                text: `В одном заказе можно купить только ${maxCountInBasket} ${getStrEnding(maxCountInBasket, ['билет','билета','билетов'])}.`
            });
        }
        if(ticketcloud) {
            if(tickets && Array.isArray(tickets) && tickets.length>0 && tickets[0] && tickets[0].type !== el.type) {
                Informer({
                    title: 'Как жаль!',
                    text: `Для данного события установлены ограничения. В один заказ вы можете добавить билеты только одного типа.`
                });
                return;
            }
        }

        toBasket( el, true );
    };

    minus = (el) => (event) => {
        const { basketStore:{ toBasket } } = this.props;
        toBasket( el, false );
    };

    render(){
        const { basketStore: { modalTickets, closeModalTickets, setOfTicket, isFull } } = this.props;

        return(
            <Modal
                visible={modalTickets}
                centered
                onOk={closeModalTickets}
                onCancel={closeModalTickets}
                footer={null}
                width={345}
                title={(Array.isArray(setOfTicket) && setOfTicket.length > 0) && (setOfTicket.length===1 ? setOfTicket[0].name : 'Входные билеты')}
                icon={<Icon type="plus" />}
                iconType='close-circle'
                closeIcon={<Icon type="plus" style={{transform: 'rotate(45deg) scale(1.3)'}} />}
            >
                {setOfTicket && setOfTicket.map( el => {
                    const ticket = this.getTicketById(el.id);
                    const disabledMinus = ticket.length <= 0;
                    const disabledPlus = isFull || ticket.length >= el.stock;

                    return <Fragment key={el.id}>
                        <Wrapper align='middle' justify='center'>
                            <Col span={12}>
                                <UpFont>{moneyFormating(el.price, true)}</UpFont>
                                <LoFont>{setOfTicket.length===1 ? 'Пригласительный билет' : el.name}</LoFont>
                            </Col>
                            <Col span={12}>
                                <StyledBoxButton disabled={disabledMinus} onClick={this.minus(el)}><Icon
                                  type="minus"/></StyledBoxButton>
                                <Number><span>{ticket.length}</span></Number>
                                <StyledBoxButton disabled={disabledPlus} onClick={this.plus(el)}><Icon
                                  type="plus"/></StyledBoxButton>
                            </Col>
                        </Wrapper>
                    </Fragment>
                })
                }
            </Modal>
        );
    }
}

export default ModalTickets;
