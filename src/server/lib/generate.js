function generatePoints({ numberPoints, width, height, pointSize }) {
    let arrayPoints = [];

    while (numberPoints) {
        const x = randomNumber(pointSize, width - pointSize);
        const y = randomNumber(pointSize, height - pointSize);
        arrayPoints.push({ x, y });
        numberPoints--;
    }
    return arrayPoints;
}

function randomNumber(min, max) {
    return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
}

module.exports = generatePoints;
