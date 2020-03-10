let createAndAppend = ({className, parentElement, value}, tag = 'div') => {
    let element = document.createElement(tag);
    element.className = className;

    if (value) element.innerHTML = value;

    if (parentElement) parentElement.appendChild(element);

    return element;
};

let getRandomIntInclusive = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

new Game(document.getElementById('container'), 4);