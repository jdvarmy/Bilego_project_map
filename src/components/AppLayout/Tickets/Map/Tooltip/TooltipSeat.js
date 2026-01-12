import Tooltip from './Tooltip'

export class TooltipSeat extends Tooltip{
    constructor(props){
        super(props);

        this.props = props;
    }

    create = errorY => {
        const { price, price_regular, sector_name, row_name, seat_name, el } = this.props;

        this.el = el;
        let title;

        const wrap = document.createElement('div'),
            titl = document.createElement('div'),
            cont = document.createElement('div'),
            desc = document.createElement('div');

        this.domNode.appendChild(wrap);
        wrap.appendChild(titl);
        wrap.appendChild(cont);
        wrap.appendChild(desc);

        wrap.classList.add('bt-tooltip-wrap');
        titl.classList.add('title');
        cont.classList.add('content');
        desc.classList.add('descr');

        title = `${price} ₽`;
        const c = `${sector_name}`;
        const d = `ряд ${row_name} место ${seat_name}`;

        wrap.classList.add('bt-tooltip-wrap-seat');
        titl.appendChild( document.createTextNode(title) );
        cont.appendChild( document.createTextNode(c) );
        if( row_name && seat_name )
            desc.appendChild( document.createTextNode(d) );

        this.update( errorY );
    };
}