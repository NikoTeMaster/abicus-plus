import type { CalculatorPlugin } from "./types";

import latexPlugin from "./LaTeX-Translator";

const plugins: CalculatorPlugin[] = [
    latexPlugin,
];

export function processPlugins(input: string): string {
    let result = input;

    for (const plugin of plugins) {
        if (!plugin.enabled) continue;

        result = plugin.transform(result);
    }

    return result;
}

export function getPlugins() {
    return plugins;
}
