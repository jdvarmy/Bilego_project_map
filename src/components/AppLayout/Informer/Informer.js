import React from 'react';
import {notification, Icon} from "antd";
import { $css } from '../../styles/defaults';

const Informer = message => {
    notification.open({
        message: message.title,
        description: message.text,
        icon: <Icon type="frown" style={{ color: $css.colors.white }} />,
        className: 'bt-informer',
        duration: 9,
        placement: 'topLeft'
    })
};

export default Informer;