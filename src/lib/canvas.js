export function getOutsideCanvasPosition({canvas, radius, padding = 0}) {
    const isHideByX = Math.random() < 0.5;
    if (isHideByX) {
        return {
            x: Math.random() < 0.5 ? 0 - radius : canvas.width + radius,
            y: Math.random() * (canvas.height - padding) + padding,
        }
    }
    return {
        x: Math.random() * (canvas.width - padding) + padding,
        y: Math.random() < 0.5 ? 0 - radius : canvas.height + radius,
    }
}
