import * as isNumber from 'is-number'
type Token = { precedence?: number, LeftAssociative?: Boolean, func: (a: number, b: number) => number }
type Func = { func: (a: number, b?: number) => number, binary: boolean }
export default class Calculator {
	private readonly operatorsStack: string[] = []
	private readonly output: number[] = []

	private postfix: string[] = []
	private result: number

	constructor(tokensOrStr: string[] | string) {
		const tokens = [
			'(',
			...(tokensOrStr instanceof Array) ?
				(tokensOrStr as string[]) :
				(tokensOrStr as string).trim().split(' ').filter(a => a !== ''),
			')'
		]


		for (let i = 0, len = tokens.length; i < len; i++) {
			const token = tokens[i]
			if (isNumber(token)) {
				this.postfix.push(token)
				this.output.push(+token)
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
		if (this.output.length > 1) throw new Error('too much parameter')
		this.result = this.output.pop()

	}

	calc() {
		const op = this.operatorsStack.pop()
		if (this.isOperator(op)) {
			const b = this.output.pop()
			const a = this.output.pop()
			if (a === undefined || b === undefined) throw new Error('less parameter')
			this.output.push(Calculator.operators[op].func(+a, +b))
		}
		else if (this.isFunc(op)) {
			if (Calculator.funcs[op].binary) {
				const b = this.output.pop()
				const a = this.output.pop()
				if (a === undefined || b === undefined) throw new Error('less parameter')
				this.output.push(Calculator.funcs[op].func(+a, +b))
			}
			else {
				const a = this.output.pop()
				if (a === undefined) throw new Error('less parameter')
				this.output.push(Calculator.funcs[op].func(+a))
			}
		}
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
			'log10': {
				func: a => Math.log10(a),
				binary: false
			},
			'ln': {
				func: a => Math.log(a),
				binary: false
			},
			'sin': {
				func: (a) => Math.sin(a),
				binary: false
			},
			cos: {
				func: a => Math.cos(a),
				binary: false
			},
			tan: {
				func: a => Math.tan(a),
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