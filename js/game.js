class Game {
    constructor(parentElement, size = 4) {
        let gameElement = createAndAppend({className: 'game', parentElement});

        let headerElement = createAndAppend({className: 'header', parentElement: gameElement});

        this.rating = 0;
        headerElement.innerHTML = 'Рейтинг: ' + this.rating;

        let fieldElement = createAndAppend({className: 'field', parentElement: gameElement});

        for (let i = 0; i < size; i++) {
            for (let k = 0; k < size; k++) {
                new Cell(fieldElement);
            }
        }
    }
}