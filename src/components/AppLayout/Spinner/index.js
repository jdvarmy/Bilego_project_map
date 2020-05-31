import React from 'react';
import styled from 'styled-components';

export default function Spinner (props) {
  const {leftPadding} = props;

  let width = window.innerWidth;

  const Wrap = styled.div`
    width: 100px;
    height: 102px;
    border-radius: 100%;
    position: absolute;
    top: ${()=>{
      const w = document.documentElement.clientHeight;
      return w - 50 - (w / 100 * 50)
    }}px;
      left: calc(${()=>{
      if(width !== undefined && width<1110) return 50;
      else return leftPadding ? 50 - leftPadding : 50
    }}% - 50px);
  `;
  const Circle = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    div{
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: 5px solid rgba(251,29,88,0.36);
      border-right: none;
      border-top: none;
      backgroudn-clip: padding;
      box-shadow: inset 0px 0px 10px transparentize(#f6255a, 0.85);
    }
  `;

  return(
    <Wrap className="bilego-spinner">
      {[1,2,3,4,5].map(el=>(
        <Circle key={el} className="circle">
          <div/>
        </Circle>
      ))}
    </Wrap>
  );
};
