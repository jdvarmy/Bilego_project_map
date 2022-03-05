import styled from 'styled-components';
import {inject, observer} from "mobx-react";
import React from "react";

const Wrapper = styled('div')`
    height: 100%;
    width: 100%;
`;

@inject('thankYouStore', 'serverDataStore')
@observer
class TinkoffGate extends React.Component {
  render(){
    const { serverDataStore:{ checkoutData } } = this.props;

    console.log(checkoutData)

    return(
      <Wrapper dangerouslySetInnerHTML={{ __html: `<iframe frameborder="0" style="width: 100%; height: 100%; display: block; border: none; padding: 0; margin: 0; position: relative; z-index: 1;" src='${checkoutData}' />`}} />
    );
  }
}

export default TinkoffGate;