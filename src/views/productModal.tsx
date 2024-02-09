import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { LoaderFunctionArgs, json, useLoaderData, useNavigate } from 'react-router-dom';
import { db } from '../firebase/fireStore';
import { ButtonActionAndValue } from '../components/cart';


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
    const imgContainerRef = React.useRef<HTMLDivElement|null>(null);

    function handleMouseLeave() {
        if (imgRef.current)
            imgRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }

    function handleMouseMove(e) {
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
    }, [])

    return (
      <>
        <Modal isOpen={isOpen} size={"6xl"} isCentered initialFocusRef={initialRef}
            onClose={() => {
                navigate(-1);
                onClose();
            }}>
          <ModalOverlay />
          <ModalContent className='p-4 min-h-[90vh]' style={{borderRadius: '20px'}}>
            <ModalCloseButton style={{borderRadius: '50%', fontWeight: 'bold', fontSize: '16px', left: '8px'}}/>
            <ModalBody>
                <div className='grid grid-cols-2 gap-10 p-3 mt-8'>
                    <div onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} ref={imgContainerRef}
                        className='cursor-crosshair h-96 overflow-hidden relative flex justify-center items-center'>
                        <img ref={imgRef} className='absolute object-fit h-5/6 w-fuull' src='https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/a54d9543-62b4-47bc-8c59-d6605d86a0a1-retina-large.jpg'/>
                    </div>
                    <div className='h-96 border-2 rounded-3xl px-5 py-5'>
                        <h1 className='text-left text-3xl font-bold mb-2'>{ product.name }</h1>
                        <p className='text-gray-600'>$3.99/kg</p>
                        <p className='text-left text-xl font-semibold'>${ product.price }</p>
                        <br/>
                        <ButtonActionAndValue subtotal={3.99} >Add to cart</ButtonActionAndValue>
                        <div className='w-full border-[1px] my-4'></div>
                        <h1 className='font-bold text-md text-gray-800'>Details:</h1>
                        <p className='text-gray-600'>{ product.description }</p>
                    </div>
                </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}
