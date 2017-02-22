module.exports = {
	buildExpressionArray: buildExpressionArray
};

function buildExpressionArray(string) {
	const infixArr = tokenize(string);
	return convertTokenArrToPostfix(infixArr);
}


function tokenize(string) {
	if (!isInputValid(string)) {
		throw new Error("Input cannot start or end with the symbols , | & ");
	}

	let tokenArr = [];
	let i = 0;
	let char = "", expr = "";

	while (i < string.length) {
		char = string.charAt(i);

		if (char === " ") {
			i += 1;
		}
		else if (char in tokenDict) {
			tokenArr.push(tokenDict[char]);
			i += 1;
		}
		else {
			expr = "";

			while (!(char in tokenDict) && i < string.length) {
				expr += char;
				
				i += 1;
				char = string.charAt(i);
			}

			tokenArr.push({
				tokenType: TokenType.LITERAL, 
				value: expr.trim(), 
				precedence: 9
			});
		}
	}

	return tokenArr;
}

function isInputValid(string) {
	const input = string.trim();

	if (input.charAt(0) in tokenDict || input.charAt(input.length - 1) in tokenDict) {
		return false;
	}

	return true;
}

// Shunting yard algorithm
function convertTokenArrToPostfix(tokenArr) {
	let postfixArr = [];
	let stack = [];

	for (let i=0; i<tokenArr.length; i++) {
		switch (tokenArr[i]["tokenType"]) {
		
		case TokenType.LITERAL:
			postfixArr.push(tokenArr[i]);
			break;

		case TokenType.BINARY_OP:
			// If stack is empty or contains left parenthesis
			if (stack.length === 0 || peek(stack)["tokenType"] === TokenType.OPEN_PAREN) {
				stack.push(tokenArr[i]);
			}
			// If operator has higher precedence than the one on the stack
			else if (tokenArr[i]["precedence"] < peek(stack)["precedence"]) {
				stack.push(tokenArr[i]);
			}
			// If operator has lower precedence than the one on the stack
			else {
				while (tokenArr[i]["precedence"] > peek(stack)["precedence"]) {
					postfixArr.push(stack.pop());
				}
			}
			break;

		case TokenType.OPEN_PAREN:
			stack.push(tokenArr[i]);
			break;

		case TokenType.CLOSE_PAREN:
			while (peek(stack)["tokenType"] !== TokenType.OPEN_PAREN) {
				postfixArr.push(stack.pop());
			}
			// Discard open paren
			stack.pop();
			break;
		}
	}

	while (stack.length !== 0) {
		const token = stack.pop();

		if (token["tokenType"] === TokenType.OPEN_PAREN) {
			throw new Error("Brackets in the expression are not balanced.");
		}

		postfixArr.push(token);
	}

	return postfixArr;
}

function peek(stack) {
	return stack[stack.length - 1];
}


const TokenType = {
	OPEN_PAREN: "OPEN_PAREN",
	CLOSE_PAREN: "CLOSE_PAREN",
	BINARY_OP: "BINARY_OP",
	LITERAL: "LITERAL"
};

const tokenDict = {
	"(": 
		{
			tokenType: TokenType.OPEN_PAREN, 
			value: "(", 
			precedence: 0
		},
	")": 
		{
			tokenType: TokenType.CLOSE_PAREN, 
			value: ")", 
			precedence: 0
		},
	"&": 
		{
			tokenType: TokenType.BINARY_OP, 
			value: "AND", 
			precedence: 1
		},	
	",": 
		{
			tokenType: TokenType.BINARY_OP, 
			value: "OR", 
			precedence: 2
		},
	"|": 
		{
			tokenType: TokenType.BINARY_OP, 
			value: "OR", 
			precedence: 2
		},
};


// function prettyPrintTokenArr(tokenArr) {
// 	console.log(tokenArr.map(token => token["value"]));
// }

// const infixArr = tokenize("kabir, khandpur )& guitar &");
// prettyPrintTokenArr(infixArr);

// const postfixArr = convertTokenArrToPostfix(infixArr);
// prettyPrintTokenArr(postfixArr);