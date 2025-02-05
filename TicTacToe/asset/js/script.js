let boxes = document.querySelectorAll(".box");

// let turn = "X";
// let isGameOver = false;

let turn = getRandomTurn();
let isGameOver = false;

const listWinner = document.querySelector(".win-history");

let oStartCount = 3;

boxes.forEach(e =>{
    e.innerHTML = ""
    e.addEventListener("click", ()=>{
        if(!isGameOver && e.innerHTML === ""){
            e.innerHTML = turn;
            cheakWin();
            cheakDraw();
            changeTurn();
        }
    })
})

function getRandomTurn() {
    return Math.random() < 0.7 ? "O" : "X";
}

function changeTurn(){
    if(turn === "X"){
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    }
    else{
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function cheakWin(){
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for(let i = 0; i<winConditions.length; i++){
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if(v0 != "" && v0 === v1 && v0 === v2){
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " win";
            document.querySelector("#play-again").style.display = "inline"

            for(j = 0; j<3; j++){
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6"
                boxes[winConditions[i][j]].style.color = "#000"
            }
        }
    }
    if (isGameOver) {
        updateWinHistory(turn);
    }
}

function cheakDraw(){
    if(!isGameOver){
        let isDraw = true;
        boxes.forEach(e =>{
            if(e.innerHTML === "") isDraw = false;
        })

        if(isDraw){
            isGameOver = true;
            document.querySelector("#results").innerHTML = "Draw";
            document.querySelector("#play-again").style.display = "inline"
        }
    }
}

document.querySelector("#play-again").addEventListener("click", ()=>{
    isGameOver = false;
    turn = getRandomTurn();
    document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e =>{
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff"
    })
})

turn = getRandomTurn();
document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";

// History Winner
function updateWinHistory(winner) {
    let winHistory = JSON.parse(localStorage.getItem("winHistory")) || [];
    winHistory.push(winner);
    localStorage.setItem("winHistory", JSON.stringify(winHistory));
    displayWinHistory();
}

function displayWinHistory() {
    let winHistory = JSON.parse(localStorage.getItem('winHistory')) || [];
    const historyList = document.getElementById('win-history-list');

    historyList.innerHTML = '';
    winHistory.forEach(winner => {
        const listItem = document.createElement('li');
        listItem.textContent = winner + " won!";
        historyList.appendChild(listItem);
    });

    let existingList = document.getElementById('win-history-list');
    if (existingList){
        existingList.remove();
    }

    listWinner.insertBefore(historyList, listWinner.children[1]); // set to second element, first element adalah [0]
}

document.querySelector("#play-again").addEventListener("click", ()=>{
    displayWinHistory(); 
})

displayWinHistory();

const MAX_HISTORY_ENTRIES = 6;

function updateWinHistory(winner) {
    let winHistory = JSON.parse(localStorage.getItem("winHistory")) || [];
    winHistory.push(winner);
    winHistory = winHistory.slice(-MAX_HISTORY_ENTRIES);
    localStorage.setItem("winHistory", JSON.stringify(winHistory));
    displayWinHistory();
}

let winCount = 0; 

document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem("winHistory");
    displayWinHistory();
});
