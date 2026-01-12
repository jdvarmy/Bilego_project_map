import React from 'react';
import styled from 'styled-components';
import { moneyFormating } from '../functions/functions';
import { inject, observer } from 'mobx-react';
import { $css } from '../../styles/defaults';

const Wrapper = styled('div')`
    width: ${ props=>props.shiftPercent }%;
    position: relative;
    box-sizing: border-box;
    display: inline-block;
`;

const Container = styled('div')`
    margin: -13px -13px -13px 0px;
    min-height: 90px;
    width: ${p=>p.isSmallScreen ? 118 : 152}px;
    position: absolute;
    top: 0px;
    right: ${props=>props.shiftRight}px;
    box-sizing: content-box;
    background: ${$css.colors.white};
    border-width: 1px 1px 0px;
    border-style: solid solid solid;
    border-color: ${$css.colors.rgbaBorder} ${$css.colors.rgbaBorder};
    border-image: initial;
    border-bottom: 0px;
    padding: 12px 24px;
    text-align: right;
    transition: all ${$css.animation.durationfast}ms ${$css.animation.timeFunction} 0s;
    &:hover{
        border-color: ${$css.colors.red} ${$css.colors.red};
        margin-top: -29px;
        box-shadow: ${$css.shadow.style2};
        z-index: 1;
    }
    &:hover b{
        display: block;
    }
`;
const ContentWrapper = styled('div')`
    color: ${$css.colors.black};
    font-size: 15px;
    line-height: 19px;
    padding-top: 4px;
`;

const Sector = styled('div')`
    padding-top: 4px;
    color: ${$css.colors.darkGrey};
    font-size: 13px;
    line-height: 18px;
`;
const RowSeat = styled(ContentWrapper)`
    font-size: 14px;
`;
const Money = styled(ContentWrapper)`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    & > span{
        white-space: nowrap;
        word-spacing: -2px;
        padding-right: 1px;
    }
    & > div{
        font-size: 12px;
        white-space: nowrap;
        word-spacing: -2px;
        padding-right: 1px;
    }
`;
const Remover = styled('b')`
    width: 26px;
    height: 26px;
    display: none;
    background-color: ${$css.colors.red};
    cursor: pointer;
    position: absolute;
    top: -8px;
    left: -8px;
    overflow: hidden;
    background-position: 50% center;
    background-repeat: no-repeat;
    border-radius: 100%;
    &::after{
        content: '+';
        font-size: 16px;
        display: block;
        text-align: center;
        width: 100%;
        height: 100%;
        transform: rotate(45deg);
        color: ${$css.colors.white};
    }
`;

@inject('basketStore', 'mapStore', 'serverDataStore', 'dataStore')
@observer
class Product extends React.Component{
    removeFromBasket = () => {
        const { basketStore:{toBasket, seatStores}, ticket, serverDataStore:{data:{ticketcloud}} } = this.props;
        toBasket( ticket, false );

        for( let key in seatStores ){
            if( !ticketcloud ) key = +key;
            if( key === ticket.id )
                seatStores[key].onClick();
        }
    };

    render() {
        const { ticket: {price, price_extra, sector, row, seat, name, type}, basketStore: {count}, number, dataStore: {isSmallScreen} } = this.props,
            seatInfo = ( row && seat && (<RowSeat>ряд {row}, место {seat}</RowSeat>) ) || ( type === 'without_map' && <Sector>{name}</Sector> ),
            width = 100 / count,
            shift = number === 1 ? 12 : 12 * number - count * number * 12 / 2;
        return (
            <Wrapper shiftPercent={width}>
                <Container shiftRight={shift} isSmallScreen={isSmallScreen}>
                    {seatInfo}
                    <Sector createBeforeEl={row && seat}>{sector}</Sector>
                    <ContentWrapper>
                        <Money>
                            <span>{moneyFormating(price, true)}</span>
                            {!!price_extra && <div>(+{moneyFormating(price_extra, false)})</div>}
                        </Money>
                    </ContentWrapper>
                    <Remover
                        onClick={this.removeFromBasket}
                    />
                </Container>
            </Wrapper>
        );
    }
}

export default Product;
