import React, { Fragment } from 'react';
import styled from 'styled-components';
import Menu from './Menu/Menu';
import Svg from './Svg/Svg';
import MiniMap from './Minimap/Minimap';
import ZoomButtons from './ZoomButtons/ZoomButtons';
import ModalTickets from './ModalTickets/ModalTickets';
import {inject} from "mobx-react";
import NoTickets from '../NoTickets';

const Wrapper = styled.div`
    height: ${window.innerHeight}px;
    width: 100%;
    overflow: hidden;
    font-smooth: antialiased;
    position: fixed;
    top: 0;
    left: 0;
    
    // touch-action: none;
    // user-select: none;
    // -webkit-user-drag: none;
    // -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;
const Container = styled.div`
  height: 100%;
`;

@inject('serverDataStore')
class Map extends React.PureComponent{
  render() {
      const { serverDataStore:{ data:{ tickets } } } = this.props;
      let countTickets = tickets.filter( ({end_date_time, start_date_time, stock})=>{
          let checkDate = true,
              newDate = new Date(),
              start = start_date_time ? new Date(...start_date_time.replace(/UTC/g, "-").replace(/:/g, "-").split('-')) : null,
              end = end_date_time ? new Date(...end_date_time.replace(/UTC/g, "-").replace(/:/g, "-").split('-')) : null;

          start = start ? start.setMonth(start.getMonth() - 1) : null;
          end = end ? end.setMonth(end.getMonth() - 1) : null;

          if(start_date_time && end_date_time){
              checkDate = start < newDate && end > newDate;
          }else if(!start_date_time && end_date_time){
              checkDate = end > newDate;
          }else if(start_date_time && !end_date_time){
              checkDate = start < newDate;
          }

          return stock !== 0 && checkDate
      });

    return (
        <Fragment>
            {
                countTickets.length === 0
                ? <NoTickets />
                :
                    <Fragment>
                        <Menu/>
                        <Wrapper id="bt--tickets-views">
                        <Container id="bt-container" data-type="map">
                        <Svg />
                        <MiniMap />
                        <ZoomButtons/>
                        </Container>
                        </Wrapper>
                        <ModalTickets />
                    </Fragment>
            }
        </Fragment>
    );
  }
}

export default Map;
