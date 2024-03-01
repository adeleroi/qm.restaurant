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
    const options: Array<FoodOption> = Array.from({length: 4}).map(() => ({
        ...generateOption()
    }))
    const min = faker.number.int({min: 0, max: 1});
    const max = faker.number.int({min: 1, max: 2});

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
