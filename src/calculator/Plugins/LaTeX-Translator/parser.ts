
/**
 * Abicus LaTeX Parser
 *
 * Converts numerical LaTeX expressions into syntax
 * understood by the existing Abicus tokeniser.
 *
 * Supported:
 *
 * Fractions:
 *   \frac{a}{b}
 *   \dfrac{a}{b}
 *   \tfrac{a}{b}
 *
 * Roots:
 *   \sqrt{x}
 *
 * Powers:
 *   x^2
 *   x^{2}
 *
 * Functions:
 *   \sin, \cos, \tan
 *   \arcsin, \arccos, \arctan
 *   \ln, \log, \lg
 *
 * Constants:
 *   \pi, \mathrm{pi}, e
 *
 * Operators:
 *   \cdot, \times, \div
 *
 * Formatting:
 *   \left, \right
 *   \quad, \qquad
 *   $...$, \(...\), \[...\]
 *
 * Nested groups and fractions are supported.
 */

export class LatexParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LatexParseError";
    }
}

const FUNCTIONS = new Set([
    "sin",
    "cos",
    "tan",
    "arcsin",
    "arccos",
    "arctan",
    "ln",
    "log",
    "lg",
    "sqrt",
]);

const FRACTIONS = new Set([
    "frac",
    "dfrac",
    "tfrac",
]);

const CONSTANTS: Record<string, string> = {
    pi: "pi",
};

const OPERATORS: Record<string, string> = {
    cdot: "*",
    times: "*",
    div: "/",
};

const FORMATTING_COMMANDS = new Set([
    "left",
    "right",
    "quad",
    "qquad",
    "!",
    ",",
    ";",
    ":",
]);

/**
 * Public parser entry point.
 */
export function latexToExpression(input: string): string {
    const parser = new LatexParser(input);
    return parser.parse();
}

class LatexParser {
    private position = 0;

    constructor(private readonly input: string) {}

    private get current(): string {
        return this.input[this.position] ?? "";
    }

    private get atEnd(): boolean {
        return this.position >= this.input.length;
    }

    private skipWhitespace(): void {
        while (/\s/.test(this.current) && !this.atEnd) {
            this.position++;
        }
    }

    private consume(value: string): boolean {
        if (this.input.startsWith(value, this.position)) {
            this.position += value.length;
            return true;
        }

        return false;
    }

    /**
     * Parses the complete expression.
     */
    parse(): string {
        this.skipMathDelimiters();

        const result = this.parseSequence();

        this.skipWhitespace();

        if (!this.atEnd) {
            throw new LatexParseError(
                `Unexpected character: ${this.current}`
            );
        }

        return result;
    }

    /**
     * Removes supported outer math delimiters.
     */
    private skipMathDelimiters(): void {
        this.skipWhitespace();

        if (this.consume("$$")) {
            this.inputEndDelimiter = "$$";
        } else if (this.consume("$")) {
            this.inputEndDelimiter = "$";
        } else if (this.consume("\\(")) {
            this.inputEndDelimiter = "\\)";
        } else if (this.consume("\\[")) {
            this.inputEndDelimiter = "\\]";
        }
    }

    private inputEndDelimiter: string | null = null;

    /**
     * Parses an expression until the end or a closing brace.
     */
    private parseSequence(): string {
        let output = "";

        while (!this.atEnd) {
            this.skipWhitespace();

            if (this.atEnd) break;

            if (this.current === "}") {
                break;
            }

            // LaTeX commands
            if (this.current === "\\") {
                output += this.parseCommand();
                continue;
            }

            // Grouping
            if (this.current === "{") {
                output += this.parseGroup();
                continue;
            }

            // Powers
            if (this.current === "^") {
                this.position++;
                output += "^(" + this.parseArgument() + ")";
                continue;
            }

            // Subscripts are not supported by the numerical
            // Abicus expression engine.
            if (this.current === "_") {
                throw new LatexParseError(
                    "Subscripts are not supported."
                );
            }

            // Remove math delimiters
            if (this.current === "$") {
                this.position++;
                continue;
            }

            output += this.current;
            this.position++;
        }

        return output;
    }

    /**
     * Parses a {...} group.
     */
    private parseGroup(): string {
        if (!this.consume("{")) {
            throw new LatexParseError("Expected opening brace.");
        }

        const content = this.parseSequence();

        if (!this.consume("}")) {
            throw new LatexParseError("Unclosed group.");
        }

        return `(${content})`;
    }

    /**
     * Parses a command argument.
     *
     * Accepts either {...} or a single character.
     */
    private parseArgument(): string {
        this.skipWhitespace();

        if (this.current === "{") {
            return this.parseGroupContent();
        }

        if (this.atEnd) {
            throw new LatexParseError("Missing command argument.");
        }

        if (this.current === "\\") {
            return this.parseCommand();
        }

        const character = this.current;
        this.position++;

        return character;
    }

    /**
     * Parses the contents of a group without adding
     * an extra pair of parentheses.
     */
    private parseGroupContent(): string {
        if (!this.consume("{")) {
            throw new LatexParseError("Expected group.");
        }

        const content = this.parseSequence();

        if (!this.consume("}")) {
            throw new LatexParseError("Unclosed group.");
        }

        return content;
    }

    /**
     * Reads and processes a LaTeX command.
     */
    private parseCommand(): string {
        this.position++;

        if (this.atEnd) {
            throw new LatexParseError("Incomplete command.");
        }

        // Commands consisting of a single character
        if (!/[a-zA-Z]/.test(this.current)) {
            const character = this.current;
            this.position++;

            switch (character) {
                case "(":
                case ")":
                case "[":
                case "]":
                    return "";

                case " ":
                case ",":
                case ";":
                case ":":
                case "!":
                    return "";

                default:
                    throw new LatexParseError(
                        `Unsupported escaped character: \\${character}`
                    );
            }
        }

        const match = /^[a-zA-Z]+/.exec(
            this.input.slice(this.position)
        );

        if (!match) {
            throw new LatexParseError("Invalid command.");
        }

        const command = match[0];
        this.position += command.length;

        // Fractions
        if (FRACTIONS.has(command)) {
            const numerator = this.parseArgument();
            const denominator = this.parseArgument();

            return `((${numerator})/(${denominator}))`;
        }

        // Square roots
        if (command === "sqrt") {
            return `sqrt(${this.parseArgument()})`;
        }

        // Functions
        if (FUNCTIONS.has(command)) {
            return command;
        }

        // Constants
        if (command in CONSTANTS) {
            return CONSTANTS[command];
        }

        // Operators
        if (command in OPERATORS) {
            return OPERATORS[command];
        }

        // Formatting commands
        if (FORMATTING_COMMANDS.has(command)) {
            return "";
        }

        throw new LatexParseError(
            `Unsupported LaTeX command: \\${command}`
        );
    }
}
