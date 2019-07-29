import { action, observable } from 'mobx';

class CartStore{
    @observable showCart = false;
    @observable showPay = false;
    @observable tickets = undefined;
    @observable event = undefined;
    @observable total = undefined;
    city = null;

    // validate form
    @observable email = '';
    @observable emailValid = '';
    @observable formValid = false;

    constructor(){
        const location = window.location.search;

        if( location ) {
            const urlArray = location.substr(1).split('&');
            this.city = urlArray[1].split('=')[1];
        }
    }

    @action
    showHidePay = () => {
        this.showPay = !this.showPay;
    };
    @action
    showHideCart = (tickets, event, total) => {
        this.showCart = !this.showCart;
        this.setData(tickets, event, total);
    };

    setData = (tickets, event, total) => {
        this.tickets = tickets;
        this.event = event;
        this.total = total;
    };

    @action
    clear = () => {
        this.showCart = false;
        this.showPay = false;
        this.tickets = undefined;
        this.event = undefined;
        this.total = undefined;
    };

    // validate form
    @action
    setEmail = email => {
        this.email = email;
    };
    @action
    checkEmail = valid => {
        this.emailValid = valid;
    };
    @action
    checkForm = valid => {
        this.formValid = valid;
    };

}

export const cartStore = new CartStore();