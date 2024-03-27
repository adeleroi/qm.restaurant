// https://iconduck.com/icons/117068/shopping-cart
import GoogleLog from './google_on_white_hdpi.png';
import MasterCard from './payment-card-mastercard.svg';
import Visa from './payment-card-visa.svg'

export function CartIcon({ fill="#fff", width=25, height=25 } : { fill?: string, width: number, height: number }) {
    return (
        <svg height={height} viewBox="0 0 512 512" width={width} xmlns="http://www.w3.org/2000/svg">
            <circle cx="176" cy="432" r="40" fill={fill}/>
            <circle cx="400" cy="432" r="40" fill={fill}/>
            <path d="m456.8 120.78a23.92 23.92 0 0 0 -18.56-8.78h-304.35l-6.13-34.78a16 16 0 0 0 -15.76-13.22h-64a16 16 0 0 0 0 32h50.58l45.66 258.78a16 16 0 0 0 15.76 13.22h256a16 16 0 0 0 0-32h-242.58l-5.64-32h241.66a24.07 24.07 0 0 0 23.56-19.29l28.8-144a24 24 0 0 0 -5-19.93z" fill={fill}/>
        </svg>
    )
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
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width={width} height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
            <g stroke="currentColor" strokeWidth="2" fill={fill}>
                <path d="M16.364 4.136c.329-.329.493-.493.657-.603a2 2 0 0 1 2.222 0c.164.11.328.274.657.603.328.328.492.493.602.656a2 2 0 0 1 0 2.223c-.11.163-.274.328-.602.656L9.066 18.505c-.264.265-.397.397-.55.502-.154.105-.325.18-.667.33l-.92.405c-1.986.874-2.98 1.311-3.463.828-.484-.484-.047-1.477.827-3.464l.405-.92c.15-.342.226-.513.33-.666.106-.154.238-.286.503-.55L16.364 4.135z" strokeLinecap="round"/>
                <path d="M13.621 6.843l3.536 3.536"/>
            </g>
        </svg>
    )
}

export function VerifiedIcon({ height=24, width=24, fill="#fff" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg enableBackground="new 0 0 24 24" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m0 0h24v24h-24z" fill="none"/>
            <path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2-3.4 1.46-3.4-1.46-1.89 3.19-3.61.81.34 3.7-2.44 2.8 2.44 2.79-.34 3.7 3.61.82 1.89 3.19 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48z" fill={fill}/>
        </svg>
    )
}

export function PaymentMastercard({ className } : { className: string }) {
    return (
        <img src={MasterCard} className={className}/>
    )
}

export function PaymentVisa({ className } : { className: string }) {
    return (
        <img src={Visa} className={className}/>
    )
}

export function InfoIcon({ height=18, width=18, fill="#000" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg viewBox="0 0 24 24" height={height} width={width} xmlns="http://www.w3.org/2000/svg" className='cursor-pointer'>
            <path d="m0 0h24v24h-24z" opacity="0" transform="matrix(-1 0 0 -1 24 24)"/>
            <g fill="#231f20">
                <path d="m12 2a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8z" fill={fill}/>
                <circle cx="12" cy="8" r="1" fill='#099500'/>
                <path d="m12 10a1 1 0 0 0 -1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0 -1-1z" fill={fill}/>
            </g>
        </svg>

    )
}

export function SportCarIcon({ height=18, width=18, fill="#000" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg viewBox="0 0 480 512" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m438.66 212.33-11.24-28.1-19.93-49.83c-17.11-42.77-57.92-70.4-103.99-70.4h-127c-46.06 0-86.88 27.63-103.99 70.4l-19.93 49.83-11.24 28.1c-24.12 9.17-41.34 32.33-41.34 59.67v48c0 16.12 6.16 30.67 16 41.93v54.07c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-27.34-17.22-50.5-41.34-59.67zm-306.73-54.16c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17l19.93 49.83h-256zm-51.93 161.63c-19.2 0-32-12.76-32-31.9s12.8-31.9 32-31.9 48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95s28.8-47.85 48-47.85 32 12.76 32 31.9-12.8 31.9-32 31.9z" fill={fill}/>
        </svg>
    )
}

export function PaymentCard({ height=18, width=18, fill="#000" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg fill="none" height={height} viewBox="0 0 16 16" width={width} xmlns="http://www.w3.org/2000/svg">
            <g fill={fill}>
                <path d="m3 3c-1.10457 0-2 .89543-2 2v1h14v-1c0-1.10457-.8954-2-2-2z"/>
                <path d="m1 11v-4h14v4c0 1.1046-.8954 2-2 2h-10c-1.10457 0-2-.8954-2-2zm9.5-1c-.2761 0-.5.2239-.5.5s.2239.5.5.5h2c.2761 0 .5-.2239.5-.5s-.2239-.5-.5-.5z"/>
            </g>
        </svg>
    )
}

export function AddIcon({ height=18, width=18, fill="none" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m0 0h24v24h-24z" fill={fill}/>
            <path d="m19 13h-6v6h-2v-6h-6v-2h6v-6h2v6h6z"/>
        </svg>
    )
}

export function ProfileIcon({ height=18, width=18, fill="#4b5563" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg viewBox="0 0 448 512" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m224 256c70.7 0 128-57.3 128-128s-57.3-128-128-128-128 57.3-128 128 57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7c-74.2 0-134.4 60.2-134.4 134.4v41.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" fill={fill}/>
        </svg>
    )
}

export function SearchIcon({ height=18, width=18 } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.5143 16.5065M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
}

export function ClockIcon({ height=24, width=24 } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
            <path d="m12 2c-5.51 0-10 4.49-10 10s4.49 10 10 10 10-4.49 10-10-4.49-10-10-10zm4.35 13.57c-.14.24-.39.37-.65.37-.13 0-.26-.03-.38-.11l-3.1-1.85c-.77-.46-1.34-1.47-1.34-2.36v-4.1c0-.41.34-.75.75-.75s.75.34.75.75v4.1c0 .36.3.89.61 1.07l3.1 1.85c.36.21.48.67.26 1.03z" fill="#292d32"/>
        </svg>

    )
}

export function PhoneIcon({ height=18, width=18 } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg viewBox="0 0 512 512" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <path d="m497.39 361.8-112-48a24 24 0 0 0 -28 6.9l-49.6 60.6a370.66 370.66 0 0 1 -177.19-177.19l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112a24.16 24.16 0 0 0 -27.5-13.9l-104 24a24 24 0 0 0 -18.6 23.39c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0 -14.01-27.6z"/>
        </svg>

    )
}

export function CheckedIcon({ height=18, width=18, fill="#099500" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg height={height} viewBox="0 0 20 20" width={width} xmlns="http://www.w3.org/2000/svg" fill='none'>
            <g style={{ stroke: fill, strokeWidth:2,  strokeLinecap:'round', strokeLinejoin:'round'}} transform="translate(-2 -2)">
                <path d="m12 3c4.9705627 0 9 4.02943725 9 9 0 4.9705627-4.0294373 9-9 9-4.97056275 0-9-4.0294373-9-9 0-4.97056275 4.02943725-9 9-9z"/>
                <path d="m7.71428571 11.6223394 3.52941139 3.3776606 5.0420172-6"/>
            </g>
        </svg>
    )
}

export function ErrorIcon({ height=18, width=18, fill="#099500" } : { height?: number, width?: number, fill?: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 24 24" width={width}>
            <path d="M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm-.01-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-3h-2v-2h2v2z" fill={fill}/>
        </svg>
    )
}
