import TweenMax from 'TweenMax';

export default class ToggleElement {
    constructor($click_node, $anim_node, options) {
        this.config = $.extend({}, {
            time: 0.3,
            opacity: 1,
        }, options);
        this.$anim_node = $anim_node;
        this.$node = $click_node;
        this._tween = null;
    }

    init(){
        this.setTween();
        this.attachListeners();
    }

    attachListeners(){
        this.$node.on('click', this.setAnim.bind(this));
        this.$node.on('click', this.setFlipping.bind(this));
    }

    setFlipping(){

        if(!this.$node.hasClass('flip')){
            this.$node.addClass('flip');
        }
        else {
            this.$node.removeClass('flip');
        }
    }

    setTween(){
        this._tween =
            TweenMax.to(
                this.$anim_node,
                this.config.time,
                {
                    ease: Sine.easeInOut,
                    height: 0,
                    paused: true,
                    opacity: this.config.opacity,
                    reversed: true
                }
            );
    }

    setAnim(){
        if (this._tween.reversed()) {
            this._tween.play();
        } else {
            this._tween.reverse();
        }
    }

}


