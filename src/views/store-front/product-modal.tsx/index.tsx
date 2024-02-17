import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ModalHeader,
  } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { LoaderFunctionArgs, json, useLoaderData, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/fireStore';
import { priceFormat } from '../../../utils/currency';
import { AddToCartButton, Product } from '..';


export async function loader({ params }: LoaderFunctionArgs) {
    const { productId, storeId } = params as Record<string, string>;
    const productDoc = await getDoc(doc(db, 'store', storeId, 'product', productId));
    const product = { id: productDoc.id, ...productDoc.data()} ;
    return json({ product });
}

export function ProductModal() {
    const { product } = useLoaderData();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const initialRef = React.useRef(null);
    const imgRef = React.useRef<HTMLImageElement|null>(null);
    const headerRef = React.useRef<HTMLElement|null>(null);
    const intersectionTargetRef = React.useRef<HTMLElement|null>(null);
    const rootTargetRef = React.useRef<HTMLElement | null>(null);
    const imgContainerRef = React.useRef<HTMLDivElement|null>(null);

    function handleMouseLeave() {
        if (imgRef.current)
            imgRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clientRect = imgContainerRef.current?.getBoundingClientRect();
        if (clientRect && imgRef.current) {
            const width = clientRect.width;
            const height = clientRect.height;
            const left = clientRect.left;
            const top = clientRect.top;
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
    
            imgRef.current.style.transformOrigin = `${x}% ${y}%`;
            imgRef.current.style.transform = `scale(1.75)`;
        }
    }

    React.useEffect(() => {
        onOpen();
        return() => onClose();
    }, [])

    React.useEffect(() => {
        const target = intersectionTargetRef.current;
        if (!target && !headerRef.current) return;
        const options = {
            root: rootTargetRef.current,
            rootMargin: "0px",
            threshold: [0.9, 0.7, 0.3, 0], // remove some value later if needed
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                if (entry.intersectionRatio < 0.3) {
                    headerRef.current.style.visibility = "visible";
                    headerRef.current.style.opacity = "1";
                    headerRef.current.style.height = "6rem";
                    headerRef.current.className = 'flex items-center justify-between animate-open-header shadow-xl flex absolute z-50 w-full top-0 bg-white';
                }
                 else {
                     headerRef.current.style.height =  "0rem";
                     headerRef.current.style.opacity = "0";
                     headerRef.current.className = 'flex items-center transition-opacity justify-between animate-close-header shadow-xl flex absolute z-50 w-full top-0 bg-white'

                }
            }
        }, options)

        observer.observe(target);

        return () => { target && observer.unobserve(target) };
    });

    return (
      <>
        <Modal isOpen={isOpen} isCentered initialFocusRef={initialRef}
            scrollBehavior='inside'
            onClose={() => {
                navigate('../');
                onClose();
            }}>
          <ModalOverlay />
          <ModalContent className='min-h-[90vh] min-w-[90vw] rounded-3xl overflow-hidden' style={{position: 'relative', borderRadius: '16px'}} ref={rootTargetRef}>
            <div ref={headerRef} className="hidden" style={{paddingLeft: '0px', paddingRight: '0px', height: '0px'}}>
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
                    <button className='ml-12 relative group h-10 w-96 font-bold text-lg hover:bg-green-800 bg-defaultGreen py-2 rounded-3xl text-white px-4'>
                        <span>Add {1} to cart</span>
                        <span className='absolute right-2 bg-green-900 top-1/2 -translate-y-1/2 px-2 rounded-3xl text-[14px] group-hover:bg-defaultGreen'>{priceFormat(product?.price * 1)}</span>
                    </button>
                </div>

            </div>
            <ModalBody>
                <ModalCloseButton style={{borderRadius: '50%', fontWeight: 'bold', fontSize: '16px', right: '12px', top: '12px', outline: 'none'}}/>
                <div className='flex justify-between gap-10 p-3 h-full mt-8'>
                    <div onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} ref={imgContainerRef}
                        className='cursor-crosshair h-96 overflow-hidden relative flex justify-center items-center w-full'>
                        <img ref={imgRef} className='absolute object-fit h-64' src={product?.imgUrl} alt={product?.name}/>
                    </div>
                    <div className='px-5 py-5 border-[1px] rounded-3xl max-w-[450px]'>
                        <div className='mb-8'>
                            <h1 className='text-left text-3xl font-bold mb-2 capitalize'>{ product.name }</h1>
                            <p className='text-gray-400 font-bold text-xl'>{priceFormat(product?.price)}</p>
                        </div>
                        <div className='flex gap-2 justify-between items-center'>
                            <AddToCartButton />
                            <button ref={intersectionTargetRef} className='relative group h-10 w-96 font-bold text-lg hover:bg-green-800 bg-defaultGreen py-2 rounded-3xl text-white px-4'>
                                <span>Add {1} to cart</span>
                                <span className='absolute right-2 bg-green-900 top-1/2 -translate-y-1/2 px-2 rounded-3xl text-[14px] group-hover:bg-defaultGreen'>{priceFormat(product?.price * 1)}</span>
                            </button>
                        </div>
                        <div>
                            <div className='w-full border-[1px] my-4'></div>
                            <h1 className='font-bold text-md text-gray-800'>Details:</h1>
                            <p className='text-gray-600'>{ product.description }</p>
                        </div>
                    </div>
                </div>
                <div className='mt-10'>
                    <h1 className='text-2xl font-bold'>Similar products</h1>
                    <div className='grid xl:grid-cols-4 2xl:grid-cols-5 mt-5'>
                        {
                            Array.from({length: 10}).map((_, idx) => (
                                <Product to={`../product/${'GIEBauzYuUDi5AbSRbzU'}`} key={idx} product={{price: 3.99, name: 'Garba', description: 'Très bon vers 10h'} as Product}/>
                            ))
                        }
                    </div>
                </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}
