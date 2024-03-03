import { faker } from '@faker-js/faker';
import { Food, FoodOption, FoodOptionList } from './model';

export function createRandomFood(): Food {
    const customization = Array.from({length: 3}, () =>({
        ...generateFoodOptionList(),
    }))
    return {
        id: faker.string.uuid(),
        description: faker.lorem.sentences(2),
        name: faker.word.noun(),
        price: faker.number.float({min: 10.0, max: 34.99}),
        imgUrl: faker.image.urlLoremFlickr({ category: 'food' }),
        customization,
    }
}

function generateFoodOptionList(): FoodOptionList {
    let min = faker.number.int({min: 0, max: 2});
    let max = faker.number.int({min: min, max: min + 3});
    if (min > max) {
        [min, max] = [max, min];
    }
    
    const options: Array<FoodOption> = Array.from({length: max + 2}).map(() => ({
        ...generateOption()
    }))

    return {
        id: faker.string.uuid(),
        title: faker.lorem.words({min: 2, max: 5}),
        isOptional: false, //(max == 1 && min == 1) ? false : true,
        maxNumOptions: max,
        minNumOptions: min,
        options,
    }
}

function generateOption(): FoodOption {
    return {
        id: faker.string.uuid(),
        name: faker.lorem.words({min: 1, max: 3}),
        price: faker.number.float({min: 1.99, max: 6.49}),
    }
}
