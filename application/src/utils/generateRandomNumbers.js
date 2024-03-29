import { getRandomNumber } from "../nameGenerator/generator"

/**
 * Generates a list of random numbers betweeen the range specified.
 * @param {*} min 
 * @param {*} max 
 * @param {*} count 
 */
export const generateRandomNumbers = (count, min = 0, max = 100) => {
    const nums = []
    for (i = 0; i < count; i++) {
        nums.push(getRandomNumber(min, max))
    }
    return nums
}