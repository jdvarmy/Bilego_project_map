import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { $css, StyledButton } from '../../../styles/defaults';
import Informer from '../../Informer/Informer';
import { Input, Icon } from 'antd';
import {couponStatusData} from "../../../stores/ServerDataStore";
import {moneyFormating} from "../../functions/functions";

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
    text-align: left;
    margin: 0.25em auto;
`;
const Link = styled('a')`
    color: ${$css.colors.red};
    text-decoration: none;
    outline: none;
    transition: color ${$css.animation.duration}ms;
    &:hover{
        color: ${$css.colors.red}
    }
`;
const Left = styled('div')`${p=>p.isSmallScreen && `margin-left: 15px;`}`;
const Right = styled('div')`${p => p.isSmallScreen && `margin-right: 15px;`}`;
const Promo = styled(Input.Search)`
    width: 40%;
    margin-bottom: 0.5rem;
    & .ant-btn-primary {
        background-color: ${$css.colors.red};
        border-color: ${$css.colors.red};
    }
`;
const PromoMeta = styled('div')`
    clear: both;
    font-size: 13px;
    line-height: 13px;
    text-align: right;
    margin: 0.5rem auto;
    ${props => props.color === 'success' ? `color: ${$css.colors.green}` : `color: ${$css.colors.red}`};
`;

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

        const { basketStore:{ ticketsMap }, serverDataStore:{ getCheckoutData, coupon }, cartStore:{ email } } = this.props;
        const items = [];
        ticketsMap.forEach(el=>{
            items.push({
                product_id: el.id,
                quantity: el.count,
                variation_id: '',
            });
        });

        const request = {
            'payment_method': 'tinkoff',
            'set_paid': true,
            'billing': {
                'email': email
            },
            'line_items': items,
            coupon: coupon?.coupon,
        };
        getCheckoutData(request);
    };

    promoHandler = (value) => {
        const { basketStore:{ ticketsMap }, serverDataStore:{ getCouponData, clearCouponData, couponStatus } } = this.props;

        if (couponStatus) {
            clearCouponData()
        } else {
            const items = [];
            ticketsMap.forEach(el=>{
                items.push({
                    product_id: el.id,
                    quantity: el.count,
                    variation_id: '',
                });
            });

            getCouponData(value, items)
        }
    }

    render(){
        const { cartStore:{ city, total }, dataStore: { isSmallScreen }, serverDataStore: { coupon, isLoading, couponStatus, setCouponValue, couponValue } } = this.props,
            href = `https://bilego.ru/${city}/offer/`;

        return(
            <Wrapper>
                <TotalOrderWrap>
                    {couponStatus && <PromoMeta color={couponStatus === couponStatusData.success ? 'success' : 'error'}>{couponStatus}</PromoMeta>}
                    <Promo
                      readOnly={!!couponStatus}
                      loading={isLoading}
                      placeholder="Промо код"
                      onSearch={this.promoHandler}
                      onPressEnter={this.promoHandler}
                      value={couponValue}
                      onChange={(e) => setCouponValue(e.target?.value)}
                      enterButton={!!couponStatus ? <Icon type="close-circle" /> : <Icon type="tag" />}
                    />
                    <TotalOrder>{coupon ? moneyFormating(coupon?.total, true) : total}</TotalOrder>
                    <Meta>Нажимая кнопку «перейти к оплате», <Link href={href} target="_blank">вы соглашаетесь с условиями оферты</Link></Meta>
                </TotalOrderWrap>
                <Right isSmallScreen={isSmallScreen}>
                    <Button disabled={isLoading} type="primary" onClick={this.pay}>Перейти к оплате</Button>
                </Right>
                <Left isSmallScreen={isSmallScreen}>
                    <Button type="default" onClick={this.close}>Назад</Button>
                </Left>
            </Wrapper>
        );
    }
}

export default Footer;
