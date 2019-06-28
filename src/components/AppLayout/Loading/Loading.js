import React from 'react';
import styled from 'styled-components';

import logo from './loading-v1.png';
import {inject, observer} from 'mobx-react';

const Wrapper = styled('div')``;
const Background = styled('div')`
    ${props => props.forceLoading && `   
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255,255,255,1);
        animation-duration: 8s;
        animation-fill-mode: both;
        animation-name: fade-in-minimal;
    `}
`;

const Content = styled('canvas')`
    width: 100%;
    min-height: 645px;
    display: block;
    opacity: 1;
    margin: 0 auto;
    ${props => props.forceLoading && `
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    `}
    animation-duration: .5s;
    animation-timing-function: cubic-bezier(0,0,0.88,1);
    animation-fill-mode: both;
    animation-name: fade-in;
`;

@inject('serverDataStore')
@observer
class Loading extends React.Component{
    constructor() {
        super();

        this.options = {
            speed: 65,
            shootNum: 0,
            scale: 0.8,
            screenWidth: 1018
        };
    }

    componentDidMount(){
        this.element = document.querySelector('#loading');
        this.context = this.element.getContext('2d') && this.element.getContext('2d');
        this.container = document.querySelector('#bilego-sell-tickets');

        let img = document.createElement('img');
        img.src = logo;
        this.spride = img;

        const { serverDataStore: { loading, forceLoading } } = this.props;
        if(loading || forceLoading) {
            this.start();
        }
    }

    componentWillUnmount(){
        this.stop();
    };
    
    start = () => {
        if( this.container.classList.contains('loading') ) return;
        const width = this.container.getBoundingClientRect().width,
            height = this.container.getBoundingClientRect().height;

        this.container.classList.add('loading');
        this.element.setAttribute('width', width);
        this.element.setAttribute('height', height);

        this.init = setInterval(() => {
            this.context.clearRect(0, 0, width, height);
            this.drawImageLoader();
        }, this.options.speed);

    };
    
    stop = () => {
        this.container.classList.remove('loading');
        setTimeout(() => {
            clearInterval( this.init );
        }, 700);
    };

    drawImageLoader = () => {
        const max = 23;
        if (this.options.shootNum >= max){
            this.options.shootNum = 1;
        }else{
            this.options.shootNum ++;
        }

        let x, y, wx, wy;
        x = this.options.shootNum * 230;
        y = 0;
        wx = 230;
        wy = 420;

        this.context.drawImage(
            this.spride,
            x,
            y,
            wx,
            wy,
            (this.container.getBoundingClientRect().width - (wx * this.options.scale)) / 2,
            (this.container.getBoundingClientRect().height - (wy * this.options.scale)) / 2,
            wx * this.options.scale,
            wy * this.options.scale
        )
    };

    windowWidth = () => {
        return window.innerWidth > this.options.screenWidth;
    };

    render() {
        const { serverDataStore:{ loading, forceLoading } } = this.props;
        return (
            <Wrapper>
                <Background forceLoading={forceLoading} />
                <Content loading={loading} forceLoading={forceLoading} id="loading" width={0} height={0} />
            </Wrapper>
        );
    }
}

export default Loading;