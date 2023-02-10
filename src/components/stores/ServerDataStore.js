import { observable, action } from 'mobx';
import {getData, getCheckout, sendCoupon} from '../../data/fetch';

export const couponStatusData = {
    overdue: 'Время действия этого купона истекло.',
    success: 'Купон применен',
}

class ServerDataStore{
    @observable isLoading = false;
    @observable data = null;
    @observable coupon = null;
    @observable couponValue = '';
    @observable couponStatus = null;
    @observable checkoutData = null;
    @observable loading = true;
    @observable loadingImage = 1;

    @observable error = false;

    @action
    getPostData = () => {
        this.startLoading();
        getData().then(data => {
            if( data ) {
                if( data.code === 'error' ){
                    this.setError(data.message);
                }else{
                    if(data.ticket_type === 'map' && (data.map_data === '' || data.map_images.length === 0)){
                        this.setError('Ошибка при загрузке карты!');
                    }else {
                        this.data = data;
                    }
                }
                this.stopLoading();
            }
        });

        this.checkoutData = null;
    };

    @action
    getCouponData = (coupon, tickets) => {
        this.isLoading = true;
        this.couponStatus = null;
        sendCoupon({coupon, tickets}).then((data) => {
            if( !data?.coupon ){
                this.couponStatus = (data?.message?.includes('""') && data?.message.replace(/("")/gi, `"${this.couponValue}"`)) || couponStatusData.overdue
            }else{
                this.coupon = data;
                this.couponStatus = couponStatusData.success
            }

            this.isLoading = false;
        })
    };
    @action
    setCouponValue = (value) => {
        this.couponValue = value;
    };
    @action
    clearCouponData = () => {
        this.coupon = null;
        this.couponValue = '';
        this.couponStatus = null;
    };

    @action
    getCheckoutData = (data) => {
        this.isLoading = true;
        getCheckout(data).then( data => {
            if( data?.code === 'error' ){
                this.setError(data.message);
            }else{
                this.checkoutData = data;
            }

            this.isLoading = false;
        });
    };

    @action
    clean = () => {
        this.data = null;
        this.coupon = null;
        this.couponStatus = null;
        this.checkoutData = null;
        this.error = false;

        this.loading = false;

        this.getPostData();
    };

    @action
    setError = error => {
        this.error = error;
    };

    @action
    startLoading = () => { this.loading = true };
    @action
    stopLoading = () => { this.loading = false };
}

export const serverDataStore = new ServerDataStore();
