import clsx from "clsx";

type FoodCardProps = { src?: string, className?: string, alt:string, description: string, title: string };
export function FoodCard({src, className, alt, title, description}: FoodCardProps) {
    return (
        <li className={clsx("", className)}>
            <img className='absolute inset-0 h-full w-full object-cover' src={src} alt={alt}/>
            <div style={{bottom: 0}} className='absolute inset-x-0 bg-gradient-to-t from-black/70 from-50%'>
                <div className='w-52'>
                <h2 className='p-4 text-2xl text-white font-semibold'>{title}</h2>
                <div className="grid grid-rows-[0fr] transition-all pb-4 group-hover:grid-rows-[1fr]">
                    <p className='overflow-hidden px-3 font-medium text-white opacity-0 transition duration-300 group-hover:opacity-100'>{description}</p>
                </div>
                </div>
            </div>
        </li>
    )
}

export function StoreCard({src, className, alt, title, description}: FoodCardProps) {
    return (
        <li className={clsx("flex justify-start items-center border-2 h-20 rounded-2xl px-2 hover:shadow-custom cursor-pointer", className)}>
            <div className="w-20 flex justify-center items-center mr-2">
                <img className='w-14 h-14 object-cover rounded-full' src={src} alt={alt}/>
            </div>
            <div className=''>
                <h2 className='text-left text-xl text-black font-semibold'>{title}</h2>
                <p className='text-left text-xs'>{description}</p>
            </div>
        </li>
    )
}

export function BasicCard({src, className, alt, description}: Omit<FoodCardProps, 'title'>) {
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
