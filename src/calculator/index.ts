import Decimal from "decimal.js";
import { err, ok } from "neverthrow";

import { processPlugins } from "./Plugins/plugin-manager";

//import { latexToExpression } from "./internal/latex-parser";

import evaluate from "./internal/evaluator";
import tokenise from "./internal/tokeniser";

export type { Token, TokenId } from "./internal/tokeniser";
export { tokenise, evaluate };

export type AngleUnit = "deg" | "rad";

export function calculate(
	expression: string,
	ans: Decimal,
	ind: Decimal,
	angleUnit: AngleUnit
) {
	const processedExpression = processPlugins(expression);

	const tokens = tokenise(processedExpression);
	if (tokens.isErr()) return err(tokens);

	const result = evaluate(tokens.value, ans, ind, angleUnit);
	if (result.isErr()) return err(tokens);

	return ok(result.value);
}
