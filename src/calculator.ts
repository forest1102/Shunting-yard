import * as isNumber from 'is-number'
type Token = { precedence?: number, LeftAssociative?: Boolean, func: (a: number, b: number) => number }
export default class Calculator {
	private readonly operatorsStack: string[] = []
	private readonly output: string[] = []

	private postfix: string[] = []
	private result: number

	constructor(tokensOrStr: string[] | string) {
		const tokens = [
			'(',
			...(tokensOrStr instanceof Array) ? (tokensOrStr as string[]) : (tokensOrStr as string).split(' '),
			')'
		]


		for (let i = 0, len = tokens.length; i < len; i++) {
			console.log(this.operatorsStack, this.output, this.postfix)
			const token = tokens[i]
			if (isNumber(token)) {
				this.postfix.push(token)
				this.output.push(token)
			}
			else if (this.isOperator(token)) {

				let top = this.operatorsStack[this.operatorsStack.length - 1]

				while (top !== undefined && Calculator.operators[top] !== undefined && (
					(Calculator.operators[token].LeftAssociative &&
						(Calculator.operators[token].precedence <= Calculator.operators[top].precedence)) ||
					(!Calculator.operators[token].LeftAssociative &&
						(Calculator.operators[token].precedence < Calculator.operators[top].precedence))
				)) {

					top = this.calc()
				}
				this.operatorsStack.push(token)
			}
			else if (token === '(') {
				this.operatorsStack.push(token)
			}
			else if (token === ')') {
				while (this.operatorsStack[this.operatorsStack.length - 1] !== '(') {
					this.calc()
				}
				this.operatorsStack.pop()
			}
		}

	}

	calc() {
		console.log(this.operatorsStack, this.output, this.postfix)
		const op = this.operatorsStack.pop()
		const b = this.output.pop()
		const a = (this.result === undefined) ? this.output.pop() : this.result
		this.result = Calculator.operators[op].func(+a, +b)
		console.log(this.result)
		this.postfix.push(op)
		return this.operatorsStack[this.operatorsStack.length - 1]
	}

	get getResult() {
		return this.result
	}

	static readonly operators: { [key: string]: Token } = Object.freeze(
		{
			'+': {
				precedence: 1,
				LeftAssociative: true,
				func: (a, b) => a + b
			},
			'-': {
				precedence: 1,
				LeftAssociative: true,
				func: (a, b) => a - b
			},
			'*': {
				precedence: 2,
				LeftAssociative: true,
				func: (a, b) => a * b
			},
			'/': {
				precedence: 2,
				LeftAssociative: true,
				func: (a, b) => a / b
			},
			'^': {
				precedence: 3,
				LeftAssociative: false,
				func: (a, b) => Math.pow(a, b)
			}
		}
	)

	isOperator(token: string) {
		return Calculator.operators[token] !== undefined
	}

	get getPostfix() {
		return this.postfix
	}

}