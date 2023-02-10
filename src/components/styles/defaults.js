import styled from 'styled-components';
import { Button, Modal } from 'antd';

const baseDuration = 500;
const baseDelay = 500;
export const $css = {
    colors: {
        red: '#f6255a',
        orange: '#ffae19',
        green: '#07e260',

        grey: '#f7f7f7',
        darkGrey: '#676662',
        dark: '#2d3445',
        black: '#1f1f1f',
        darkCoral: '#d34c4c',
        white: '#ffffff',
        rgbaGrey: 'rgba(0,0,0,0.5)',
        rgbaRed: 'rgba(246,37,90,0.5)',
        rgbaGreyLight: 'rgba(0,0,0,0.01)',
        rgbaBorder: 'rgba(0,0,0,0.1)',
        rgbaOpacity: 'rgba(0,0,0,0)',
        url: {
            candy: 'url(#stripes)'
        }
    },
    sizes: {
        containerH: 645 + 'px'
    },
    animation: {
        delay: baseDelay,
        duration: baseDuration,
        durationfast: baseDuration / 3,
        timeFunction: 'cubic-bezier(0,0,0.88,1)',
        name: {
            in: 'animation-name: fade-in;',
            out: 'animation-name: fade-out;',
            inBottom: 'animation-name: in;',
        }
    },
    shadow: {
        style1: '0 10px 20px rgba(0,0,0,0.15), 0 6px 6px rgba(0,0,0,0.12)',
        style2: '0 10px 20px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22)'
    }
};

const Anim = styled('div')`
    animation-duration: ${props=>props.fast ? $css.animation.durationfast : $css.animation.duration}ms;
    animation-timing-function: ${$css.animation.timeFunction};
    animation-fill-mode: both; 
    ${props=>props.loading ? $css.animation.name.in : $css.animation.name.out}
`;
export const Animation = styled(Anim)`${props=>props.loading ? $css.animation.name.in : $css.animation.name.out}`;
export const AnimationBottom = styled(Anim)`${props=>props.loading && $css.animation.name.inBottom}`;
export const AnimationLeft = styled('div')`
    transform: translateX(-103%);
    transition: transform ${props=>props.fast ? $css.animation.durationfast : $css.animation.duration}ms cubic-bezier(0,0,0.88,1);
    will-change: transform;
`;


export const StyledButton = styled(Button)`
    // width: 100%;
    height: 62%;
    border: 1px solid ${$css.colors.rgbaGrey};
    // border-radius: 0;
    color: ${$css.colors.dark};
    background: ${$css.colors.white};
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    &:hover{
        background-color: ${$css.colors.red};
        color: ${$css.colors.white};
        border-color: ${$css.colors.red};
    }
    &.ant-btn:active{
        background-color: ${$css.colors.white};
        border-color: ${$css.colors.rgbaOpacity};
        color: ${$css.colors.dark};
    }
    &.ant-btn:focus{
        background-color: ${$css.colors.white};
        border-color: ${$css.colors.rgbaGrey};
        color: ${$css.colors.dark};
    }
    &.ant-btn:hover{
        background-color: ${$css.colors.red};
        color: ${$css.colors.white};
        border-color: ${$css.colors.red};
    }
    &.ant-btn[disabled]{
        background-color: ${$css.colors.white};
        border: 1px solid ${$css.colors.rgbaBorder};
        cursor: default;
    }
    &.ant-btn-default{
        color: ${$css.colors.black};
        background-color: ${$css.colors.white};
        border: 1px solid ${$css.colors.rgbaBorder};
    }
    &.ant-btn-default:hover{
        color: ${$css.colors.white};
    }
`;
export const StyledModal = styled(Modal)`
    .ant-modal-content{
        border-radius: 0;
    }
`;
export const StyledBoxButton = styled(Button)`
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 100%;
    border: 1px solid ${$css.colors.rgbaGrey};
    background-color: ${$css.colors.rgbaOpacity};
    color: ${$css.colors.rgbaGrey};
    &:hover{
        color: ${$css.colors.white};
        background-color: ${$css.colors.red};
        border-color: ${$css.colors.red};
        box-shadow: 0 0 3px 1px ${$css.colors.red};
    }
    &.ant-btn:active{
        color: ${$css.colors.red};
        background-color: ${$css.colors.rgbaOpacity};
        border-color: ${$css.colors.rgbaOpacity};
    }
    &.ant-btn:focus{
        color: ${$css.colors.rgbaGrey};
        background-color: ${$css.colors.rgbaOpacity};
        border-color: ${$css.colors.rgbaGrey};
    }
    &.ant-btn:hover{
        color: ${$css.colors.white};
        background-color: ${$css.colors.red};
        border-color: ${$css.colors.rgbaOpacity};
        box-shadow: 0 0 3px 1px ${$css.colors.red};
    }
    &.ant-btn[disabled]{
        color: ${$css.colors.darkGrey};
        background-color: ${$css.colors.rgbaOpacity};
        cursor: default;
        border-color: ${$css.colors.rgbaOpacity};
        box-shadow: none;
    }
    &.ant-btn[disabled]:hover{
        color: ${$css.colors.darkGrey};
        background-color: ${$css.colors.rgbaOpacity};
        cursor: default;
        border-color: ${$css.colors.rgbaOpacity};
        box-shadow: none;
    }
`;
