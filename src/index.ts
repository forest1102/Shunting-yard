import Calculator from './calculator'
import * as readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const askCalculation = () => {
	rl.question('Calculate:\n', tokens => {
		if (tokens === 'exit' || tokens === '') {
			rl.close()
			return
		}
		const calc = new Calculator(tokens)

		console.log('result:', calc.getResult)
		console.log('postfix:', calc.getPostfix)
		askCalculation()
	})
}
askCalculation()




