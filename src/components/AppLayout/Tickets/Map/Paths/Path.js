import React from 'react'
import ReactDOM from 'react-dom';
import { inject, observer } from "mobx-react/index";
import styled from 'styled-components';

import { PathStore } from '../stores/PathStore';
import { TooltipPath } from '../Tooltip/TooltipPath'

const Element = styled('path')`
    fill: transparent;
    transition: all .3s;
    ${props=>{
        if( props.pathDisplay ) return `display: none`;
        if( props.hover ) return `
            fill:transparent;
            opacity: 1;
            stroke: #ef5625;
            stroke-width: 40;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-opacity: .7;
            cursor: pointer;
        `;
    }}
`;

@inject('serverDataStore', 'mapStore', 'basketStore')
@observer
class Path extends React.Component {
    constructor(props){
        super(props);
        const { el:{ id }, serverDataStore:{ data: { tickets } } } = props;

        this.pathStore = new PathStore();
        this.pathStore.init({tickets, id});
    }

    componentDidMount(): void {
        const { el: {text, id}, serverDataStore:{ data: { tickets } } } = this.props,
            el = ReactDOM.findDOMNode(this);
        let ticketArr = [];

        tickets.map( e => e.sector === id && ticketArr.push(e) );
        this.tooltip = new TooltipPath({el, ticketArr, text});
    }

    handleHover = () => {
        this.pathStore.onEnter();
        this.tooltip.create();
    };
    handleUnhover = () => {
        this.pathStore.onOver();
        this.tooltip.delete();
    };

    handlerSpecialClick = () => {
        const { basketStore:{ setSetWindowMode } } = this.props;
        const { ticket } = this.pathStore;

        setSetWindowMode(true, ticket);
    };

    render() {
        const { el: {d, id} } = this.props,
            { mapStore:{ pathDisplay, handleClick } } = this.props,
            { hover, ticket } = this.pathStore;

        return (
            <Element
                d={d}
                id={id}
                hover={hover}
                pathDisplay={pathDisplay}
                onMouseOver={this.handleHover}
                onMouseLeave={this.handleUnhover}
                onClick={ticket ? this.handlerSpecialClick : handleClick}
                onTouchStart={ticket ? this.handlerSpecialClick : handleClick}
            />
        )
    }
}

export default Path;