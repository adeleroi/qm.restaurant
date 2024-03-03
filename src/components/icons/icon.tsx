// https://iconduck.com/icons/117068/shopping-cart
import SVGCart from './cart.svg';
import GoogleLog from './google_on_white_hdpi.png';

export function CartIcon() {
    return <img className='' src={SVGCart}/>
}

export function CustomMarker({ fill="#ca4747", width, height } : { fill?: string, width: number, height: number }) {
    return (
    <svg viewBox="0 0 384 512" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <path d="m172.268 501.67c-145.298-210.639-172.268-232.257-172.268-309.67 0-106.039 85.961-192 192-192s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zm19.732-229.67c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill={fill}/>
    </svg>
    )
}

export function GoogleLogo({ className } : { className?: string }) {
    return (
        <img src={GoogleLog} className={className}/>
    )
}
