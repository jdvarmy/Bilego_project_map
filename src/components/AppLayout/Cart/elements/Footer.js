import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { $css, StyledButton } from '../../../styles/defaults';
import Informer from '../../Informer/Informer';

const Wrapper = styled('div')`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
`;
const Button = styled(StyledButton)`
    padding: 8px 20px;
    height: 46px;
    &.ant-btn:focus{
        background-color: ${$css.colors.green};
    }
`;
const TotalOrderWrap = styled('div')`
    text-align: right;
    padding: 15px 20px;
    border-bottom: 1px solid ${$css.colors.rgbaBorder};
    margin-bottom: 15px;
`;
const TotalOrder = styled('div')`
    white-space: nowrap;
    word-spacing: -2px;
    font-size: 20px;
    line-height: 21px;
    font-weight: 700;
`;
const Meta = styled('div')`
    color: ${$css.colors.darkGrey};
    clear: both;
    font-size: 11px;
    line-height: 13px;
`;
const Link = styled('a')`
    color: ${$css.colors.green};
    text-decoration: none;
    outline: none;
    transition: color ${$css.animation.duration}ms;
    &:hover{
        color: ${$css.colors.orange}
    }
`;
const Left = styled('div')`${p=>p.isSmallScreen && `margin-left: 15px;`}`;
const Right = styled('div')`${p => p.isSmallScreen && `margin-right: 15px;`}`;

@inject('cartStore', 'basketStore', 'serverDataStore', 'dataStore')
@observer
class Footer extends React.Component{
    close = () => {
        const { cartStore:{ clear } } = this.props;
        clear();
    };

    pay = () => {
        const { cartStore:{ formValid, showHidePay } } = this.props;
        if(!formValid){
            Informer({
                title: 'Опаньки!',
                text: 'Вы забыли ввести свой Email. Куда же нам отправить ваши билеты?'
            });
            return;
        }
        showHidePay();

        const { basketStore:{ ticketsMap }, serverDataStore:{ getCheckoutData }, cartStore:{ email } } = this.props;
        let items = [];
        ticketsMap.forEach(el=>{
            items.push({
                product_id: el.id,
                quantity: el.count,
                variation_id: '',
            });
        });

        const request = {
            'payment_method': 'fondy',
            'set_paid': true,
            'billing': {
                'email': email
            },
            'line_items': items,
        };
        getCheckoutData(request);
    };

    render(){
        const { cartStore:{ city, total }, dataStore: {isSmallScreen} } = this.props,
            href = `https://${city}.bilego.ru/offer/`;

        return(
            <Wrapper>
                <TotalOrderWrap>
                    <TotalOrder>{total}</TotalOrder>
                    <Meta>Нажимая кнопку «перейти к оплате», <Link href={href} target="_blank">вы соглашаетесь с условиями оферты</Link></Meta>
                </TotalOrderWrap>
                <Right isSmallScreen={isSmallScreen}>
                    <Button type="primary" onClick={this.pay}>Перейти к оплате</Button>
                </Right>
                <Left isSmallScreen={isSmallScreen}>
                    <Button type="default" onClick={this.close}>Назад</Button>
                </Left>
            </Wrapper>
        );
    }
}

export default Footer;