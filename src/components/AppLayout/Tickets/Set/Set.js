import React from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import SetElement from './SetElement';
import NoTickets from '../NoTickets';

const Wrapper = styled('div')`
    background-color: #fff;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0;
    height: 645px;
`;
const Scroll = styled(Scrollbars)`
    max-height: 545px;
`;
const Container = styled('ul')`
    list-style: none;
    width: 100%;
`;

@inject('serverDataStore')
class Set extends React.Component{
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
          <Wrapper>
            <Scroll>
              <Container>
                {countTickets
                  .map( el=>{
                    return (<SetElement element={el} key={el.id} />)
                  } )
                }
              </Container>
            </Scroll>
            {countTickets.length === 0 && <NoTickets />}
          </Wrapper>
        );
    }
}

export default Set;
