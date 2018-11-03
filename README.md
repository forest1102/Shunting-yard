# Shunting-Yard with typescript

## How To Use


```typescript
import * as isNumber from 'is-number'
import Calculator from './calculator'

console.log(new Calculator('1 + 3 * 2 ^ 3 - 1').getResult)

```
```shell
$ npm start

> tsc && node ./lib/index.js

Calculate:
1 + 3 * 2 ^ 3 - 1
result: 24
postfix: [ '1', '3', '2', '3', '^', '*', '+', '1', '-' ]

```

<aside class="warning">
add a space between operand and operator
</aside>

