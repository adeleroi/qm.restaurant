export type CustomizationOption = {
    _id: string,
    name: string,
    price: number,
}

export type Customization = {
    _id: string,
    title: string,
    maxNumOptions: number,
    minNumOptions: number,
    options: Array<CustomizationOption>,
}

export type Article = {
    _id: string,
    storeId: string,
    categoryId: string,
    subCategoryId: Array<string>,
    type: string,
    name: string,
    description: string,
    price: number,
    imgUrl: string,
    hasCustomization: boolean,
    isSoldOut: boolean,
    customizations: Array<Customization>,
    quantity?: number,
}
