import {
    // Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,

    // Spinner
    Spinner
  } from '@chakra-ui/react'
import React, { LegacyRef, useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { priceFormat } from '../../../utils/currency';
import { ButtonIncrement, Product } from '..';
import clsx from 'clsx';
import { ProductCountProvider } from './product-count-provider';
import { useProductCountContext } from './product-count-context';

interface IntersectionObserverOption {
    root: HTMLElement|null,
    rootMargin?: HTMLElement['style']['margin'],
    threshold: Array<number>, // number mjust be less than or equal to 1,
}

function useIntersectionObserverEffect(
    targetRef:  React.MutableRefObject<HTMLElement | null>,
    callBack: IntersectionObserverCallback,
    options: IntersectionObserverOption,
) {
    React.useEffect(() => {
        const target = targetRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(callBack, options)
        observer.observe(target);
        return () => { target && observer.unobserve(target) };
    });
}

const SHOW_HEADER_STYLE = 'will-change-auto h-24 opacity-100 flex items-center justify-between animate-open-header shadow-xl flex absolute z-50 w-full top-0 bg-white';
const HIDE_HEADER_STYLE = 'will-change-auto h-0 opacity-0 flex items-center transition-opacity justify-between animate-close-header shadow-xl flex absolute z-50 w-full top-0 bg-white';

export function ImageZoom({imgUrl, imgAlt }: { imgUrl: string, imgAlt: string }) {
    const imgRef = React.useRef<HTMLImageElement|null>(null);
    const imgContainerRef = React.useRef<HTMLDivElement|null>(null);

    function handleMouseLeave() {
        if (imgRef.current)
            imgRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clientRect = imgContainerRef.current?.getBoundingClientRect();
        if (clientRect && imgRef.current) {
            const { width, height, left, top } = clientRect;
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
    
            imgRef.current.style.transformOrigin = `${x}% ${y}%`;
            imgRef.current.style.transform = `scale(1.7)`;
        }
    }

    return (
        <div onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} ref={imgContainerRef}
            className='cursor-crosshair h-96 overflow-hidden relative flex justify-center items-center w-full'>
            <img ref={imgRef} className='absolute object-fit h-64' src={imgUrl} alt={imgAlt}/>
            <div className=' bg-bg-product absolute inset-0'></div>
        </div>
    )
}

const CustomModalHeader = React.forwardRef(({product}: {product: Product}, headerRef) => {
    const { quantity, updateQuantity, hasQuantityChanged, isAlreadyInCart, isSubmitting, submitToCart } = useProductCountContext();
    return (
        <div ref={headerRef as LegacyRef<HTMLDivElement> | undefined} className="hidden" style={{paddingLeft: '0px', paddingRight: '0px'}}>
            <div  className='pl-10 flex items-center gap-2'>
                <div className='w-12 h-12 rounded-xl overflow-hidden'>
                    <img src={product?.imgUrl} className='object-contain'/>
                </div>
                <div>
                    <h1 className='text-xl font-bold mr-16 capitalize'>{ product?.name }</h1>
                    <span className='font-bold text-gray-500'>{priceFormat(product?.price)}</span>
                </div>
            </div>
            <div className='flex gap-2 justify-between items-center'>
                <ButtonIncrement getCount={updateQuantity} cartCount={quantity} disabled={isSubmitting} limitInf={1} onLimitDisable alwaysOnDisplay/>
                <div className='mr-10 pr-2 min-w-[360px] max-w-[500px]'> {/** 360px -> 400px - width of the ButtonIncrement. same width as in ProductDetails */}
                    <AddToCartWithCountButton
                        count={quantity}
                        price={product?.price}
                        onClick={submitToCart}
                        isSubmitting={isSubmitting}
                        hasQuantityChanged={hasQuantityChanged}
                        isAlreadyInCart={isAlreadyInCart}
                    />
                </div>
            </div>
        </div>
    )
})

const ProductDetails = React.forwardRef(function ProductDetails({ product }: { product: Product }, ref) {
    const { quantity, updateQuantity, hasQuantityChanged, isAlreadyInCart, isSubmitting, submitToCart } = useProductCountContext();
   
    return (
        <div className='px-5 py-5 border-[1.2px] rounded-lg min-w-[400px] max-w-[500px] h-full min-h-72'>
            <div className='mb-8 relative w-full flex items-center justify-between'>
                <h1 className='text-black font-bold text-xl'>{priceFormat(product?.price)}</h1>
                <ButtonIncrement getCount={updateQuantity} cartCount={quantity} disabled={isSubmitting} limitInf={1} onLimitDisable alwaysOnDisplay/>
            </div>
            <div className='w-full grid gap-2'>
                <AddToCartWithCountButton
                    ref={ref}
                    count={quantity}
                    price={product?.price}
                    onClick={submitToCart}
                    isSubmitting={isSubmitting}
                    hasQuantityChanged={hasQuantityChanged}
                    isAlreadyInCart={isAlreadyInCart}
                />
            </div>
            <div className=''>
                <div className='w-full border-[1px] border-gray-300 my-4'></div>
                <h1 className='mt-8 font-bold text-md text-gray-800'>Details:</h1>
                <p className='text-gray-600'>{ product.description }</p>
            </div>
        </div>
    )
})

function SimilarProduct({ productList }: { productList: Array<Product> }) {
    return (
        <div className='mt-10'>
            <h1 className='capitalize text-2xl font-bold mb-5'>Similar items</h1>
            <div className='grid xl:grid-cols-5 2xl:grid-cols-6 place-items-center'>
                {
                    productList?.map(product => (
                        <Product key={product?.name} action={`/store/${product.storeId}`} product={product} to={`../product/${product.id}`}/>
                    ))
                }
            </div>
        </div>
    )
}

type AddToCartWithCountButtonProps = {
    count: number,
    price: number,
    type?: 'button' | 'submit',
    disabled?: boolean,
    hasQuantityChanged?: boolean,
    isAlreadyInCart?: boolean,
    isSubmitting?: boolean,
    onClick?: () => void,
}

const AddToCartWithCountButton = React.forwardRef(function AddToCartWithCountButton({ count, price, onClick, disabled, hasQuantityChanged, isAlreadyInCart, isSubmitting, type="submit" }: AddToCartWithCountButtonProps, ref) {
    const disableButton = disabled || isSubmitting || !hasQuantityChanged && isAlreadyInCart;
    
    function getText() {
        if (hasQuantityChanged && isAlreadyInCart) return "Update quantity";
        if (isAlreadyInCart) return `In cart (${count})`;
        return `Add ${count ? count : ''} to cart`;
    }


    return (
        <button
            className={clsx('relative group h-12 w-full font-bold text-lg py-2 rounded-lg text-white px-4', {
                'bg-green-800 cursor-not-allowed': disableButton,
                'bg-defaultGreen hover:bg-green-800': !disableButton
            })}
            disabled={disableButton}
            onClick={onClick}
            type={type}
            ref={ref as LegacyRef<HTMLButtonElement> | undefined}
        >
            <span className='mr-4'>{ isSubmitting ? <Spinner color='white' size="sm" /> : null }</span>
            <span className={clsx('capitalize', {'text-gray-100': disableButton})}>{getText()}</span>
            <span className={clsx('absolute right-2 top-1/2 -translate-y-1/2 px-2 rounded-lg text-[15px]', {
                'group-hover:bg-defaultGreen  bg-green-900': !disableButton,
                'text-gray-100 bg-green-800': disableButton
            })}>{priceFormat(count > 0 ? price * count: price)}</span>
        </button>
    )
})

type ProductModalLoader = {
    product: Product,
    similarProductList: Array<Product>,
    cartItemMap: Record<string, number>
}

export function ProductModal() {
    const { product, similarProductList, cartItemMap } = useLoaderData() as ProductModalLoader;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const headerRef = React.useRef<HTMLElement|null>(null);
    const intersectionTargetRef = React.useRef<HTMLElement|null>(null);
    const rootTargetRef = React.useRef<HTMLElement | null>(null);

    const callback = useCallback((entries: Array<IntersectionObserverEntry>) => {
        if (headerRef.current) {
            const entry = entries[0];
            if (entry.isIntersecting) {
                if (entry.intersectionRatio < 0.9) {
                    headerRef.current.className = SHOW_HEADER_STYLE;
                } else {
                    headerRef.current.className = HIDE_HEADER_STYLE;
                }
            }
        }
    }, [])

    React.useEffect(() => {
        onOpen();
        return() => onClose();
    }, [onOpen, onClose, product.id]);

    useIntersectionObserverEffect(
        intersectionTargetRef,
        callback,
        {root: rootTargetRef?.current, threshold: [0.9, 0.7, 0.3, 0]}
    )

    return (
      <>
        <Modal isOpen={isOpen} isCentered
            scrollBehavior='inside'
            onClose={() => {
                navigate('../');
                onClose();
            }}>
          <ModalOverlay />
          <ModalContent className='min-h-[90vh] 2xl:min-w-[75vw] min-w-[85vw] overflow-hidden' style={{position: 'relative', borderRadius: 0}} ref={rootTargetRef}>
            <ProductCountProvider key={product.name} product={product} isAlreadyInCart={!!cartItemMap?.[product?.id]}>
                <CustomModalHeader product={product} ref={headerRef}/>
                <ModalBody>
                    <div className='mt-5'>
                        <h1 className='capitalize mb-5 text-2xl font-bold'>{ product?.name }</h1>
                        <div className='flex justify-between gap-10 h-full border-gray-300 rounded-lg'>
                            <ImageZoom imgAlt={product?.name} imgUrl={product?.imgUrl} />
                            <ProductDetails product={product} ref={intersectionTargetRef} />
                        </div>
                    </div>
                    { similarProductList.length ? <SimilarProduct productList={similarProductList} /> : null }
                </ModalBody>
            </ProductCountProvider>
          </ModalContent>
        </Modal>
      </>
    )
}
