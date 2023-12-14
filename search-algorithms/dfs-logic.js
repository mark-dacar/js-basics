// depth first search logic
import { path_node } from "./path_node.js";
import { checkCell, updateCell, searchable } from "./bfs-logic.js";

// SEARCH ALGORITHM
export function DFS(startLocation, tHeight, tWidth, animate, endLocation=null) {
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
            frontier.push(new path_node(ident, currNode));
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
            frontier.push(new path_node(ident, currNode));
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
            frontier.push(new path_node(ident, currNode));
        }
    }

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
            frontier.push(new path_node(ident, currNode));
        }
    }

    explore(frontier, cnt, tHeight, tWidth, animate, endLocation);
}

function explore(frontier, cnt, tHeight, tWidth, animate, endLocation=null) {
    let foundEnd = false;
    let solutionNode;
    let solutionPath = [];

    while (frontier.length > 0 && foundEnd === false) {
        let pNode = frontier.pop();
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
                frontier.push(new path_node(ident, pNode));
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
                frontier.push(new path_node(ident, pNode));
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
                frontier.push(new path_node(ident, pNode));
            }
        }

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
                frontier.push(new path_node(ident, pNode));
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