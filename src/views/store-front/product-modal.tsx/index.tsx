import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
  } from '@chakra-ui/react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useCallback } from 'react';
import { LoaderFunctionArgs, json, useLoaderData, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/fireStore';
import { priceFormat } from '../../../utils/currency';
import { AddToCartButton, Product } from '..';

interface IntersectionObserverOption {
    root: HTMLElement|null,
    rootMargin?: HTMLElement['style']['margin'],
    threshold: Array<number>, // number mjust be less than or equal to 1,
}

function useIntersectionObserverEffect(
    targetRef:  React.MutableRefObject<HTMLElement|null>,
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

export async function loader({ params }: LoaderFunctionArgs) {
    const { productId, storeId } = params as Record<string, string>;
    const productDoc = await getDoc(doc(db, 'store', storeId, 'product', productId));
    const similarProductList: Array<Product> = [];
    const currProduct = { id: productDoc.id, ...productDoc.data() } as Product ;
    const similarProductQuery = query(collection(db, "store", storeId, "product"), where('category', '==', currProduct.category));
    const similarProductSnapshot = await getDocs(similarProductQuery);

    similarProductSnapshot.forEach(product => {
        if (product.id !== currProduct.id) {
            similarProductList.push({ id: product.id, ...product.data() } as Product);
        }
    })

    return json({ product: currProduct, similarProductList });
}

const SHOW_HEADER_STYLE = 'h-24 opacity-100 flex items-center justify-between animate-open-header shadow-xl flex absolute z-50 w-full top-0 bg-white';
const HIDE_HEADER_STYLE = 'h-0 opacity-0 flex items-center transition-opacity justify-between animate-close-header shadow-xl flex absolute z-50 w-full top-0 bg-white';

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
        </div>
    )
}

const CustomModalHeader = React.forwardRef(({product}: {product: Product}, headerRef) => {
    return (
        <div ref={headerRef} className="hidden" style={{paddingLeft: '0px', paddingRight: '0px'}}>
            <div  className='pl-10 flex items-center gap-2'>
                <div className='w-12 h-12 rounded-xl overflow-hidden'>
                    <img src={product?.imgUrl} className='object-contain'/>
                </div>
                <div>
                    <h1 className='text-xl font-bold mr-16'>{ product?.name }</h1>
                    <span className='font-bold text-gray-400'>{priceFormat(product?.price)}</span>
                </div>
            </div>
            <div className='flex gap-2 justify-between items-center mr-14' >
                <AddToCartButton />
                <button className='ml-4 relative group h-10 w-80 font-bold text-lg hover:bg-green-800 bg-defaultGreen py-2 rounded-3xl text-white px-4'>
                    <span>Add {1} to cart</span>
                    <span className='absolute right-2 bg-green-900 top-1/2 -translate-y-1/2 px-2 rounded-3xl text-[14px] group-hover:bg-defaultGreen'>{priceFormat(product?.price * 1)}</span>
                </button>
            </div>
        </div>
    )
})

const ProductDetails = React.forwardRef(function ProductDetails({ product }: {product: Product}, ref) {
    return (
        <div className='px-5 py-5 hover:shadow-custom rounded-3xl min-w-[400px] max-w-[500px] h-full min-h-72'>
            <div className='mb-8 relative w-full flex items-center justify-between'>
                <p className='text-gray-400 font-bold text-xl'>{priceFormat(product?.price)}</p>
                <AddToCartButton />
            </div>
            <div className='flex justify-between items-center'>
                <button ref={ref} className='relative group h-10 w-full font-bold text-lg hover:bg-green-800 bg-defaultGreen py-2 rounded-3xl text-white px-4'>
                    <span>Add {1} to cart</span>
                    <span className='absolute right-2 bg-green-900 top-1/2 -translate-y-1/2 px-2 rounded-3xl text-[14px] group-hover:bg-defaultGreen'>{priceFormat(product?.price * 1)}</span>
                </button>
            </div>
            <div className=''>
                <div className='w-full border-[1px] my-4'></div>
                <h1 className='mt-8 font-bold text-md text-gray-800'>Details:</h1>
                <p className='text-gray-600'>{ product.description }</p>
            </div>
        </div>
    )
})

function SimilarProduct({ productList }: { productList: Array<Product> }) {
    return (
        <div className='mt-10'>
            <h1 className='text-2xl font-bold mb-5'>Similar items</h1>
            <div className='grid xl:grid-cols-5 2xl:grid-cols-6 place-items-center'>
                {
                    productList?.map(product => (
                        <Product key={product?.name} product={product}/>
                    ))
                }
            </div>
        </div>
    )
}

export function ProductModal() {
    const { product, similarProductList } = useLoaderData() as { product: Product, similarProductList: Array<Product> };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const headerRef = React.useRef<HTMLElement|null>(null);
    const intersectionTargetRef = React.useRef<HTMLElement|null>(null);
    const rootTargetRef = React.useRef<HTMLElement | null>(null);

    const callback = useCallback((entries: Array<IntersectionObserverEntry>) => {
        if (headerRef.current) {
            const entry = entries[0];
            if (entry.isIntersecting) {
                if (entry.intersectionRatio < 0.3) {
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
    }, [onOpen, onClose]);

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
          <ModalContent className='min-h-[90vh] 2xl:min-w-[75vw] xl:min-w-[85vw] rounded-3xl overflow-hidden' style={{position: 'relative', borderRadius: '16px'}} ref={rootTargetRef}>
            <CustomModalHeader product={product} ref={headerRef}/>
            <ModalBody>
                <div className='mt-5'>
                    <h1 className='mb-5 text-2xl font-bold'>{ product?.name }</h1>
                    <div className='flex justify-between gap-10 p-3 h-full border-[1px] border-gray-200 rounded-3xl'>
                        <ImageZoom imgAlt={product?.name} imgUrl={product?.imgUrl} />
                        <ProductDetails product={product} ref={intersectionTargetRef} />
                    </div>
                </div>
                <SimilarProduct productList={similarProductList} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}
