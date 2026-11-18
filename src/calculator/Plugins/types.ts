export interface CalculatorPlugin {
    id: string;
    name: string;
    description: string;

    enabled: boolean;

    transform(input: string): string;
}
