let gameOverMessage = 'Try again!';

class Game {
    constructor(parentElement, size = 4) {
        this.size = size;

        this.gameElement = createAndAppend({className: 'game', parentElement});
        this.gameElement.id = 'game';

        createAndAppend({className: 'title', parentElement: this.gameElement}).innerHTML = '2048';
        this.headerElement = createAndAppend({className: 'header', parentElement: this.gameElement});

        this.ratingElement = createAndAppend({
            className: 'rating',
            parentElement: this.headerElement
        });
        this.rating = 0;

        this.bestElement = createAndAppend({
            className: 'best',
            parentElement: this.headerElement
        });
        this.best = 0;

        this.restartElement = createAndAppend({
            className: 'restart',
            parentElement: this.headerElement,
            value: 'Restart'
        }, 'button');

        this.restartElement.addEventListener('click', () => this.clearField());
        this.restartElement.addEventListener('touchstart', () => this.clearField());

        this.gameContainerElement = createAndAppend({className: 'game-container', parentElement: this.gameElement});
        this.fieldElement = createAndAppend({className: 'field', parentElement: this.gameContainerElement});

        this.clearField();

        // arrow keys
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
            }
        });

        // swipes
        window.addEventListener('load', () => {
            let el = document.getElementById('game');
            swipedetect(el, (swipedir) => {
                switch (swipedir) {
                    case 'up':
                        this.moveUp();
                        break;
                    case 'down':
                        this.moveDown();
                        break;
                    case 'left':
                        this.moveLeft();
                        break;
                    case 'right':
                        this.moveRight();
                        break;
                }
            });
        }, false);


    }

    isLastKey(key) {
        return key === this.size - 1;
    }

    isFirstKey(key) {
        return key === 0;
    }

    set rating(value) {
        this._rating = value;
        this.ratingElement.innerHTML = 'Rating: ' + value;
        if (value > this.best) this.best = value;
    }

    set best(value) {
        this._best = value;
        this.bestElement.innerHTML = 'Best: ' + value;
    }

    get best() {
        return this._best;
    }

    get rating() {
        return this._rating;
    }

    addRating(value) {
        this.rating += value;
    }

    moveRight() {
        let hasMoved = false;
        for (let i = 0; i < this.size; i++) {
            for (let k = this.size - 2; k >= 0; k--) {
                hasMoved = this.move(i, k, false, true, this.isLastKey.bind(this)) || hasMoved;
            }
        }

        if (hasMoved) {
            this.spawnCell();

            if (this.isNoMovesLeft())
                alert(gameOverMessage);
        }
    }

    moveLeft() {
        let hasMoved = false;
        for (let i = 0; i < this.size; i++) {
            for (let k = 1; k < this.size; k++) {
                hasMoved = this.move(i, k, false, false, this.isFirstKey.bind(this)) || hasMoved;
            }
        }

        if (hasMoved) {
            this.spawnCell();

            if (this.isNoMovesLeft())
                alert(gameOverMessage);
        }
    }

    moveDown() {
        let hasMoved = false;
        for (let i = this.size - 2; i >= 0; i--) {
            for (let k = 0; k < this.size; k++) {
                hasMoved = this.move(i, k, true, true, this.isLastKey.bind(this)) || hasMoved;
            }
        }

        if (hasMoved) {
            this.spawnCell();

            if (this.isNoMovesLeft())
                alert(gameOverMessage);
        }
    }

    moveUp() {
        let hasMoved = false;
        for (let i = 1; i < this.size; i++) {
            for (let k = 0; k < this.size; k++) {
                hasMoved = this.move(i, k, true, false, this.isFirstKey.bind(this)) || hasMoved;
            }
        }

        if (hasMoved) {
            this.spawnCell();

            if (this.isNoMovesLeft())
                alert(gameOverMessage);
        }
    }

    move(i, k, isI, isIncrement, keyCheck) {
        let hasMoved = false;

        let inc = isIncrement ? 1 : -1;
        let currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
            return hasMoved;
        }

        let nextCellKey = (isI ? i : k) + inc;
        while (nextCellKey < this.size && nextCellKey >= 0) {
            let nextCell = this.field[isI ? nextCellKey : i][isI ? k : nextCellKey];
            if (!nextCell.isEmpty || keyCheck(nextCellKey)) {
                if ((nextCell.isEmpty && keyCheck(nextCellKey))
                    || nextCell.isSameTo(currentCell)) {
                    this.field[isI ? nextCellKey : i][isI ? k : nextCellKey].merge(currentCell);
                    hasMoved = true;
                } else if (!nextCell.isEmpty && ((isI && (nextCellKey + (inc * -1) !== i)) || (!isI && (nextCellKey + (inc * -1) !== k)))) {
                    this.field[isI ? nextCellKey + (inc * -1) : i][isI ? k : nextCellKey + (inc * -1)].merge(currentCell);
                    hasMoved = true;
                }

                break;
            }
            nextCellKey += inc;
            nextCell = this.field[isI ? nextCellKey : i][isI ? k : nextCellKey];
        }

        return hasMoved;
    }

    spawnCell() {
        let emptyCells = [];
        for (let i = 0; i < this.field.length; i++) {
            for (let k = 0; k < this.field[i].length; k++) {
                if (this.field[i][k].value === 0) {
                    emptyCells.push(this.field[i][k]);
                }
            }
        }
        emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)].spawn();
    }

    clearField() {
        this.fieldElement.innerHTML = '';
        this.field = [];
        for (let i = 0; i < this.size; i++) {
            this.field[i] = [];
            let rowElement = createAndAppend({className: 'row', parentElement: this.fieldElement});
            for (let k = 0; k < this.size; k++) {
                this.field[i][k] = new Cell(rowElement, this);
            }
        }
        this.rating = 0;
    }

    isNoMovesLeft() {
        if (this.isNoEmptyCells()) {
            for (let i = 0; i < this.size; i++) {
                for (let k = 0; k < this.size - 1; k++) {
                    if (this.field[i][k].value === this.field[i][k + 1].value
                        || this.field[k][i].value === this.field[k + 1][i].value) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    isNoEmptyCells() {
        for (let i = 0; i < this.size; i++) {
            for (let k = 0; k < this.size; k++) {
                if (this.field[i][k].value === 0) {
                    return false;
                }
            }
        }
        return true;
    }
}