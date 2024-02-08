import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/button';

export function ProductModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const initialRef = React.useRef(null);
    const imgRef = React.useRef<HTMLImageElement|null>(null);
    const imgContainerRef = React.useRef<HTMLDivElement|null>(null);
    // const [ coordinate, setCoordinate] = React.useState({x:0, y:0, scale: 1});

    function handleMouseLeave(e) {
        // const img = document.getElementById('img-ref');
        if (imgRef.current)
            imgRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }

    function handleMouseMove(e) {
        const width = 1600;
        const halfX = width / 2;
        const calcX = halfX - e.clientX;
        const height = 500;
        const halfY = height / 2;
        const calcY = halfY - e.clientY;
        // setCoordinate({x: calcX, y: calcY, scale: 1.4});
        // const img = document.getElementById('img-ref')
        if (imgRef.current) {
            imgRef.current.style.transform = `translate(${calcX}px, ${calcY}px) scale(1.6)`

        }
    }

    React.useEffect(() => {
        onOpen();
    }, [])

    // React.useLayoutEffect(() => {
    //     if (imgRef.current) {
    //         const {x, y, scale} = coordinate;
    //         const value = `translate(${x}px, ${y}px) scale(${scale})`;
    //         imgRef.current.style.transform = value;
    //     }
    // })

    return (
      <>
        <Modal isOpen={isOpen} size={"6xl"} isCentered initialFocusRef={initialRef}
            onClose={() => {
                navigate(-1);
                onClose();
            }}>
          <ModalOverlay />
          <ModalContent className='p-4 min-h-[90vh]'>
            <ModalCloseButton style={{borderRadius: '50%', fontWeight: 'bold', fontSize: '16px'}}/>
            <ModalBody>
                <div className='flex items-center w-full justify-center mb-4'>
                    <div onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} ref={imgContainerRef} className='cursor-crosshair w-[600px] overflow-hidden relative min-h-[400px] max-h-[800px] flex justify-center items-center border-2 border-black rounded-xl'>
                        <img ref={imgRef} className='absolute object-fit h-full w-full' src='https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/a54d9543-62b4-47bc-8c59-d6605d86a0a1-retina-large.jpg'/>
                    </div>

                </div>
                <div className='w-full'>
                    <h1 className='text-left text-3xl font-bold'>Product Name</h1>
                    <p className='text-left text-xl font-semibold'>$15.99</p>
                </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}
