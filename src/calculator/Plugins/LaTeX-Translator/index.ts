import type { CalculatorPlugin } from "../types";
import { latexToExpression } from "./parser";

const latexPlugin: CalculatorPlugin = {
    id: "latex",
    name: "LaTeX Support",
    description: "Allows mathematical LaTeX input.",
    enabled: true,

    transform(input: string): string {
        if (!input.includes("\\")) {
            return input;
        }

        return latexToExpression(input);
    },
};

export default latexPlugin;
