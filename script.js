(function () {
    let canvas = document.getElementById("screen");
    let ctx = canvas.getContext("2d");
    let board = {xMax: 32, yMax: 16};
    let cellSize = 25;
    let gameOver = 0;
    let flagMode = false;
    let mineCount = 99;
    let flagCount = 0;
    let minesFlagged = 0;
    let grid = [];

    class GridCell {
        constructor(xVar, yVar, valueVar) {
            this.x = xVar * cellSize;
            this.y = yVar * cellSize;
            this.value = valueVar;
            this.covered = true;
            this.flagged = false;
        }
    
        render() {
            if (this.covered && !this.flagged) {
                ctx.fillStyle = "#7c7e80";
                ctx.fillRect(this.x, this.y, cellSize, cellSize);
                ctx.strokeStyle = "black";
                ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            } else if (this.flagged) {
                ctx.fillStyle = "#7c7e80";
                ctx.fillRect(this.x, this.y, cellSize, cellSize);
                ctx.fillStyle = "#84fa92";
                ctx.beginPath();
                ctx.arc(this.x + (cellSize / 2), this.y + (cellSize / 2), 10, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            } else {
                if (this.value === 0) {
                    ctx.fillStyle = "#bdbdbd";
                    ctx.fillRect(this.x, this.y, cellSize, cellSize);
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(this.x, this.y, cellSize, cellSize);
                } else if (this.value === 9) {
                    ctx.fillStyle = "#bdbdbd";
                    ctx.fillRect(this.x, this.y, cellSize, cellSize);
                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    ctx.arc(this.x + (cellSize / 2), this.y + (cellSize / 2), 10, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(this.x, this.y, cellSize, cellSize);
                } else {
                    ctx.fillStyle = "#bdbdbd";
                    ctx.fillRect(this.x, this.y, cellSize, cellSize);
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(this.x, this.y, cellSize, cellSize);
                    switch (this.value) {
                        case 1:
                            ctx.fillStyle = "blue";
                            break;
                        case 2:
                            ctx.fillStyle = "green";
                            break;
                        case 3:
                            ctx.fillStyle = "red";
                            break;
                        case 4:
                            ctx.fillStyle = "purple";
                            break;
                        case 5:
                            ctx.fillStyle = "maroon";
                            break;
                        case 6:
                            ctx.fillStyle = "turquoise";
                            break;
                        case 7:
                            ctx.fillStyle = "gray";
                            break;
                        case 8:
                            ctx.fillStyle = "black";
                            break;
                    }
                    ctx.textAlign = "center";
                    ctx.font = "20px sans-serif";
                    ctx.fillText(this.value, this.x + (cellSize / 2), this.y + (cellSize * 0.75), cellSize);
                }
            }
        }
    }

    function randomNumGen(min, max) {
        return Math.floor(Math.random() * ((max - min) + 1)) + min;
    }
    
    function placeMine() {
        let x = randomNumGen(0, board.xMax - 1);
        let y = randomNumGen(0, board.yMax - 1);
        if (grid[x][y] === undefined) {
            grid[x][y] = new GridCell(x, y, 9);
        } else {
            placeMine();
        }
    }
    
    function uncoverCell(x, y) {
        if (grid[x][y].covered && !grid[x][y].flagged) {
            grid[x][y].covered = false;
            if (grid[x][y].value === 9) {
                gameOver = -1;
            } else if (grid[x][y].value === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < board.xMax && y + j >= 0 && y + j < board.yMax) {
                            uncoverCell((x + i), (y + j));
                        }
                    }
                }
            }
        }
    }
    
    function revealMines() {
        for (let i = 0; i < board.xMax; i++) {
            for (let j = 0; j < board.yMax; j++) {
                if (grid[i][j].flagged && grid[i][j].value != 9) {
                    grid[i][j].covered = false;
                    grid[i][j].flagged = false;
                    flagCount--;
                } else if (grid[i][j].covered) {
                    grid[i][j].covered = false;
                }
                grid[i][j].render();
            }
        }
    }
    
    function draw() {
        let flagState = "Off";
        if (flagMode) {
            flagState = "On";
        }
        document.getElementById("flag_state_display").innerHTML = "Flag Mode: " + flagState;
        if (!gameOver) {
            for (let i = 0; i < board.xMax; i++) {
                for (let j = 0; j < board.yMax; j++) {
                    grid[i][j].render();
                }
            }
        } else {
            revealMines();
            if (gameOver > 0) {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "green";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                ctx.textAlign = "center";
                ctx.font = "100px serif";
                ctx.fillStyle = "black";
                ctx.fillText("You Won", canvas.width / 2, canvas.height / 1.7);
            } else {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "red";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                ctx.textAlign = "center";
                ctx.font = "100px serif";
                ctx.fillStyle = "black";
                ctx.fillText("You Died", canvas.width / 2, canvas.height / 1.7);
            }
            document.getElementById("info_display").innerHTML = "Press [space] to play again.";
        }
        document.getElementById("mine_display").innerHTML = "Mines Flagged: " + flagCount + "/" + mineCount;
    }
    
    function getMouseCords(element, evt) {
        var bcr = canvas.getBoundingClientRect();
        return {
            x: Math.floor(((evt.clientX - bcr.left) / (bcr.right - bcr.left) * element.width) / cellSize),
            y: Math.floor(((evt.clientY - bcr.top) / (bcr.bottom - bcr.top) * element.height) / cellSize)
        };
    }
    
    function keyPressedEvent(event) {
        if (event.key === " ") {
            if (!gameOver) {
                if (!flagMode) {
                    flagMode = true;
                } else {
                    flagMode = false;
                }
                draw();
            } else {
                location.reload();
            }
        }
    }
    
    function onClickEvent(event) {
        let pos = getMouseCords(canvas, event);
        if (!gameOver && grid[pos.x] != undefined && grid[pos.x][pos.y] != undefined) {
            if (!flagMode) {
                uncoverCell(pos.x, pos.y);
                if (grid[pos.x][pos.y].flagged === true) {
                    grid[pos.x][pos.y].flagged = false;
                    flagCount--;
                    if (grid[pos.x][pos.y].value === 9) {
                        minesFlagged--;
                    }
                }
            } else if (grid[pos.x][pos.y].covered && !grid[pos.x][pos.y].flagged) {
                grid[pos.x][pos.y].flagged = true;
                flagCount++;
                if (grid[pos.x][pos.y].value === 9) {
                    minesFlagged++;
                }
            }
            if (minesFlagged === mineCount) {
                gameOver = 1;
            }
            draw();
        }
    }
    
    for (let i = 0; i < board.xMax; i++) {
        grid[i] = [];
    }
    
    for (let i = 0; i < mineCount; i++) {
        placeMine();
    }
    
    for (let i = 0; i < board.xMax; i++) {
        for (let j = 0; j < board.yMax; j++) {
            if (grid[i][j] === undefined) {
                let mineCounter = 0;
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i + k >= 0 && i + k < board.xMax && j + l >= 0 && j + l < board.yMax) {
                            if (grid[i + k] != undefined && grid[i + k][j + l] != undefined && grid[i + k][j + l].value === 9) {
                                mineCounter++;
                            }
                        }
                    }
                }
                grid[i][j] = new GridCell(i, j, mineCounter);
            }
        }
    }
    
    addEventListener("keydown", keyPressedEvent);
    addEventListener("click", onClickEvent);
    draw();
})();
