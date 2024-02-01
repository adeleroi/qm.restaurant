export function StoreFront() {
    return (
        <section className="grid pt-16 max-w-6xl mx-auto">
            <div className="flex w-full items-center pb-4 bg-brown-bg rounded-lg">
                <div className="pl-10">
                    <div className="w-20 flex justify-center items-center mr-2 my-4">
                        <img className='w-20 h-20 object-cover rounded-full' src="https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg" alt="lcbo-logo"/>
                    </div>
                    <div className="text-black">
                        <p className="font-bold text-3xl">LCBO</p>
                        <span className="text-xs font-semibold">Delivery fee (3.69$) . 275 Rideau St, Ottawa, K1N5Y3</span>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <ul className="grid grid-cols-4 gap-4">
                    {
                        Array.from({length: 10}, (_, idx) => {
                            return (
                                <li key={idx}>
                                    <Product/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </section>
    )
}


export function Product() {
    return (
        <div className="relative border-[1px] rounded-xl overflow-hidden p-2 pb-4 hover:shadow-custom cursor-pointer">
            <div className="p-4 h-32 bg-smoke mb-4">
                <img src="" alt=""/>
            </div>
            <div>
                <span className="text-xs">price . chicken breast . 645g</span>
            </div>
            <div className="absolute right-1 bottom-8 group hover:animate-add-to-card border rounded-3xl flex bg-white shadow-custom items-center">
                <button className="hidden group-hover:flex hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center">
                    <span>-</span>
                </button>
                <div className="hidden group-hover:flex items-center justify-center px-2">0</div>
                <button className="flex hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center">
                    <span>+</span>
                </button>
            </div>
        </div>
    )
}