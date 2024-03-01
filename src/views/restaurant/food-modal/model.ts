export type FoodReview = {
    display: string,
}

export type FoodOption = {
    id: string, // to use in the radio button or the name
    name: string,
    price?: number,
    imgUrl?: string,
}

export type FoodOptionList = {
    id: string,
    title: string, // Drink choice, Chicken size,
    maxNumOptions: number,
    minNumOptions: number,
    isOptional: boolean,
    options: Array<FoodOption>
}

export type Food = {
    id: string,
    name: string,
    price: number,
    currency?: "CAD",
    description?: string,
    imgUrl?: string,
    reviewData?: FoodReview
    customization: Array<FoodOptionList>
}
