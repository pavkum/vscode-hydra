export enum ConsoleColors {
    RED = 1,
    GREEN = 2,
    YELLOW = 3,
    BLUE = 4
}


export default function(text: string, color: ConsoleColors): string {
    let output = '';
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char === ' ' || char === '\r' || char === '\n') {
            output += char;
        } else {
            output += `\x1b[3${color}m${text.charAt(i)}\x1b[0m`;
        }
    }
    return output + '\r\n';
}