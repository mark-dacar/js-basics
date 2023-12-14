// breadth first search logic
import { path_node } from "./path_node.js";

// SEARCH ALGORITHM
export function BFS(startLocation, tHeight, tWidth, animate, endLocation=null) {
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

    explore(frontier, cnt, tHeight, tWidth, animate, endLocation);
}

function explore(frontier, cnt, tHeight, tWidth, animate, endLocation=null) {
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

export function updateCell(cell, state, cnt, animate=true) {
    // get center color and set state
    let stateColor;
    if (cell.className.includes('low') === true) {
        stateColor = 'rgb(102, 153, 255)';
        switch (state) {
            case 'discovered':
                cell.className = 'low_discovered';
                break;
            case 'searched':
                cell.className = 'low_searched';
                break;
            case 'solution':
                cell.className = 'low_solution';
                break;
            default:
                break;
        }
    }
    else if (cell.className.includes('medium') === true) {
        stateColor = 'rgb(51, 204, 51)';
        switch (state) {
            case 'discovered':
                cell.className = 'medium_discovered';
                break;
            case 'searched':
                cell.className = 'medium_searched';
                break;
            case 'solution':
                cell.className = 'medium_solution';
                break;
            default:
                break;
        }
    }
    else if (cell.className.includes('high') === true) {
        stateColor = 'rgb(204, 0, 0)';
        switch (state) {
            case 'discovered':
                cell.className = 'high_discovered';
                break;
            case 'searched':
                cell.className = 'high_searched';
                break;
            case 'solution':
                cell.className = 'high_solution';
                break;
            default:
                break;
        }
    }
    else {
        stateColor = 'white';
        cell.className = state;
    }


    // getting the outside gradient
    let cellColor;
    switch (state) {
        case 'discovered':
            cellColor = 'rgb(187, 153, 255)';
            break;
        case 'searched':
            cellColor = 'blue';
            break;
        case 'solution':
            cellColor = 'gold';
            break;
        default:
            break;
    }

    if (animate === true) {
        setTimeout(() => {
            cell.style = 'background:radial-gradient(circle at 50% 50%, ' + stateColor + ', ' + cellColor + ')';
        }, 20 * cnt);
    }
    else { cell.style = 'background:radial-gradient(circle at 50% 50%, ' + stateColor + ', ' + cellColor + ')'; }
    
}

export function checkCell(currName, cell, endLocation=null) {
    // if endlocation is null, we are either moving the start location or animating the algorithm
    if (endLocation !== null) {
        if (currName === endLocation) {
            return true; // if the flag is found when hovering, return true
        }
        else { return false; }
    }
    else {
        // otherwise we need to check if the flag has been found
        if (cell.hasChildNodes() === true) {
            if (cell.firstChild.id === 'endFlag') { return true; }
            else { return false; }
        } else { return false; }
    }
}

export function searchable(cell, ident, pNode) {
    if (cell.className !== 'wall' && 
        cell.className.includes('discovered') === false && 
        cell.className.includes('searched') === false && 
        ident !== pNode.getParent().name) {
            return true;
    } else { return false; }
}