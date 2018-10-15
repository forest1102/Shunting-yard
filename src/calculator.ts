import * as isNumber from 'is-number'
type Token = { precedence?: number, LeftAssociative?: Boolean, func: (a: number, b: number) => number }
type Func = { func: (a: number, b?: number) => number, binary: boolean }
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
			else if (this.isFunc(token)) {
				this.operatorsStack.push(token)
			}
			else if (this.isOperator(token)) {

				let top = this.operatorsStack[this.operatorsStack.length - 1]

				while (top !== undefined && top !== '(' && (
					this.isFunc(token) ||
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
			else {
				throw new Error('unexpected character.\nMaybe you forgot the space or mistype func name')
			}
		}

	}

	calc() {
		console.log(this.operatorsStack, this.output, this.postfix)
		const op = this.operatorsStack.pop()
		if (this.isOperator(op)) {
			const b = this.output.pop()
			const a = (this.result === undefined) ? this.output.pop() : this.result
			this.result = Calculator.operators[op].func(+a, +b)
		}
		else if (this.isFunc(op)) {
			if (Calculator.funcs[op].binary) {
				const b = this.output.pop()
				const a = (this.result === undefined) ? this.output.pop() : this.result
				this.result = Calculator.funcs[op].func(+a, +b)
			}
			else {
				const a = (this.result === undefined) ? this.output.pop() : this.result
				this.result = Calculator.funcs[op].func(+a)
			}
		}
		console.log(this.result)
		this.postfix.push(op)
		return this.operatorsStack[this.operatorsStack.length - 1]
	}

	get getResult() {
		return this.result
	}

	static readonly funcs: { [key: string]: Func } = Object.freeze(
		{
			'sqrt': {
				func: a => Math.sqrt(a),
				binary: false
			},
			'log': {
				func: (a, b) => Math.log(b) / Math.log(a),
				binary: true
			},
			'ln': {
				func: a => Math.log(a),
				binary: false
			},
			'sin': {
				func: (a) => Math.sin(a),
				binary: false
			},
			'nthrt': {
				func: (a, b) => Math.pow(a, 1 / b),
				binary: true
			}
		}
	)


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
		return Calculator.operators.hasOwnProperty(token)
	}

	isFunc(token: string) {
		return Calculator.funcs.hasOwnProperty(token)
	}

	get getPostfix() {
		return this.postfix
	}

}