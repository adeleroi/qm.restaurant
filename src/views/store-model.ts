export type Geolocation = {
    long?: number,
    lat?: number,
    latitude: number,
    longitude: number,
    postalCode: string,
    streetAddress: string,
}

export type Location = {
    address: string,
    city: string, 
    country: string,
    geolocation: Geolocation
} 

export type Store = {
    _id: string,
    name: string,
    availabilityStatus: string,
    hours: Array<StoreSchedule>,
    imgUrl: string,
    logoUrl: string,
    location: Location,
    phone: string,
    description: string,
    productLine: Array<string>,
    type?: 'shop' | 'restaurant',
    estimatedTimeRange: string,
    deliveryFee: number,
}

export type SectionHour = {
    startTime: number,
    endTime: number,
}

export type StoreSchedule = {
    dayRange: string,
    sectionHours: Array<SectionHour>
}
