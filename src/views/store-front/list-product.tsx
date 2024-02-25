import React, { JSXElementConstructor } from "react"
import { Product } from "."

export function ListOfProduct({ productList } : { productList: Array<Product> }) {
    return (
        <React.Fragment>
            <div className="mt-10">
                <p className="text-md underline font-bold">{productList.length} Result(s)</p>
            </div>
            <div className="grid xl:grid-cols-5 2xl:grid-cols-6 gap-8 justify-between mt-10 mb-32">
                {
                    productList?.map(product => {
                        return <Product product={product} key={product?.id} action={`/store/${product.storeId}`}/>
                    })
                }            
            </div>
        </React.Fragment>
    )
}

export function ListOfProductByCategory({ categories, productMap } : { categories: Array<string>, productMap: Record<string, Array<Product>> }) {
    return (
        <React.Fragment>
            {
                categories?.map(category => (
                    <div key={category}>
                        {
                            productMap[category]?.length ? (
                                <ScrollableList as="ul" title={category}>
                                    <React.Fragment>
                                        {
                                            productMap?.[category]?.map((prod, idx) => {
                                                return (
                                                    <div key={idx} className="snap-center">
                                                        <Product product={prod} action={`/store/${prod.storeId}`}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                </ScrollableList>
                            ) : null
                        }
                    </div>
                ))
            }
        </React.Fragment>
    )
}

type AsProps = { onScroll: () => void, children: React.ReactNode, ref: React.MutableRefObject<HTMLDivElement | null>, className: string };

export function ScrollableList({ as="div", title, children }: { as:string, children: React.ReactNode, title: string }) {
    const As = as as unknown as JSXElementConstructor<AsProps>;
    const slideRef = React.useRef<HTMLDivElement | null>(null);
    const [ disabledNextBtn, setDisabledNextBtn ] = React.useState(false);
    const [ disabledPrevBtn, setDisabledPrevBtn ] = React.useState(true);

    const [ displayScrollBtn, setDisplayScrollBtn ] = React.useState(false);

    function handleClick(position: 'left' | 'right') {
        const el = slideRef.current;
        if (!el) return;
        el.scrollBy({
            left: position === 'left' ? - el.offsetWidth : el.offsetWidth,
            behavior: "smooth",
        });
    }

    function handleScroll() {
        const el = slideRef.current
        if (!el) return;
        const prevBtnActivationTreshold = 0; // 0.5 * el.offsetWidth;
        if (el.scrollLeft > prevBtnActivationTreshold) {
            setDisabledPrevBtn(false)
        } else {
            setDisabledPrevBtn(true)
        }

        const hasReachedTheRightEndSide = el.scrollLeft + el.offsetWidth == el.scrollWidth;
        if (hasReachedTheRightEndSide) {
            setDisabledNextBtn(true);
        } else {
            setDisabledNextBtn(false)
        }
    }

    React.useEffect(() => {
        const el = slideRef.current;
        if (el) {
            setDisplayScrollBtn(el.scrollWidth > el.offsetWidth);
        }
    }, [])

    return (
        <div className="mb-16 mt-10" key={title}>
            <div className="flex justify-between w-full">
                <h1 className="text-2xl font-bold capitalize">{title}</h1>
                {
                  displayScrollBtn ? (
                    <div className="flex gap-2">
                        <button disabled={disabledPrevBtn} onClick={() => handleClick('left')} className="disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-gray-200 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 text-black grid place-items-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                                arrow_back_ios
                            </span>
                        </button>
                        <button disabled={disabledNextBtn} onClick={() => handleClick('right')} className="disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-gray-200  rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 text-black grid place-items-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                                arrow_forward_ios
                            </span>
                        </button>
                    </div>
                    ): null

                }
            </div>
            <As className="item-list my-5 py-4 gap-2 mb-10 flex overflow-x-auto snap-x scroll-smooth" ref={slideRef} onScroll={handleScroll}>
                { children }
            </As>
        </div>
    )
}
