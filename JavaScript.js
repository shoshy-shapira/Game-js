var level=1;
var mat = [];
var arrRows = [0, 9, 16, 16]
var arrColumns = [0, 9, 16, 30]
var arrNumBombs = [0, 10, 40, 99]
var status2 = false;
var countFlags;
var countOpen;
var timePlay;
var pos;


function open2() {
    wrapper = document.getElementsByClassName('wrapperOpen')[0];
    for (var i = 0; i < 46; i++) {
        x = document.createElement('div');
        x.style.backgroundImage = "url(pall.png)";
        x.style.backgroundSize = '100% 100%';
        x.style.borderRadius='5px'
        wrapper.appendChild(x);

    }
}

function start() {
    countOpen = 0;
    if (localStorage && localStorage.getItem('level'))
        level = localStorage.getItem('level');
    countFlags = arrNumBombs[level];
    document.getElementById("wrapper").className = 'wrapper' + level;
    if (localStorage && localStorage.getItem('mat1'))
        continueGame();
    else
        newGame();
    status2 = true;
    document.getElementById('numFlags').innerHTML = countFlags;
}

function newGame() {
    zeroMat();
    randomBombs();
    createBoard();
    timePlay = 0;
    document.getElementById('timer').innerHTML = timePlay;
}

function zeroMat() {
    for (var i = 0; i < arrRows[level]; i++) {
        mat[i] = [];
        for (var j = 0; j < arrColumns[level]; j++) {
            mat[i][j] = 0;
        }
    }
}

function playAudio1() {
    document.getElementById("myAudio1").play();
}

function randomBombs() {
    for (var i = 0; i < arrNumBombs[level]; i++) {
        c = Math.floor(Math.random() * arrColumns[level]);
        r = Math.floor(Math.random() * arrRows[level]);
        while (mat[r][c] =='b') {
            c = Math.floor(Math.random() * arrColumns[level]);
            r = Math.floor(Math.random() * arrRows[level]);
        }
        mat[r][c] = 'b';
        updateBombs(r+1,c)
        updateBombs(r-1,c)
        updateBombs(r,c+1)
        updateBombs(r,c-1)
        updateBombs(r-1,c-1)
        updateBombs(r-1,c+1)
        updateBombs(r+1,c-1)
        updateBombs(r+1,c+1)
    }
}

function updateBombs(r, c) {
    if ( r < 0 || c < 0 || r >= arrRows[level] || c >= arrColumns[level]||mat[r][c] == 'b' )
        return;
    mat[r][c]++;
}

function createBoard() {
    playAudio1();
    board = document.getElementsByClassName("board")[0];
    board.innerHTML = '';
    for (var i = 0; i < arrRows[level]; i++) {
        for (var j = 0; j < arrColumns[level]; j++) {
            x = document.createElement("div");
            x.setAttribute("data-row",i);
            x.setAttribute("data-column", j);
            board.appendChild(x);
        }
    }
}

function continueGame() {
    helpMat = localStorage.getItem('mat1');
    helpMat = helpMat.split(',');
    arr = localStorage.getItem('mat2');
    arr = arr.split(',');
    timePlay = localStorage.getItem('timePlay');
    document.getElementById('timer').innerHTML = timePlay;
    pos=window.setInterval("timer()", 1000)
    localStorage.clear();
    myCount = 0;
    board = document.getElementsByClassName("board")[0];
    for (var i = 0; i < arrRows[level]; i++) {
        mat[i] = [];
        for (var j = 0; j < arrColumns[level]; j++) {
            mat[i][j] = helpMat[myCount];
            x = document.createElement("div");
            x.setAttribute("data-row", i);
            x.setAttribute("data-column", j);
            if (arr[myCount] == 'f') {
                x.style.backgroundImage = "url(pf.png)";
                countFlags--;
            }
            else
                if (arr[myCount] == 1) { 
                    x.style.backgroundImage = "url(p" + helpMat[myCount] + ".JPG)"
                    x.style.opacity = '1';
                    countOpen++;
                }
            board.appendChild(x);
            myCount++;
        }
    }
}

function rightClick() {
    if (!status2)
        return;
    event.preventDefault();
    if (event.target != event.currentTarget) {
        if (event.target.style.backgroundImage == "") {
            event.target.style.backgroundImage = "url(pf.png)"
            countFlags--;
        }
        else
            if (event.target.style.backgroundImage == 'url("pf.png")') { 
                event.target.style.backgroundImage = "";
                countFlags++;
            }
        document.getElementById('numFlags').innerHTML = countFlags;
    }
}

function timer() {
    document.getElementById('timer').innerHTML = timePlay;
    timePlay++;
}

function show() {
    if (!status2 || event.target.style.backgroundImage != "" || event.target == event.currentTarget) 
        return;
    if (timePlay == 0)
        pos=window.setInterval("timer()", 1000)
    timer();
    r = event.target.getAttribute("data-row");
    c = event.target.getAttribute("data-column");
    if (mat[r][c] == 'b') {
        exploded()
        return;
    }
    open1(Number(r), Number(c))
    if (countOpen == arrColumns[level] * arrRows[level] - arrNumBombs[level])
        win();
}
function open1(r, c) {
    if (r < 0 || c < 0 || r >= arrRows[level] || c >= arrColumns[level])
        return;
    x = document.getElementsByClassName("board")[0].children[arrColumns[level] * r + c]
    if (x.style.backgroundImage != "")
        return;
    x.style.backgroundImage = "url(p" + mat[r][c] + ".JPG)"
    x.style.opacity = '1';
    countOpen++;
    if (mat[r][c] == 0) {
        open1(r + 1, c)
        open1(r - 1, c)
        open1(r, c + 1)
        open1(r, c - 1)
        open1(r - 1, c - 1)
        open1(r - 1, c + 1)
        open1(r + 1, c - 1)
        open1(r + 1, c + 1)
    }
}

async function exploded() {
    status2 = false;
    window.clearInterval(pos);
    playAudio();
    x= document.getElementsByClassName('board')[0].children
    for (var i = 0; i < x.length; i++) {
        y = x[i];
        r = y.getAttribute('data-row');
        c = y.getAttribute('data-column');
        y.style.opacity = '1';
        if (mat[r][c] == 'b') {
            y.style.backgroundImage = "";
            y.className = 'bomb';
            if (level == 1) 
                await wait(180);
            else if (level == 2)
                await wait(35);
            else
                await wait(15);
        }
    }
    for (var i = 0; i < x.length; i++) {
        y = x[i];
        r=y.getAttribute('data-row')
        c = y.getAttribute('data-column')
        if (mat[r][c] == 'b') {
            y.style.backgroundImage = "";
            y.className = 'bomb';
            if (level == 1)
                await wait(180);
            else if (level == 2)
                await wait(35);
            else
                await wait(15);
            y.style.backgroundImage = "url(fire.gif)";
        }    
    }
    document.getElementsByClassName('lose')[0].style.display = 'block';
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playAudio() {
    document.getElementById("myAudio").play();
}

async function win() {
    playAudio2()
    status2 = false;
    window.clearInterval(pos);
    x = document.getElementsByClassName('board')[0].children
    for (var i = 0; i < x.length; i++) {
        y = x[i];
        r = y.getAttribute('data-row')
        c = y.getAttribute('data-column')
        y.style.opacity = '1';
        if (mat[r][c] == 'b') {
            y.style.backgroundImage = '';
            y.className = 'bomb2';
            if (level == 1)
                await wait(200);
            else if (level == 2)
                await wait(40);
            else
                await wait(15);
        }
    }
    document.getElementsByClassName('win')[0].style.display = 'block';
}

function playAudio2() {
    document.getElementById("myAudio2").play();
}

function finish() {
    localStorage.setItem('level', level);
    if (status2) {
        localStorage.setItem('mat1', mat)
        mat2 = [];
        list = document.getElementsByClassName('board')[0].children;
        myhelp = 0;
        for (var i = 0; i < arrRows[level]; i++) {
            for (var j = 0; j < arrColumns[level]; j++) {
                if (list[myhelp].style.backgroundImage == '')
                    mat2[myhelp] = 0;
                else { 
                    if (list[myhelp].style.backgroundImage == 'url("pf.png")')
                        mat2[myhelp] = 'f';
                    else
                        mat2[myhelp] = 1;
                }
                myhelp++;
            }
        }
        localStorage.setItem('mat2', mat2);
        localStorage.setItem('timePlay', timePlay);
    }
}

function openNav() {
    document.getElementById("BoardMenu").style.borderBottom = "3.5px solid white";
    document.getElementById("BoardMenu").style.outlineWidth = "3px";
    document.getElementById("BoardMenu").style.top = "0";
    document.getElementById("openBoardMenu").style.top = "45vh";
    document.getElementById("openBoardMenu").setAttribute("z-index", "5");
    document.getElementById("BoardMenu").setAttribute("z-index", "5");
    document.getElementsByTagName('input')[level - 1].checked = true;
}

function closeNav() {
    document.getElementById("BoardMenu").style.borderBottom = "0px solid white";
    document.getElementById("BoardMenu").style.outlineWidth = "0px";
    document.getElementById("BoardMenu").style.top = "-45vh";
    document.getElementById("openBoardMenu").setAttribute("z-index", "1");
    document.getElementById("BoardMenu").setAttribute("z-index", "1");
    document.getElementById("openBoardMenu").style.top = "0vh";
}

function startNewGame() {
    window.clearInterval(pos);
    countOpen = 0;
    countFlags = arrNumBombs[level];
    status2 = true;
    document.getElementById('numFlags').innerHTML = countFlags;
    document.getElementsByClassName('win')[0].style.display = 'none';
    document.getElementsByClassName('lose')[0].style.display = 'none';
    newGame();
}

function changeLevel() {
    level = event.target.value;
    startNewGame();
    document.getElementById("wrapper").className = 'wrapper' + level;
}

function againGame() {
    document.getElementsByClassName('lose')[0].style.display = 'none';
    countOpen = 0;
    countFlags = arrNumBombs[level];
    status2 = true;
    document.getElementById('numFlags').innerHTML = countFlags;
    createBoard();
    timePlay = 0;
    document.getElementById('timer').innerHTML = timePlay;
}

function dblclick() {
    if (!status2)
        return;
    r = event.target.getAttribute("data-row");
    c = event.target.getAttribute("data-column");
    value = mat[r][c];
    if (value == 'b')
        return;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            let x = parseInt(r) + i;
            let y = parseInt(c) + j;
            if (x < 0 || x >= arrRows[level] || y < 0 || y >= arrColumns[level]) {
                continue;
            }
            z = document.getElementsByClassName("board")[0].children[arrColumns[level] * x + y]
            if (z.style.backgroundImage == 'url("pf.png")')
                value--;
        }
    }
    if (value != 0)
        return;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            let x = parseInt(r) + i;
            let y = parseInt(c) + j;
            if (x < 0 || x >= arrRows[level] || y < 0 || y >= arrColumns[level]) {
                continue;
            }
            z = document.getElementsByClassName("board")[0].children[arrColumns[level] * x + y]
            if (z.style.backgroundImage == '') {
                if (mat[x][y] == 'b') {
                    exploded();
                    return;
                }
                open1(x, y);
            }
        }
    }
    if (countOpen == arrColumns[level] * arrRows[level] - arrNumBombs[level])
        win();
}
