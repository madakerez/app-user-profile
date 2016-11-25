import TweenMax from 'TweenMax';

export function heightAnim ($node, height) {
    TweenMax.to(
        $node,
        0.3,
        {
            ease: Sine.easeInOut,
            height: height
        }
    );
}

export function opacityAnim ($node, opacity) {
    TweenMax.to(
        $node,
        0.2,
        {
            ease: Sine.easeInOut,
            opacity: opacity
        }
    );
}