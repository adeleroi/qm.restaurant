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

export function GoogleIcon({ width=20, height=20 } : { width?: number, height?: number }) {
    return(
        <svg enableBackground="new 0 0 48 48" height={height} viewBox="0 0 48 48" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-11.045 0-20 8.955-20 20s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#ffc107"/><path d="m6.306 14.691 6.571 4.819c1.778-4.402 6.084-7.51 11.123-7.51 3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-7.682 0-14.344 4.337-17.694 10.691z" fill="#ff3d00"/><path d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.504 2.43-7.219 2.43-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025c3.31 6.477 10.032 10.921 17.805 10.921z" fill="#4caf50"/><path d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238c-.438.398 6.591-4.807 6.591-14.807 0-1.341-.138-2.65-.389-3.917z" fill="#1976d2"/>
        </svg>
    )
}

export function FacebookIcon({ width=20, height=20 } : { width?: number, height?: number }) {
    return (
        <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m23 12c0-6.07578-4.9242-11-11-11-6.07578 0-11 4.92422-11 11 0 5.4914 4.02187 10.0418 9.2812 10.8668v-7.6871h-2.79292v-3.1797h2.79292v-2.42344c0-2.75644 1.6415-4.27968 4.1551-4.27968 1.2032 0 2.4621.21484 2.4621.21484v2.70703h-1.3879c-1.3664 0-1.7917.84863-1.7917 1.71875v2.0625h3.0507l-.4877 3.1797h-2.563v7.6871c5.2593-.825 9.2812-5.3754 9.2812-10.8668z" fill="#fff"/><path d="m16.2818 15.1797.4877-3.1797h-3.0507v-2.0625c0-.87012.4253-1.71875 1.7917-1.71875h1.3879v-2.70703s-1.2589-.21484-2.4621-.21484c-2.5136 0-4.1551 1.52324-4.1551 4.27968v2.42344h-2.79292v3.1797h2.79292v7.6871c.5608.0881 1.1344.1332 1.7188.1332s1.158-.0451 1.7188-.1332v-7.6871z" fill="#1877f2"/>
        </svg>

    )
}

export function AppleIcon({ width=20, height=20 } : { width?: number, height?: number }) {
    return (
        <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" height={height} width={width}>
            <path d="m318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8.9-115.1 44.5-115.1 133.2q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill='white'/>
        </svg>
    )
}

export function ChevronDown({ width=20, height=20 } : { width?: number, height?: number}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width={width} height={height} viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="6 9 12 15 18 9" />
        </svg>

    )
}

export function ChevronForward({ width=20, height=20 } : { width?: number, height?: number}) {
    return (
        <svg height={height} viewBox="0 0 512 512" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m184 112 144 144-144 144" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48"/>
        </svg>

    )
}

export function Trash({ height=24, width=24, fill="#000" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg fill="none" height={height} width={width} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m17 22h-10c-1.10457 0-2-.8954-2-2v-13h-2v-2h4v-1c0-1.10457.89543-2 2-2h6c1.1046 0 2 .89543 2 2v1h4v2h-2v13c0 1.1046-.8954 2-2 2zm-10-15v13h10v-13zm2-3v1h6v-1zm6 14h-2v-9h2zm-4 0h-2v-9h2z" fill={fill}/>
        </svg>
    )
}

export function Pencil({ height=24, width=24, fill="#fff" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg fill="none" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" stroke-width="2" fill={fill}>
                <path d="M16.364 4.136c.329-.329.493-.493.657-.603a2 2 0 0 1 2.222 0c.164.11.328.274.657.603.328.328.492.493.602.656a2 2 0 0 1 0 2.223c-.11.163-.274.328-.602.656L9.066 18.505c-.264.265-.397.397-.55.502-.154.105-.325.18-.667.33l-.92.405c-1.986.874-2.98 1.311-3.463.828-.484-.484-.047-1.477.827-3.464l.405-.92c.15-.342.226-.513.33-.666.106-.154.238-.286.503-.55L16.364 4.135z" stroke-linecap="round"/>
                <path d="M13.621 6.843l3.536 3.536"/>
            </g>
        </svg>
    )
}