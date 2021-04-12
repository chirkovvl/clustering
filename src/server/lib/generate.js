function generatePoints(width, height, radius, quantity) {
    let points = [];
    console.log(width, height, radius, quantity);
    while (quantity) {
        const x = randomNumber(radius, width - radius);
        const y = randomNumber(radius, height - radius);
        points.push({ x, y });
        quantity--;
    }

    return points;
}

function randomNumber(min, max) {
    return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
}

module.exports = generatePoints;
