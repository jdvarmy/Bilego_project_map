import React, { Fragment } from 'react'
import { Provider } from 'mobx-react'
import AppLayout from './AppLayout/AppLayout'
import { serverDataStore } from './stores/ServerDataStore'
import { mapStore } from './stores/MapStore'
import { basketStore } from './stores/BasketStore'
import { cartStore } from './stores/CartStore'
import { thankYouStore } from './stores/ThankYouStore'
import { dataStore } from './stores/DataStore'
import ThankYou from './AppLayout/ThankYou/ThankYou';
import Error from './AppLayout/Error/Error';

import './chooser.css'

class AppIndex extends React.Component{
    render(){
        return (
            <Provider
                serverDataStore={serverDataStore}
                basketStore={basketStore}
                mapStore={mapStore}
                cartStore={cartStore}
                thankYouStore={thankYouStore}
                dataStore={dataStore}
            >
                <Fragment>
                    <AppLayout />
                    <ThankYou />
                    <Error />
                    {/*<WarInformer />*/}
                </Fragment>
            </Provider>
        );
    };
}

export default AppIndex;
