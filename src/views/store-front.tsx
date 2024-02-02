import clsx from "clsx";
import React from "react";
import { ActionFunctionArgs, useFetcher } from "react-router-dom"


export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const count = formData.get('itemCount');
    return count;
}

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
            <div className="absolute right-1 bottom-8">
                <AddToCartButton/>
            </div>
        </div>
    )
}

export function AddToCartButton() {
    // const fetcher = useFetcher({key: 'bag-count'});
    const [isOpen, setIsOpen] = React.useState(false)
    const [ count, setCount ] = React.useState(0);

    const containerRef = React.useRef<HTMLElement|null>(null);
    function handleBlur(e) {
        if (!(containerRef?.current as HTMLElement)?.contains(e.target)) {
            setIsOpen(false);
        }
    }

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleBlur)
        }
        return () => {
            document.removeEventListener('click', handleBlur);
        }
    })

    return (
        // <fetcher.Form method="post">
            <div
                ref={containerRef}
                onClick={() => {
                    setIsOpen(true);
                }}
                className={clsx("border rounded-3xl flex shadow-custom items-center bg-white", {
                    "animate-open-add-to-card": isOpen,
                })}>
                <button
                    onClick={() => setCount(count => count == 0 ? 0 : count - 1)}
                    type="submit"
                    className={clsx("hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center", {
                        "flex": isOpen,
                        "hidden": !isOpen,
                    })}>
                    <span>-</span>
                </button>
                <div className={clsx("items-center justify-center px-2", {
                    "flex": isOpen,
                    "hidden": !isOpen,
                })}>{count}</div>
                <button
                    onClick={() => {
                        if (isOpen || !isOpen && count === 0) {
                            setCount(count => count + 1);
                        }
                    }}
                    name="itemCount"
                    type="submit"
                    className="flex hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center">
                    <span>{ !isOpen && count > 0 ? count : "+" }</span>
                </button>
            </div>
        // </fetcher.Form>
    )
}
