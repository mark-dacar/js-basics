// greedy best first search logic
import { path_node } from "./path_node.js";
import { checkCell, updateCell, searchable } from "./bfs-logic.js";

// SEARCH ALGORITHM
export function greedy_BFS(startLocation, tHeight, tWidth, animate, endLocation) {
    let currNode = new path_node(startLocation);
    let cnt = 0;
    let frontier = [];

    // find the first couple of search nodes before starting the loop
    var coords = startLocation.split(" ");
    coords[0] = parseInt(coords[0]);
    coords[1] = parseInt(coords[1]);

    // Position variables
    let downRow = coords[1] + 1;
    let upRow = coords[1] - 1;
    let rightCol = coords[0] + 1;
    let leftCol = coords[0] - 1;

    // SET THE INITIAL NODES
    // up
    if (upRow >= 0) {
        let ident = coords[0] + " " + upRow;
        let cell = document.getElementById(ident);

        if (checkCell(ident, cell, endLocation) === true) {
            return;
        }

        if (cell.className !== 'wall') {
            updateCell(cell, 'discovered', cnt, animate);
            cnt++;
            frontier = pushFrontier(new path_node(ident, currNode), frontier, endLocation);
        }
    }

    // right
    if (rightCol < tWidth) {
        let ident = rightCol + " " + coords[1];
        let cell = document.getElementById(ident);

        if (checkCell(ident, cell, endLocation) === true) {
            return;
        }

        if (cell.className !== 'wall') {
            updateCell(cell, 'discovered', cnt, animate);
            cnt++;
            frontier = pushFrontier(new path_node(ident, currNode), frontier, endLocation);
        }
    }

    // down
    if (downRow < tHeight) {
        let ident = coords[0] + " " + downRow;
        let cell = document.getElementById(ident);
        if (checkCell(ident, cell, endLocation) === true) {
            return;
        }

        if (cell.className !== 'wall') {
            updateCell(cell, 'discovered', cnt, animate);
            cnt++;
            frontier = pushFrontier(new path_node(ident, currNode), frontier, endLocation);
        }
    }

    // left
    if (leftCol >= 0) {
        let ident = leftCol + " " + coords[1];
        let cell = document.getElementById(ident);
        if (checkCell(ident, cell, endLocation) === true) {
            return;
        }
        if (cell.className !== 'wall') {
            updateCell(cell, 'discovered', cnt, animate);
            cnt++;
            frontier = pushFrontier(new path_node(ident, currNode), frontier, endLocation);
        }
    }

    explore(frontier, cnt, tHeight, tWidth, animate, endLocation);
}

function explore(frontier, cnt, tHeight, tWidth, animate, endLocation) {
    let foundEnd = false;
    let solutionNode;
    let solutionPath = [];

    while (frontier.length > 0 && foundEnd === false) {
        let pNode = frontier.shift();

        let cell = document.getElementById(pNode.name);
        updateCell(cell, 'searched', cnt, animate);
        cnt++;

        // position variables
        let coords = pNode.name.split(" ");
        coords[0] = parseInt(coords[0]);
        coords[1] = parseInt(coords[1]);

        let downRow = coords[1] + 1;
        let upRow = coords[1] - 1;
        let rightCol = coords[0] + 1;
        let leftCol = coords[0] - 1;

        // DISCOVERY
        // up
        if (upRow >= 0) {
            let ident = coords[0] + " " + upRow;
            let cell = document.getElementById(ident);

            if (checkCell(ident, cell, endLocation) === true) {
                foundEnd = true;
                solutionNode = pNode;
                break;
            }

            // otherwise, attempt to add to frontier
            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, endLocation);
            }
        }

        // right
        if (rightCol < tWidth) {
            let ident = rightCol + " " + coords[1];
            let cell = document.getElementById(ident);
            
            if (checkCell(ident, cell, endLocation) === true) {
                foundEnd = true;
                solutionNode = pNode;
                break;
            }

            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, endLocation);
            }
        }

        // down
        if (downRow < tHeight) {
            let ident = coords[0] + " " + downRow;
            let cell = document.getElementById(ident);
            
            if (checkCell(ident, cell, endLocation) === true) {
                foundEnd = true;
                solutionNode = pNode;
                break;
            }

            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, endLocation);
            }
        }

        // left
        if (leftCol >= 0) {
            let ident = leftCol + " " + coords[1];
            let cell = document.getElementById(ident);
            
            if (checkCell(ident, cell, endLocation) === true) {
                foundEnd = true;
                solutionNode = pNode;
                break;
            }

            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, endLocation);
            }
        }
    
    }

    // paint the solution path
    if (foundEnd === true) {
        // form the path
        while (solutionNode.getParent() !== null) {
            solutionPath.push(solutionNode);
            solutionNode = solutionNode.getParent();
        }

        // paint the path
        while (solutionPath.length > 0) {
            let cell = document.getElementById(solutionPath.pop().name);
            updateCell(cell, 'solution', cnt, animate);
            cnt++;
        }
    }
}

function pushFrontier(pNode, frontier, endLocation) {
    // Calculate h(n) as euclidean distance to end
    // reorder frontier
    let nodeLocation = pNode.name.split(" ");
    nodeLocation[0] = parseInt(nodeLocation[0]);
    nodeLocation[1] = parseInt(nodeLocation[1]);

    endLocation = endLocation.split(" ");
    endLocation[0] = parseInt(endLocation[0]);
    endLocation[1] = parseInt(endLocation[1]);

    let cost = Math.sqrt(Math.pow((nodeLocation[0] - endLocation[0]), 2) + Math.pow((nodeLocation[1] - endLocation[1]), 2));

    pNode.cost = cost;

    let index = frontier.findIndex(o => o.cost > cost);

    if (index === -1) {
        frontier.push(pNode);
    }
    else if (index === 0) {
        frontier.unshift(pNode);
    }
    else { 
        let firstFrontier = frontier.slice(0, index);
        let finalFrontier = frontier.slice(index);

        firstFrontier.push(pNode);
        frontier = firstFrontier.concat(finalFrontier);
    }

    return frontier;
}