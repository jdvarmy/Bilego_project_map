import {getEventId} from '../components/AppLayout/functions/functions';

export function getData() {
    const location = getEventId(true);
    if( location ) {
        const urlArray = location;
        const id = urlArray[0];
        const city = urlArray[1].split('=')[1];
        let address = `https://${city}.bilego.ru/wp-json/bilego/v1/tickets/${id}`;
        // let address = `https://evenpic.ru/wp-json/bilego/v1/tickets/${id}`;

        // https://webapp.bilego.ru/?a71214be6d36580a&city=spb map
        // https://webapp.bilego.ru/?a71214be79277003&city=spb set

        // https://webapp.bilego.ru/?a712a48cf9c09e44a7126d36ce1ece1e&city=spb
        // https://webapp.bilego.ru/?a712a48c7927580ad8c06937ce1ece1e&city=spb set
        // https://webapp.bilego.ru/?a712a48c7927580aa7123d4ece1ece1e&city=spb map

        return fetch(address)
            .then( resp => resp.json() )
            .then( resp => resp )
            .catch( alert => console.log(alert) )

    }else {
        return new Promise(
            (resolve, reject) => setTimeout( ()=>resolve({code: 'error', message: 'Пусто!' }), 2000)
        )
    }
}

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export function getCheckout( request ) {
    const location = getEventId(true);

    if( location ) {
        const id = location[0];
        const city = location[1].split('=')[1];
        let address = `https://${city}.bilego.ru/wp-json/bilego/v1/checkout`;

        const options = {
            method: 'post',
            headers,
            body: JSON.stringify( {'form': request, 'id': id} )
        };

        return fetch(address, options)
            .then( resp => resp.json() )
            .then( resp => resp )
            .catch( alert => console.log(alert) )

    }else {
        return new Promise(
          (resolve, reject) => setTimeout( ()=>resolve({code: 'error', message: 'Пусто!' }), 2000)
        )
    }
}

export function sendCoupon(data) {
    const location = getEventId(true);

    if( location ) {
        // eslint-disable-next-line no-unused-vars
        const [_, city] = location;
        let address = `https://${city.split('=')[1]}.bilego.ru/wp-json/bilego/v1/coupon`;

        const options = {
            method: 'post',
            headers,
            body: JSON.stringify(data)
        };

        return fetch(address, options)
          .then( resp => resp.json() )
          .then( resp => resp )
          .catch( alert => alert )
    } else {
        throw new Error('no location');
    }
}
