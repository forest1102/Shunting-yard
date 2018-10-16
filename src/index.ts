import * as isNumber from 'is-number'
import Calculator from './calculator'
const calc = new Calculator('log10 ( 10 * 10 ^ 2 )')
console.log('result:', calc.getResult)
console.log('postfix:', calc.getPostfix)

