export function makeRandomColor() {
    return `hsl(${Math.random() * 360}, ${Math.random() * 40 + 30}%, ${Math.random() * 40 + 30}%)`;
}
