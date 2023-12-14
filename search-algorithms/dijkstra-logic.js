// dijkstra's algorithm logic
import { path_node } from "./path_node.js";
import { checkCell, updateCell, searchable } from "./bfs-logic.js";

// SEARCH ALGORITHM
export function dijkstra(startLocation, tHeight, tWidth, animate, endLocation=null) {
    let currNode = new path_node(startLocation);
    let cnt = 0;
    let frontier = [];

    // find the first couple of nodes before starting the algorithm
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell);
        }
    }

    explore(frontier, cnt, tHeight, tWidth, animate, endLocation);
}

function explore(frontier, cnt, tHeight, tWidth, animate, endLocation=null) {
    let foundEnd = false;
    let solutionNode;
    let solutionPath = [];

    while(frontier.length > 0 && foundEnd === false) {
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

            // If node has been discovered already, see if cost needs to be adjusted
            if (cell.className.includes('discovered') === true) {
                frontier = reorderFrontier(frontier, pNode, cell);
            }
            else if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell);
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

            // If node has been discovered already, see if cost needs to be adjusted
            if (cell.className.includes('discovered') === true) {
                frontier = reorderFrontier(frontier, pNode, cell);
            }
            else if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell);
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

            // If node has been discovered already, see if cost needs to be adjusted
            if (cell.className.includes('discovered') === true) {
                frontier = reorderFrontier(frontier, pNode, cell);
            }
            else if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell);
            }
        }

        // leftCol
        if (leftCol >= 0) {
            let ident = leftCol + " " + coords[1];
            let cell = document.getElementById(ident);

            if (checkCell(ident, cell, endLocation) === true) {
                foundEnd = true;
                solutionNode = pNode;
                break;
            }

            // If node has been discovered already, see if cost needs to be adjusted
            if (cell.className.includes('discovered') === true) {
                frontier = reorderFrontier(frontier, pNode, cell);
            }
            else if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell);
            }
        }
    }

    // paint the solution path
    if (foundEnd === true) {
        // form the path
        while(solutionNode.getParent() !== null) {
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

function pushFrontier(pNode, frontier, cell) {
    // calculate g(n) as cost from start node to current node
    // reorder the frontier accordingly
    let cost;
    if (cell.className.includes('high') === true) {
        cost = 20;
    }
    else if (cell.className.includes('low') === true) {
        cost = 5;
    }
    else if (cell.className.includes('medium') === true) {
        cost = 10;
    }
    else { cost = 1; }

    if (pNode.getParent() !== null) {
        cost = cost + pNode.getParent().getCost();
    }

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

function reorderFrontier(frontier, pNode, cell) {
    let cost = pNode.cost;
    let index = frontier.findIndex(o => o.name === cell.id);
    let storedNode = frontier[index];

    if (cell.className.includes('normal') === true) {
        cost++;
    }
    else if (cell.className.includes('low') === true) {
        cost = cost + 5;
    }
    else if (cell.className.includes('medium') === true) {
        cost = cost + 10;
    }
    else { cost = cost + 20; }

    if (cost < storedNode.getCost()) {

        let firstFrontier = frontier.slice(0, index);
        let finalFrontier = frontier.slice(index);

        firstFrontier.pop();
        frontier = firstFrontier.concat(finalFrontier);

        return pushFrontier(new path_node(cell.id, pNode), frontier, cell);
    }
    else { return frontier; }
}