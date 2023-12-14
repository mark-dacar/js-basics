// search algorithm imports
import { BFS } from './search-algorithms/bfs-logic.js';
import { DFS } from './search-algorithms/dfs-logic.js';
import { bi_BFS } from './search-algorithms/bi-bfs-logic.js';
import { greedy_BFS } from './search-algorithms/greedy-bfs-logic.js';
import { dijkstra } from './search-algorithms/dijkstra-logic.js';
import { a_star } from './search-algorithms/a-star-logic.js';

// ----------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
// ----------------------------------------------------------------------------------------------------------
let tableHeight = 20;
let tableWidth = 30;

// Define variables for tyle functions
let buildType = -1;
let drawTiles = false;

// Define the variables for the start and end positions
let startX = null, startY = null;
let endX = null, endY = null;

// Define if dragenter animation is currently on or off
let dragAnimate = false;
let dragBtn = null;

// ----------------------------------------------------------------------------------------------------------
// FLAG EVENT HANDLERS
// ----------------------------------------------------------------------------------------------------------
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

    let btns = ['buildTool', 'removeTool', 'buildLowTool', 'buildMedTool', 'buildHighTool'];
    buildType = -1;

    btns.forEach((o) => {
        let btn = document.getElementById(o);
        btn.className = 'notClicked';

        switch(o) {
            case 'buildTool':
                btn.src = 'icons/hammer.png';
                break;
            case 'removeTool':
                btn.src = 'icons/pick.png';
                break;
            case 'buildLowTool':
                btn.src = 'icons/low.png';
                break;
            case 'buildMedTool':
                btn.src = 'icons/medium.png';
                break;
            case 'buildHighTool':
                btn.src = 'icons/high.png';
                break;
            default:
                break;
        }
    });

    if (dragAnimate === true) {
        dragBtn = ev.target.id;
    }
}
window.drag = drag;

function dragover(event) { event.preventDefault(); }

function dragenter(event) {
    event.preventDefault();
    if (dragAnimate === true) {
        if (dragBtn === 'startFlag') {
            let coords = event.target.id.split(" ");
            if (event.target.id === 'startFlag') {
                coords = document.getElementById(event.target.id).parentElement.id.split(" ");
            }
            showAlgorithm(parseInt(coords[0]), parseInt(coords[1]), endX, endY);
        }
        else if (dragBtn === 'endFlag') {
            let coords = event.target.id.split(" ");
            if (event.target.id === 'endFlag') {
                coords = document.getElementById(event.target.id).parentElement.id.split(" ");
            }
            showAlgorithm(startX, startY, coords[0], coords[1]);
        }
    }
}

function drop(event) {
    event.preventDefault();

    // relative information needed
    var data = event.dataTransfer.getData("text");
    var node = document.getElementById(data).cloneNode(true);
    var coords = event.currentTarget.id.split(" ");

    if (data === 'startPoint' || data === 'startFlag') { node.id = 'startFlag'; node.name = 'startFlag'; }
    else { node.id = 'endFlag'; node.name = 'endFlag'; }

    // if the current cell has a flag already
    if (event.currentTarget.hasChildNodes()) {
        if (event.currentTarget.firstChild.id !== node.id) {
            event.currentTarget.firstChild.remove();
            
            if (node.id === 'startFlag') {
                endX = null; endY = null;
            }
            else { startX = null; startY = null; }
            
        } else { return; }
    }
    
    // see if there already is a corresponding flag on the table already
    if (node.id === 'startFlag') {
        if (startX !== null) {
            let prevCell = document.getElementById(startX + " " + startY);
            prevCell.removeChild(document.getElementById(node.id));
        }
    }
    else {
        if (endX !== null) {
            let prevCell = document.getElementById(endX + " " + endY);
            prevCell.removeChild(document.getElementById(node.id));
        }
    }

    // update logic information
    if (node.id === 'startFlag') { startX = coords[0]; startY = coords[1]; }
    else { endX = coords[0]; endY = coords[1]; }

    // set size of the flags to be correct
    node.style.width="35px";
    node.style.height="35px";

    // attach the flag to the cell
    event.currentTarget.appendChild(node);

    // remove wall if the cell is a wall (no flags in walls)
    if (event.currentTarget.className === 'wall') { event.currentTarget.className = 'normal'; event.currentTarget.style = 'background:white'; }
}

// ----------------------------------------------------------------------------------------------------------
// Tile HANDLERS
// ----------------------------------------------------------------------------------------------------------
function changeBtn(event) {
    if (document.getElementById(event.target.id).className === 'clicked') {
        let btn = document.getElementById(event.target.id);
        btn.className = 'notClicked';
        buildType = -1;

        switch (event.target.id) {
            case 'buildTool':
                btn.src='icons/hammer.png';
                break;
            case 'removeTool':
                btn.src='icons/pick.png';
                break;
            case 'buildLowTool':
                btn.src='icons/low.png';
                break;
            case 'buildMedTool':
                btn.src='icons/medium.png';
                break;
            case 'buildHighTool':
                btn.src='icons/high.png';
                break;
            default:
                break;
        }
    }
    else {
        let buildBtns = ['buildTool', 'removeTool', 'buildLowTool', 'buildMedTool', 'buildHighTool'];
        let index = buildBtns.indexOf(event.target.id);
        buildBtns = buildBtns.slice(0, index).concat(buildBtns.slice(index + 1));

        buildBtns.forEach((o) => {
            let btn = document.getElementById(o);
            btn.className = 'notClicked';

            switch (o) {
                case 'buildTool':
                    btn.src='icons/hammer.png';
                    break;
                case 'removeTool':
                    btn.src='icons/pick.png';
                    break;
                case 'buildLowTool':
                    btn.src='icons/low.png';
                    break;
                case 'buildMedTool':
                    btn.src='icons/medium.png';
                    break;
                case 'buildHighTool':
                    btn.src='icons/high.png';
                    break;
                default:
                    break;
            }
        });

        let btn = document.getElementById(event.target.id);
        btn.className = 'clicked';
        switch (event.target.id) {
            case 'buildTool':
                btn.src='icons/hammerClicked.png';
                buildType = 0;
                break;
            case 'removeTool':
                btn.src='icons/pickClicked.png';
                buildType = 1;
                break;
            case 'buildLowTool':
                btn.src='icons/lowClicked.png';
                buildType = 2;
                break;
            case 'buildMedTool':
                btn.src='icons/mediumClicked.png';
                buildType = 3;
                break;
            case 'buildHighTool':
                btn.src='icons/highClicked.png';
                buildType = 4;
                break;
            default:
                break;
        }
    }
}
window.changeBtn = changeBtn;

function mouseover(event) {
    if (drawTiles === true && event.target.hasChildNodes() === false) {
        switch (buildType) {
            case 0:
                event.target.className = 'wall';
                event.target.style = 'background:black';
                break;
            case 1:
                event.target.className = 'normal';
                event.target.style = 'background:white';
                break;
            case 2:
                event.target.className = 'low';
                event.target.style = 'background:rgb(102, 153, 255)';
                break;
            case 3:
                event.target.className = 'medium';
                event.target.style = 'background:rgb(51, 204, 51)';
                break;
            case 4:
                event.target.className = 'high';
                event.target.style = 'background:rgb(204, 0, 0)';
                break;
            default:
                break;
        }
    }
}

function mousedown(event) {
    if (buildType !== -1) {
        drawTiles = true;
    }
}

function mouseup(event) {
    if (drawTiles === true) {
        drawTiles = false;
    }
}

function click(event) {
    if (event.target.hasChildNodes() === false && event.target.nodeName === 'TD') {
        switch (buildType) {
            case 0:
                event.target.className = 'wall';
                event.target.style = 'background:black';
                break;
            case 1:
                event.target.className = 'normal';
                event.target.style = 'background:white';
                break;
            case 2:
                event.target.className = 'low';
                event.target.style = 'background:rgb(102, 153, 255)';
                break;
            case 3:
                event.target.className = 'medium';
                event.target.style = 'background:rgb(51, 204, 51)';
                break;
            case 4:
                event.target.className = 'high';
                event.target.style = 'background:rgb(204, 0, 0)';
                break;
            default:
                break;
        }
    }
}

// ----------------------------------------------------------------------------------------------------------
// TABLE FUNCTIONS
// ----------------------------------------------------------------------------------------------------------
function buildTable() {
    // Body for the document
    let body = document.getElementsByTagName('body')[0];
    body.draggable = false;

    // create a table and table body
    let newTable = document.createElement('table');
    newTable.id = 'SearchTable';
    newTable.draggable=false;

    newTable.addEventListener("mousedown", mousedown);
    newTable.addEventListener("mouseup", mouseup);
    newTable.addEventListener("click", click);

    // building the table
    let tableBody = document.createElement('tbody');
    tableBody.draggable = false;

    // rows
    for (let i = 0; i < tableHeight; i++) {
        let newRow = document.createElement('tr');
        newRow.draggable = false;

        // columns
        for (let j = 0; j < tableWidth; j++) {
            let cell = document.createElement('td');
            
            // setting the cell attributes
            cell.id = j + " " + i;
            cell.draggable = false;
            cell.className = 'normal';

            // cell event handlers
            cell.addEventListener("drop", drop);
            cell.addEventListener("dragover", dragover);
            cell.addEventListener("mouseover", mouseover);
            cell.addEventListener("dragenter", dragenter);
            
            newRow.appendChild(cell);
        }

        tableBody.appendChild(newRow);
    }
    newTable.appendChild(tableBody);
    body.append(newTable);
}

function changeTable() {
    let selectHeight = document.getElementById('tableHeight');
    let selectWidth = document.getElementById('tableWidth');

    tableHeight = selectHeight.value;
    tableWidth = selectWidth.value;

    // Delete old table and replace with new table
    let oldTable = document.getElementById('SearchTable');
    oldTable.remove();

    // reset flags
    startX = null;
    startY = null;
    endX = null;
    endY = null;
    buildTable();
}
window.changeTable = changeTable;

function clearTable(keepWalls) {
        for (let i = 0; i < tableWidth; i++) {
        for (let j = 0; j < tableHeight; j++) {
            if (keepWalls === true) {
                let cell = document.getElementById(i + " " + j);
                if (cell.className !== 'wall' ) {
                    if (cell.className.includes('low') === true) {
                        cell.className = 'low';
                        cell.style = 'background:rgb(102, 153, 255)';
                    }
                    else if (cell.className.includes('medium') === true) {
                        cell.className = 'medium';
                        cell.style = 'background:rgb(51, 204, 51)';
                    }
                    else if (cell.className.includes('high') === true) {
                        cell.className = 'high';
                        cell.style = 'background:rgb(204, 0, 0)';
                    }
                    else {
                        cell.className = 'normal';
                        cell.style = 'background:white';
                    }
                }
            }
            else { 
                let cell = document.getElementById(i + " " + j);
                cell.className = 'normal';
                cell.style = 'background:white';

                if (cell.hasChildNodes() === true) {
                    cell.removeChild(cell.firstChild);
                }
            }
        }
    }

    if (keepWalls === false) {
        startX = null; startY = null;
        endX = null; endY = null;
    }
}
window.clearTable = clearTable;

window.onload = function() {
    buildTable();
}

// ----------------------------------------------------------------------------------------------------------
// Pathfinding Functions
// ----------------------------------------------------------------------------------------------------------

function startAlgorithm(animate=true) {
    clearTable(true);
    dragAnimate = true;
    let currAlgorithm = document.getElementById("algorithms").value;

    if (startX !== null) {
        switch (currAlgorithm) {
            case "1":
                BFS(startX + " " + startY, tableHeight, tableWidth, animate);
                break;
            case "2":
                DFS(startX + " " + startY, tableHeight, tableWidth, animate);
                break;
            case "3":
                bi_BFS(startX + " " + startY, tableHeight, tableWidth, animate, endX + " " + endY);
                break;
            case "4":
                greedy_BFS(startX + " " + startY, tableHeight, tableWidth, animate, endX + " " + endY);
                break;
            case "5":
                dijkstra(startX + " " + startY, tableHeight, tableWidth, animate);
                break;
            case "6":
                a_star(startX + " " + startY, tableHeight, tableWidth, animate, endX + " " + endY);
                break;
            default:
                break;
        }
    }
    
}

function showAlgorithm(tempX=startX, tempY=startY, endX=null, endY=null) {
    clearTable(true);
    let currAlgorithm = document.getElementById("algorithms").value;
    let endLocation = null;
    if (endX !== null) {
        endLocation = endX + " " + endY;
    }

    if (startX !== null) {
        switch (currAlgorithm) {
            case "1":
                BFS(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            case "2":
                DFS(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            case "3":
                bi_BFS(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            case "4":
                greedy_BFS(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            case "5":
                dijkstra(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            case "6":
                a_star(tempX + " " + tempY, tableHeight, tableWidth, false, endLocation);
                break;
            default:
                break;
        }
    }
    
}
window.startAlgorithm = startAlgorithm;

/* 
Algorithms to include:
A*

These final algorithms are heuristics based algorithms, for these, we need costs associated with traversing a tile in addition to a distance formula. 
*/