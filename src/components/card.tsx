import clsx from "clsx";


type BasicCard = {
    src?: string,
    className?: string,
    alt:string,
    description: string,
    deliveryTime?: string,
    offer?: string
};

type StoreCard = {
    src?: string,
    className?: string,
    alt:string,
    description: string,
    title: string,
    deliveryTime?: string,
    offer?: string
}

type CountryCard = {
    flag: string,
    image: string,
    className: string,
    name: string,
    description: string,
}

export function CountryCard({flag, image, className, name, description}: CountryCard) {
    return (
        <li className={clsx(className)}>
            <img className='absolute inset-0 h-full w-full object-cover' src={image} alt={`${name}-image`}/>
            <div style={{bottom: 0}} className='absolute inset-x-0 bg-gradient-to-t from-black/70 from-50%'>
                <div className='w-52'>
                    <div className="flex items-center gap-1 pl-4">
                        <div className="w-8 h-8 border-black border-[1px] rounded-full">
                            <img src={flag} alt={`${name}-flag`} className="object-contain"/>
                        </div>
                        <h2 className='py-4 text-2xl text-white font-semibold'>{name}</h2>
                    </div>
                <div className="grid grid-rows-[0fr] transition-all pb-4 group-hover:grid-rows-[1fr]">
                    <p className='overflow-hidden px-3 font-medium text-white opacity-0 transition duration-300 group-hover:opacity-100'>{description}</p>
                </div>
                </div>
            </div>
        </li>
    )
}

export function StoreCard({src, className, alt, title, description, deliveryTime, offer}: StoreCard) {
    return (
        <li className={clsx("relative flex justify-start items-center border-[1px] min-h-36 rounded-lg px-2 cursor-pointer", className)}>
            <div className="w-20 h-20 border-[1px] p-2 rounded-full flex justify-center items-center mr-2">
                <img className='object-contain' src={src} alt={alt}/>
            </div>
            <div className=''>
                <h2 className='text-left text-xl text-black font-semibold'>{title}</h2>
                <p className='text-left text-xs'>{description}</p>
                { deliveryTime ? <p className='text-left text-xs text-defaultGreen font-bold'>{deliveryTime}</p> : null }
                { offer ? <p className='rounded text-[11px] m-1 p-1 text-center bg-yellow-500 font-bold text-white w-14 absolute top-0 right-0'>{offer}</p> : null }
            </div>
        </li>
    )
}

export function BasicCard({src, className, alt, description}: BasicCard) {
    return (
        <li className={clsx("", className)}>
            <div className="h-44 w-full">
                <img className='inset-0 h-full w-full object-cover' src={src} alt={alt}/>
            </div>
            <div className="f">
                <p className=' text-black text-center mt-3'>{description}</p>
            </div>
        </li>
    )
}
