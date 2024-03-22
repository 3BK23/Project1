const unitLength = 25;
let boxColor = 150;
const strokeColor = 150;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let loneliness_threshold = 2;
let overpopulation_threshold = 3;
let reproduction_threshold = 3;
let slider;
let color = 150;
let currentPoint = [0, 0];


window.addEventListener("load", () => {

    document.querySelector(".slidecontainer").addEventListener("change", (e) => {
        const value = parseInt(e.target.value)
        frameRate(value);
    })
    document.querySelector(".colorPickerContainer").addEventListener("input", (e) => {
        boxColor = e.target.value
    })
    document.querySelector("#buttonRandom").addEventListener("click", (e) => {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = random() > 0.8 ? 1 : 0;
                nextBoard[i][j] = 0;
            }
        } redraw();
    })


    document.querySelector("#buttonPlay").addEventListener("click", (e) => {
        loop()//play the game
    })

    document.querySelector("#buttonPause").addEventListener("click", () => {
        noLoop()//Pause the Game
    })

    //  reset Button
    document.querySelector("#reset-game").addEventListener("click", function () {
        init();
        draw()
    });

    document.querySelector(".buttonDarkMode").addEventListener("click", () => {
        document.body.classList.toggle("buttonDarkMode")
    })

    document.querySelector("#loneliness-select").addEventListener("change", (e) => {
        loneliness_threshold = parseInt(e.target.value)
    })
    document.querySelector("#overpop-select").addEventListener("change", (e) => {
        overpopulation_threshold = parseInt(e.target.value)
    })
    document.querySelector("#reproduction-select").addEventListener("change", (e) => {
        reproduction_threshold = parseInt(e.target.value)
    })


})

function setup() {
    frameRate(5)
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth - 1000, windowHeight - 1000);
    canvas.parent(document.querySelector("#canvas"));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init(); // Set the initial values of the currentBoard and nextBoard
}


function windowResized() {
    resizeCanvas(windowWidth - 200, windowHeight - 200);
    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
    }
    draw()
}

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
    currentBoard[currentPoint[0]][currentPoint[1]] = 2
    noLoop()
}


function draw() {
    background(255);
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                if (nextBoard[i][j] == 1) {
                    fill(tinycolor(boxColor).darken(40).toString());
                } else
                    fill(boxColor);
            } else if (currentBoard[i][j] == 2) {
                fill(177, 128, 215);
            } else {
                fill(255, 228, 196);
            }

            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}
function colorPick() {

    $(document).ready(function () {
        var color = tinycolor("red");
        alert(color.spin(72).toHexString());
    })
}


function keyPressed() {
    console.log(keyCode)
    if (keyCode === LEFT_ARROW) {
        currentBoard[currentPoint[0]][currentPoint[1]] = 0;
        let x = currentPoint[0] === 0 ? columns - 1 : currentPoint[0] - 1;
        currentPoint = [x, currentPoint[1]];
    } else if (keyCode === RIGHT_ARROW) {
        currentBoard[currentPoint[0]][currentPoint[1]] = 0;
        let x = currentPoint[0] === columns - 1 ? 0 : currentPoint[0] + 1;
        currentPoint = [x, currentPoint[1]];


    } else if (keyCode === UP_ARROW) {
        currentBoard[currentPoint[0]][currentPoint[1]] = 0;
        let y = currentPoint[1] === 0 ? rows - 1 : currentPoint[1] - 1;
        currentPoint = [currentPoint[0], y];
    } else if (keyCode === DOWN_ARROW) {
        currentBoard[currentPoint[0]][currentPoint[1]] = 0;
        let y = currentPoint[1] === rows - 1 ? 0 : currentPoint[1] + 1;
        currentPoint = [currentPoint[0], y];
    } else if (keyCode === ENTER) {
        
      }
    currentBoard[currentPoint[0]][currentPoint[1]] = 2;
    loop();
}
function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors +=
                        currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }


            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < loneliness_threshold) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > overpopulation_threshold) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == reproduction_threshold) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

   
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/* When mouse is dragged
 */

/**
 * If the mouse coordinate is outside the board
 */



function mouseDragged() {

    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }

    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);

    currentBoard[x][y] = 1;
    fill(218, 75, 38);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

}


/**
 * When mouse is pressed
 */
function mousePressed() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
}

/**
 * When mouse is released
 */
function mouseReleased() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }


}
