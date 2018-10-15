import * as isNumber from 'is-number'
import Calculator from './calculator'
const calc = new Calculator('log 10 ( 3 ^ 2 )')
console.log('result:', calc.getResult)
console.log('postfix:', calc.getPostfix)

