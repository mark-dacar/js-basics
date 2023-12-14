// dijkstra's algorithm logic
import { path_node } from "./path_node.js";
import { checkCell, updateCell, searchable } from "./bfs-logic.js";

// SEARCH ALGORITHM
export function a_star(startLocation, tHeight, tWidth, animate, endLocation) {
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell, endLocation);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell, endLocation);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell, endLocation);
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
            frontier = pushFrontier(new path_node(ident, currNode), frontier, cell, endLocation);
        }
    }

    explore(frontier, cnt, tHeight, tWidth, animate, endLocation);
}

function explore(frontier, cnt, tHeight, tWidth, animate, endLocation) {
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
                frontier = reorderFrontier(frontier, pNode, cell, endLocation);
            }
            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell, endLocation);
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
                frontier = reorderFrontier(frontier, pNode, cell, endLocation);
            }
            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell, endLocation);
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
                frontier = reorderFrontier(frontier, pNode, cell, endLocation);
            }
            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell, endLocation);
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
                frontier = reorderFrontier(frontier, pNode, cell, endLocation);
            }
            if (searchable(cell, ident, pNode) === true) {
                updateCell(cell, 'discovered', cnt, animate);
                cnt++;
                frontier = pushFrontier(new path_node(ident, pNode), frontier, cell, endLocation);
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

function pushFrontier(pNode, frontier, cell, endLocation) {
    // calculate f(n) cost as g(n) + h(n)
    // where g(n) is cost from start node to current node
    // and h(n) is euclidean distance from the end node
    // reorder the frontier accordingly
    let nodeLocation = pNode.name.split(" ");
    nodeLocation[0] = parseInt(nodeLocation[0]);
    nodeLocation[1] = parseInt(nodeLocation[1]);
    
    endLocation = endLocation.split(" ");
    endLocation[0] = parseInt(endLocation[0]);
    endLocation[1] = parseInt(endLocation[1]);

    // get g(n)
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
        cost = cost + pNode.getParent().getStartDistanceCost();
    }
    pNode.startDistanceCost = cost;

    // get h(n)
    let heuristic = Math.sqrt(Math.pow((nodeLocation[0] - endLocation[0]), 2) + Math.pow((nodeLocation[1] - endLocation[1]), 2));
    cost = cost + heuristic;

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

function reorderFrontier(frontier, pNode, cell, endLocation) {
    let cost = pNode.startDistanceCost;
    let index = frontier.findIndex(o => o.name === cell.id);
    let storedNode = frontier[index];
    let nodeLocation = cell.id.split(" ");
    nodeLocation[0] = parseInt(nodeLocation[0]);
    nodeLocation[1] = parseInt(nodeLocation[1]);

    endLocation = endLocation.split(" ");
    endLocation[0] = parseInt(endLocation[0]);
    endLocation[1] = parseInt(endLocation[1]);

    // get g(n)
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

    // get h(n)
    cost =cost + Math.sqrt(Math.pow((nodeLocation[0] - endLocation[0]), 2) + Math.pow((nodeLocation[1] - endLocation[1]), 2));

    if (cost < storedNode.getCost()) {

        let firstFrontier = frontier.slice(0, index);
        let finalFrontier = frontier.slice(index);

        firstFrontier.pop();
        frontier = firstFrontier.concat(finalFrontier);

        return pushFrontier(new path_node(cell.id, pNode), frontier, cell);
    }
    else { return frontier; }
}