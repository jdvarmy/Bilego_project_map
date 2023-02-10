import {action, observable} from 'mobx';
import Hammer from 'hammerjs';

const inverse = (x) => x * -1;

class MapStore{
    @observable x = 0;
    @observable y = 0;
    @observable scale = 1;
    @observable delay = 0;

    // map
    @observable containerW = 0;
    @observable containerH = 0;
    @observable contentW = 0;
    @observable contentH = 0;

    @observable fitscale = this.scale;
    maxscale = 4;
    zoommargin = 0;

    @observable container = undefined;
    @observable map = undefined;
    @observable mapImage = undefined;

    // touch
    @observable init1 = null;
    @observable init2 = null;
    @observable initD = 0;
    @observable initScale = null;

    // Path store
    @observable pathDisplay = false;

    @action
    setFitscale = scale => {
        this.fitscale = scale;
    };
    @action
    setContainer = element => {
        this.container = element;
    };
    @action
    setMap = element => {
        this.map = element;
    };
    @action
    setImage = element => {
        this.mapImage = element;
    };
    @action
    setContentDimensions = (w, h) => {
        this.contentW = w;
        this.contentH = h;
    };
    @action
    setContainerDimensions = (w, h) => {
        this.containerW = w;
        this.containerH = h;
    };

    @action.bound
    handleClick(e){
        this.stopMomentum();
        this.delay = 400/1000;

        const scale = this.scale;
        this.scale = this.normalizeScale(scale + scale * (scale+1));

        this.zoomTo(
            this.normalizeX(this.x - (e.pageX - this.container.getBoundingClientRect().left - this.x) * (this.scale/scale - 1)),
            this.normalizeY(this.y - (e.pageY - this.container.getBoundingClientRect().top - this.y) * (this.scale/scale - 1)),
            undefined,
            400
        );
    }

    @action.bound
    handleMouseDown(e){
        this.map.classList.add('dragging');

        this.initial = {x: e.pageX, y: e.pageY};
        this.current = {x: this.x, y: this.y};

        this.stopMomentum();
        this.mouse.x = this.normalizeX(e.pageX - this.initial.x + this.current.x);
        this.mouse.y = this.normalizeY(e.pageY - this.initial.y + this.current.y);
        this.momentumStep();

        this.map.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }
    onMouseMove = e => {
        const domNode = document.querySelector(`#bt-tooltip`);
        if( domNode.firstChild )
            domNode.firstChild.remove();

        this.mouse.x = this.normalizeX(e.pageX - this.initial.x + this.current.x);
        this.mouse.y = this.normalizeY(e.pageY - this.initial.y + this.current.y);
    };
    onMouseUp = () => {
        this.map.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        this.map.classList.remove('dragging');
    };

    @action.bound
    handleWheel(e){
        this.delay = 400/1000;

        const scale = this.scale;
        this.scale = this.normalizeScale(scale + scale * inverse(e.deltaY) / 500);

        this.zoomTo(
            this.normalizeX(this.x - (e.pageX - this.container.getBoundingClientRect().left - this.x) * (this.scale/scale - 1)),
            this.normalizeY(this.y - (e.pageY - this.container.getBoundingClientRect().top - this.y) * (this.scale/scale - 1)),
            undefined,
            400
        );
    }

    @action.bound
    handleTouchStart(e){
        const orig = e.touches,
            touches = orig.length;

        if (touches === 1) {
            this.map.classList.add('dragging');

            this.stopMomentum();
            this.init1 = {
                x: orig[0].pageX - this.x,
                y: orig[0].pageY - this.y
            };

            this.mouse.x = this.normalizeX(orig[0].pageX - this.init1.x);
            this.mouse.y = this.normalizeY(orig[0].pageY - this.init1.y);
            this.momentumStep();

            this.map.addEventListener('touchmove', this.onTouchMove);
            document.addEventListener('touchend', this.onTouchEnd);
        }

        if (touches === 2) {
            this.map.classList.add('dragging');

            this.stopMomentum();
            this.init1 = { x: orig[0].pageX - this.x, y: orig[0].pageY - this.y };
            this.init2 = { x: orig[1].pageX - this.x, y: orig[1].pageY - this.y };
            this.initD = Math.sqrt(Math.pow(this.init1.x - this.init2.x, 2) + Math.pow(this.init1.y - this.init2.y, 2));
            this.initScale = this.scale;

            this.map.removeEventListener('touchmove', this.onTouchMove);
            document.addEventListener('touchend', this.onTouchEnd);

            this.map.addEventListener('touchmove', this.onTouchMoveZoom);
            document.addEventListener('touchend', this.onTouchEndZoom);
        }
    }
    @action.bound
    handlePressDrug(e){
        const orig = e.touches,
            touches = orig.length;

        if (touches === 1) {
            this.map.classList.add('dragging');

            this.stopMomentum();
            this.init1 = {
                x: orig[0].pageX - this.x,
                y: orig[0].pageY - this.y
            };

            this.mouse.x = this.normalizeX(orig[0].pageX - this.init1.x);
            this.mouse.y = this.normalizeY(orig[0].pageY - this.init1.y);
            this.momentumStep();

            this.map.addEventListener('touchmove', this.onTouchMove);
            document.addEventListener('touchend', this.onTouchEnd);
        }
    }
    @action.bound
    handlePinchZoom(e){
        const orig = e.touches,
            touches = orig.length;

        if (touches === 2) {
            this.map.classList.add('dragging');

            this.stopMomentum();
            this.init1 = { x: orig[0].pageX - this.x, y: orig[0].pageY - this.y };
            this.init2 = { x: orig[1].pageX - this.x, y: orig[1].pageY - this.y };
            this.initD = Math.sqrt(Math.pow(this.init1.x - this.init2.x, 2) + Math.pow(this.init1.y - this.init2.y, 2));
            this.initScale = this.scale;

            this.map.removeEventListener('touchmove', this.onTouchMove);
            document.addEventListener('touchend', this.onTouchEnd);

            this.map.addEventListener('touchmove', this.onTouchMoveZoom);
            document.addEventListener('touchend', this.onTouchEndZoom);
        }
    }
    onTouchMove = e => {
        const orig = e.touches,
            touches = orig.length;

        if (touches === 1) {
            this.mouse.x = this.normalizeX(orig[0].pageX - this.init1.x);
            this.mouse.y = this.normalizeY(orig[0].pageY - this.init1.y);
        }

        const domNode = document.querySelector(`#bt-tooltip`);
        if( domNode.firstChild )
            domNode.firstChild.remove();
    };
    onTouchEnd = () => {
        this.map.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        this.map.classList.remove('dragging');
    };
    onTouchMoveZoom = e => {

        const orig = e.touches
            // touches = orig.length;

        const pos = {
            x: (orig[0].pageX + orig[1].pageX)/2,
            y: (orig[0].pageY + orig[1].pageY)/2
        };

        const dist = Math.sqrt(Math.pow(orig.touches[0].pageX - orig.touches[1].pageX, 2) + Math.pow(orig.touches[0].pageY - orig.touches[1].pageY, 2)) / this.initD;

        var scale = this.scale;
        this.scale = this.normalizeScale(this.initScale * dist);

        this.zoomTo(
            this.normalizeX(this.x - (pos.x  - this.container.getBoundingClientRect().left - this.x) * (this.scale/scale - 1)),
            this.normalizeY(this.y - (pos.y - this.container.getBoundingClientRect().top - this.y) * (this.scale/scale - 1))
        );
    };
    onTouchEndZoom = () => {
        this.map.removeEventListener('touchmove', this.onTouchMoveZoom);
        document.removeEventListener('touchend', this.onTouchEndZoom);
        this.map.classList.remove('dragging');
    };

    @action
    hammerFunction = () => {
        // console.log(this.container)
        // console.log(this.map)
        // console.log(this.mapImage)

        this.disableImgEventHandlers();

        this.hammer = Hammer(this.mapImage, {
            domEvents: true
        });
        this.hammer.get('pinch').set({
            enable: true
        });

        this.hammer.on('pinch', (e) => {
            console.log(e)
            // http://bl.ocks.org/redgeoff/raw/6be0295e6ebf18649966d48768398252/

            const orig = [e.pointers[0], e.pointers[1]];
            this.map.classList.add('dragging');

            this.stopMomentum();
            this.init1 = { x: orig[0].pageX - this.x, y: orig[0].pageY - this.y };
            this.init2 = { x: orig[1].pageX - this.x, y: orig[1].pageY - this.y };
            this.initD = Math.sqrt(Math.pow(this.init1.x - this.init2.x, 2) + Math.pow(this.init1.y - this.init2.y, 2));
            this.initScale = this.scale;

            // this.map.removeEventListener('touchmove', this.onTouchMove);
            // document.addEventListener('touchend', this.onTouchEnd);
            //
            // this.map.addEventListener('touchmove', this.onTouchMoveZoom);
            // document.addEventListener('touchend', this.onTouchEndZoom);
        });
        this.hammer.on('pinchend', (e) => {
            console.log(e)

            // todo hammer.off events
        });
    };
    disableImgEventHandlers = () => {
        const events = ['onclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover',
            'onmouseup', 'ondblclick', 'onfocus', 'onblur'];

        // eslint-disable-next-line array-callback-return
        events.map(event => {
            this.mapImage[event] = function() {
                return false;
            };
        });
    };

    //
    momentum = null;
    current = {x: 0, y: 0};
    position = {x: 0, y: 0};
    friction = 0.85;
    mouse = {x: 0, y: 0};
    previous = {x: this.position.x, y: this.position.y};
    velocity = {x: 0, y: 0};
    initial = {x: 0, y: 0};
    stopMomentum = () => {
        cancelAnimationFrame(this.momentum);
        if (this.momentum != null) {
            this.x = this.position.x;
            this.y = this.position.y;
        }
        this.momentum = null;
    };
    momentumStep = () => {
        this.momentum = requestAnimationFrame(this.momentumStep);

        if ( this.map.classList.contains('dragging') ) {
            this.previous.x = this.position.x;
            this.previous.y = this.position.y;

            this.position.x = this.mouse.x;
            this.position.y = this.mouse.y;

            this.velocity.x = (this.position.x - this.previous.x);
            this.velocity.y = (this.position.y - this.previous.y);
        }
        else {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;

            if (Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.1) {
                this.stopMomentum();
                this.x = this.position.x;
                this.y = this.position.y;
            }
        }
        this.position.x = this.normalizeX(this.position.x);
        this.position.y = this.normalizeY(this.position.y);

        this.zoomTo(this.position.x, this.position.y);
    };

    //
    resetZoom = () => {
        this.moveTo(0.5, 0.5, this.fitscale, 0);
    };
    moveTo = (x, y, s, duration, ry) => {
        ry = typeof ry !== 'undefined' ? ry : 0.5;
        s = typeof s !== 'undefined' ? s : this.scale/this.fitscale;

        this.scale = this.normalizeScale(s);

        this.zoomTo(
            this.normalizeX(this.containerW * 0.5 - this.scale * this.contentW * x),
            this.normalizeY(this.containerH * ry - this.scale * this.contentH * y)
        );
    };
    zoomTo = (x, y, scale, d) => {
        if( typeof scale !== 'undefined' ) this.scale = scale;
        d = typeof d !== 'undefined' ? d/1000 : 0;

        this.delay = d;
        this.x = x;
        this.y = y;

        if(this.containerMinimap !== undefined) {
            this.updateMinimap();
        }

        this.scale > this.maxscale-2.5 ? this.pathDisplay = true : this.pathDisplay = false;
    };

    //
    normalizeX = (x) => {
        let minX = (this.containerW - this.contentW * this.scale);
        if (minX < 0) {
            if (x > this.zoommargin) x = this.zoommargin;
            else if (x < minX - this.zoommargin) x = minX - this.zoommargin;
        }
        else x = minX/2;

        return x;
    };
    normalizeY = (y) => {
        let minY = (this.containerH - this.contentH * this.scale);
        if (minY < 0) {
            if (y > this.zoommargin) y = this.zoommargin;
            else if (y < minY - this.zoommargin) y = minY - this.zoommargin;
        }
        else y = minY/2;

        return y;
    };
    normalizeScale = (scale) => {
        if (scale <= this.fitscale) scale = this.fitscale;
        else if (scale > this.maxscale) scale = this.maxscale;

        return scale;
    };

    /*
    *
    *
    *
    * */

    // minimap
    @observable containerMinimap = undefined;
    opacity = null;
    @observable miniMap = {top: 0, left: 0, right: 0, bottom: 0};

    @action
    setContainerMinimap = element => {
        this.containerMinimap = element;
    };

    updateMinimap = () => {
        const width = (this.containerW / this.contentW / this.scale * this.containerMinimap.offsetWidth),
            height = (this.containerH / this.contentH / this.scale * this.containerMinimap.offsetHeight);

        this.miniMap.top = (-this.y / this.contentH / this.scale * this.containerMinimap.offsetHeight);
        this.miniMap.left = (-this.x / this.contentW / this.scale * this.containerMinimap.offsetWidth);
        this.miniMap.right = this.miniMap.left + width;
        this.miniMap.bottom = this.miniMap.top + height;

        this.containerMinimap.style.opacity = 0.5;
        clearTimeout(this.opacity);
        this.opacity = setTimeout(()=>{
            this.containerMinimap.style.opacity = 0;
        }, 3000)
    };

    // control buttons
    @action.bound
    handleClickZoomIn(){
        this.stopMomentum();

        const scale = this.scale;
        this.scale = this.normalizeScale(scale + scale * 0.8);

        this.zoomTo(
            this.normalizeX(this.x - (this.containerW / 2 - this.x) * (this.scale / scale - 1)),
            this.normalizeY(this.y - (this.containerH / 2 - this.y) * (this.scale / scale - 1)),
            undefined,
            400,
            );
    };
    @action.bound
    handleClickZoomOut(){
        this.stopMomentum();

        const scale = this.scale;
        this.scale = this.normalizeScale(scale - scale * 0.5);

        this.zoomTo(
            this.normalizeX(this.x - (this.containerW / 2 - this.x) * (this.scale / scale - 1)),
            this.normalizeY(this.y - (this.containerH / 2 - this.y) * (this.scale / scale - 1)),
            undefined,
            400,
        );
    };

}

export const mapStore = new MapStore();
