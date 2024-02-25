import React from 'react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

export function ProductListSkeleton() {
    return (
        <React.Fragment>
            {
                Array.from({length: 5}).map((_, idx) => ((
                    <React.Fragment key={idx}>
                    <div className="mt-16 w-32">
                        <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={1} skeletonHeight={4}/>
                    </div>
                    <div className="grid xl:grid-cols-5 2xl:grid-cols-6 gap-8 my-10">
                        {
                            Array.from({length: 6}).map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <div>
                                        <div className="w-52 h-48 rounded-xl overflow-hidden relative">
                                            <Skeleton startColor="gray.100" endColor="gray.200" key={idx} className="w-full h-full mb-2 rounded-3xl"></Skeleton>
                                            <SkeletonCircle startColor={"gray.100"} className="absolute top-36 right-2 bg-white" />
                                        </div>
                                        <div className="w-56">
                                            <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={2} mt={2} spacing={2} skeletonHeight={2}/>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                    </React.Fragment>
                )))
            }
        </React.Fragment>
    )
}

export function FilteredProductListSkeleton() {
    return (
        <>
            <div className="mt-16 w-32">
                <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={1} skeletonHeight={4}/>
            </div>
            <div className="grid xl:grid-cols-5 2xl:grid-cols-6 gap-8 mt-10">
                {
                    Array.from({length: 50}).map((_, idx) => (
                        <React.Fragment key={idx}>
                            <div>
                                <div className="w-52 h-48 rounded-xl overflow-hidden relative">
                                    <Skeleton startColor="gray.100" endColor="gray.200" key={idx} className="w-full h-full mb-2 rounded-3xl"></Skeleton>
                                    <SkeletonCircle startColor={"gray.100"} className="absolute top-36 right-2 bg-white" />
                                </div>
                                <div className="w-52">
                                    <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={2} mt={2} spacing={2} skeletonHeight={2}/>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    )
}
