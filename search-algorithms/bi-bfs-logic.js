// breadth first search logic
import { path_node } from "./path_node.js";
import { searchable } from "./bfs-logic.js";

// SEARCH ALGORITHM
export function bi_BFS(startLocation, tHeight, tWidth, animate, endLocation) {
    let currNodeStart = new path_node(startLocation);
    let currNodeEnd = new path_node(endLocation);
    let cnt = 0;
    let frontierStart = [];
    let frontierEnd = [];

    // find the first couple of search nodes before starting the loop
    let coordsStart = startLocation.split(" ");
    coordsStart[0] = parseInt(coordsStart[0]);
    coordsStart[1] = parseInt(coordsStart[1]);

    let coordsEnd = endLocation.split(" ");
    coordsEnd[0] = parseInt(coordsEnd[0]);
    coordsEnd[1] = parseInt(coordsEnd[1]);

    // Position variables
    let downRowStart = coordsStart[1] + 1;
    let upRowStart = coordsStart[1] - 1;
    let rightColStart = coordsStart[0] + 1;
    let leftColStart = coordsStart[0] - 1;

    let downRowEnd = coordsEnd[1] + 1;
    let upRowEnd = coordsEnd[1] - 1;
    let rightColEnd = coordsEnd[0] + 1;
    let leftColEnd = coordsEnd[0] - 1;

    // SET THE INITIAL NODES
    // up
    if (upRowStart >= 0) {
        let identStart = coordsStart[0] + " " + upRowStart;
        let cellStart = document.getElementById(identStart);

        if (identStart === endLocation) { return; }

        if (checkCell(cellStart, 'path1') === true) {
            updateCell(cellStart, 'solution', cnt, animate);
            return;
        }

        if (cellStart.className !== 'wall') {
            updateCell(cellStart, 'discoveredStart', cnt, animate);
            cnt++;
            frontierStart.push(new path_node(identStart, currNodeStart));
        }
    }

    if (upRowEnd >= 0) {
        let identEnd = coordsEnd[0] + " " + upRowEnd;
        let cellEnd = document.getElementById(identEnd);

        if (identEnd === startLocation) { return; }

        if (checkCell(cellEnd, 'path2') === true) {
            updateCell(cellEnd, 'solution', cnt, animate);
            return;
        }

        if (cellEnd.className !== 'wall') {
            updateCell(cellEnd, 'discoveredEnd', cnt, animate);
            cnt++;
            frontierEnd.push(new path_node(identEnd, currNodeEnd));
        }
    }

    // right
    if (rightColStart < tWidth) {
        let identStart = rightColStart + " " + coordsStart[1];
        let cellStart = document.getElementById(identStart);

        if (identStart === endLocation) { return; }

        if (checkCell(cellStart, 'path1') === true) {
            updateCell(cellStart, 'solution', cnt, animate);
            return;
        }

        if (cellStart.className !== 'wall') {
            updateCell(cellStart, 'discoveredStart', cnt, animate);
            cnt++;
            frontierStart.push(new path_node(identStart, currNodeStart));
        }
    }

    if (rightColEnd < tWidth) {
        let identEnd = rightColEnd + " " + coordsEnd[1];
        let cellEnd = document.getElementById(identEnd);

        if (identEnd === startLocation) { return; }

        if (checkCell(cellEnd, 'path2') === true) {
            updateCell(cellEnd, 'solution', cnt, animate);
            return;
        }

        if (cellEnd.className !== 'wall') {
            updateCell(cellEnd, 'discoveredEnd', cnt, animate);
            cnt++;
            frontierEnd.push(new path_node(identEnd, currNodeEnd));
        }
    }

    // down
    if (downRowStart < tHeight) {
        let identStart = coordsStart[0] + " " + downRowStart;
        let cellStart = document.getElementById(identStart);

        if (identStart === endLocation) { return; }

        if (checkCell(cellStart, 'path1') === true) {
            updateCell(cellStart, 'solution', cnt, animate);
            return;
        }

        if (cellStart.className !== 'wall') {
            updateCell(cellStart, 'discoveredStart', cnt, animate);
            cnt++;
            frontierStart.push(new path_node(identStart, currNodeStart));
        }
    }

    if (downRowEnd < tHeight) {
        let identEnd = coordsEnd[0] + " " + downRowEnd;
        let cellEnd = document.getElementById(identEnd);

        if (identEnd === startLocation) { return; }

        if (checkCell(cellEnd, 'path2') === true) {
            updateCell(cellEnd, 'solution', cnt, animate);
            return;
        }

        if (cellEnd.className !== 'wall') {
            updateCell(cellEnd, 'discoveredEnd', cnt, animate);
            cnt++;
            frontierEnd.push(new path_node(identEnd, currNodeEnd));
        }
    }

    // left
    if (leftColStart >= 0) {
        let identStart = leftColStart + " " + coordsStart[1];
        let cellStart = document.getElementById(identStart);

        if (identStart === endLocation) { return; }

        if (checkCell(cellStart, 'path1') === true) {
            updateCell(cellStart, 'solution', cnt, animate);
            return;
        }
        if (cellStart.className !== 'wall') {
            updateCell(cellStart, 'discoveredStart', cnt, animate);
            cnt++;
            frontierStart.push(new path_node(identStart, currNodeStart));
        }
    }

    if (leftColEnd >= 0) {
        let identEnd = leftColEnd + " " + coordsEnd[1];
        let cellEnd = document.getElementById(identEnd);

        if (identEnd === startLocation) { return; }

        if (checkCell(cellEnd, 'path2') === true) {
            updateCell(cellEnd, 'solution', cnt, animate);
            return;
        }
        if (cellEnd.className !== 'wall') {
            updateCell(cellEnd, 'discoveredEnd', cnt, animate);
            cnt++;
            frontierEnd.push(new path_node(identEnd, currNodeEnd));
        }
    }

    explore(frontierStart, frontierEnd, cnt, tHeight, tWidth, animate);
}

function explore(frontierStart, frontierEnd, cnt, tHeight, tWidth, animate) {
    let foundEnd = false;
    let solutionNodeStart;
    let solutionNodeEnd;
    let solutionPath = [];

    // due to the possibility of discovering a node that has already been searched,
    // (pathnode no longer exists in the particular path's frontier),
    // need another array to hold onto already searched nodes; otherwise there is no
    // way to form the solution path without raising an exception
    let searchedField = [];

    while (frontierStart.length > 0 && frontierEnd.length > 0 && foundEnd === false) {
        let pNodeStart = frontierStart.shift();
        let cellStart = document.getElementById(pNodeStart.name);

        let pNodeEnd = frontierEnd.shift();
        let cellEnd = document.getElementById(pNodeEnd.name);

        updateCell(cellStart, 'searchedStart', cnt, animate);
        cnt++;

        updateCell(cellEnd, 'searchedEnd', cnt, animate);
        cnt++;

        searchedField.push(pNodeStart);
        searchedField.push(pNodeEnd);

        // position variables
        let coordsStart = pNodeStart.name.split(" ");
        coordsStart[0] = parseInt(coordsStart[0]);
        coordsStart[1] = parseInt(coordsStart[1]);

        let coordsEnd = pNodeEnd.name.split(" ");
        coordsEnd[0] = parseInt(coordsEnd[0]);
        coordsEnd[1] = parseInt(coordsEnd[1]);

        let downRowStart = coordsStart[1] + 1;
        let upRowStart = coordsStart[1] - 1;
        let rightColStart = coordsStart[0] + 1;
        let leftColStart = coordsStart[0] - 1;

        let downRowEnd = coordsEnd[1] + 1;
        let upRowEnd = coordsEnd[1] - 1;
        let rightColEnd = coordsEnd[0] + 1;
        let leftColEnd = coordsEnd[0] - 1;

        // DISCOVERY
        // up
        if (upRowStart >= 0) {
            let identStart = coordsStart[0] + " " + upRowStart;
            let cellStart = document.getElementById(identStart);

            if (checkCell(cellStart, 'path1') === true) {
                foundEnd = true;
                solutionNodeStart = pNodeStart;
                solutionNodeEnd = frontierEnd.find(o => o.name === identStart);
                if (solutionNodeEnd === undefined) { solutionNodeEnd = searchedField.find(o => o.name === identStart); }
                break;
            }

            // otherwise, attempt to add to frontier
            if (searchable(cellStart, identStart, pNodeStart) === true) {
                updateCell(cellStart, 'discoveredStart', cnt, animate);
                cnt++;
                frontierStart.push(new path_node(identStart, pNodeStart));
            }
        }

        if (upRowEnd >= 0) {
            let identEnd = coordsEnd[0] + " " + upRowEnd;
            let cellEnd = document.getElementById(identEnd);

            if (checkCell(cellEnd, 'path2') === true) {
                foundEnd = true;
                solutionNodeStart = frontierStart.find(o => o.name === identEnd);
                if (solutionNodeStart === undefined) { solutionNodeStart = searchedField.find(o => o.name === identEnd); }
                solutionNodeEnd = pNodeEnd;
                break;
            }

            // otherwise, attempt to add to frontier
            if (searchable(cellEnd, identEnd, pNodeEnd) === true) {
                updateCell(cellEnd, 'discoveredEnd', cnt, animate);
                cnt++;
                frontierEnd.push(new path_node(identEnd, pNodeEnd));
            }
        }

        // right
        if (rightColStart < tWidth) {
            let identStart = rightColStart + " " + coordsStart[1];
            let cellStart = document.getElementById(identStart);
            
            if (checkCell(cellStart, 'path1') === true) {
                foundEnd = true;
                solutionNodeStart = pNodeStart;
                solutionNodeEnd = frontierEnd.find(o => o.name === identStart);
                if (solutionNodeEnd === undefined) { solutionNodeEnd = searchedField.find(o => o.name === identStart); }
                break;
            }

            if (searchable(cellStart, identStart, pNodeStart) ===  true) {
                updateCell(cellStart, 'discoveredStart', cnt, animate);
                cnt++;
                frontierStart.push(new path_node(identStart, pNodeStart));
            }
        }

        if (rightColEnd < tWidth) {
            let identEnd = rightColEnd + " " + coordsEnd[1];
            let cellEnd = document.getElementById(identEnd);

            if (checkCell(cellEnd, 'path2') === true) {
                foundEnd = true;
                solutionNodeStart = frontierStart.find(o => o.name === identEnd);
                if (solutionNodeStart === undefined) { solutionNodeStart = searchedField.find(o => o.name === identEnd); }
                solutionNodeEnd = pNodeEnd;
                break;
            }

            if (searchable(cellEnd, identEnd, pNodeEnd) === true) {
                updateCell(cellEnd, 'discoveredEnd', cnt, animate);
                cnt++;
                frontierEnd.push(new path_node(identEnd, pNodeEnd));
            }
        }

        // down
        if (downRowStart < tHeight) {
            let identStart = coordsStart[0] + " " + downRowStart;
            let cellStart = document.getElementById(identStart);
            
            if (checkCell(cellStart, 'path1') === true) {
                foundEnd = true;
                solutionNodeStart = pNodeStart;
                solutionNodeEnd = frontierEnd.find(o => o.name === identStart);
                if (solutionNodeEnd === undefined) { solutionNodeEnd = searchedField.find(o => o.name === identStart); }
                break;
            }

            if (searchable(cellStart, identStart, pNodeStart) === true) {
                updateCell(cellStart, 'discoveredStart', cnt, animate);
                cnt++;
                frontierStart.push(new path_node(identStart, pNodeStart));
            }
        }

        if (downRowEnd < tHeight) {
            let identEnd = coordsEnd[0] + " " + downRowEnd;
            let cellEnd = document.getElementById(identEnd);

            if (checkCell(cellEnd, 'path2') === true) {
                foundEnd = true;
                solutionNodeStart = frontierStart.find(o => o.name === identEnd);
                if (solutionNodeStart === undefined) { solutionNodeStart = searchedField.find(o => o.name === identEnd); }
                solutionNodeEnd = pNodeEnd;
                break;
            }

            if (searchable(cellEnd, identEnd, pNodeEnd) === true) {
                updateCell(cellEnd, 'discoveredEnd', cnt, animate);
                cnt++;
                frontierEnd.push(new path_node(identEnd, pNodeEnd));
            }
        }

        // left
        if (leftColStart >= 0) {
            let identStart = leftColStart + " " + coordsStart[1];
            let cellStart = document.getElementById(identStart);
            
            if (checkCell(cellStart, 'path1') === true) {
                foundEnd = true;
                solutionNodeStart = pNodeStart;
                solutionNodeEnd = frontierEnd.find(o => o.name === identStart);
                if (solutionNodeEnd === undefined) { solutionNodeEnd = searchedField.find(o => o.name === identStart); }
                break;
            }

            if (searchable(cellStart, identStart, pNodeStart) === true) {
                updateCell(cellStart, 'discoveredStart', cnt, animate);
                cnt++;
                frontierStart.push(new path_node(identStart, pNodeStart));
            }
        }

        if (leftColEnd >= 0) {
            let identEnd = leftColEnd + " " + coordsEnd[1];
            let cellEnd = document.getElementById(identEnd);

            if (checkCell(cellEnd, 'path2') === true) {
                foundEnd = true;
                solutionNodeStart = frontierStart.find(o => o.name === identEnd);
                if (solutionNodeStart === undefined) { solutionNodeStart = searchedField.find(o => o.name === identEnd); }
                solutionNodeEnd = pNodeEnd;
                break;
            }

            if (searchable(cellEnd, identEnd, pNodeEnd) === true) {
                updateCell(cellEnd, 'discoveredEnd', cnt, animate);
                cnt++;
                frontierEnd.push(new path_node(identEnd, pNodeEnd));
            }
        }
    
    }

    // paint the solution path
    if (foundEnd === true) {
        // form the path
        // start
        while (solutionNodeStart.getParent() !== null) {
            solutionPath.push(solutionNodeStart);
            solutionNodeStart = solutionNodeStart.getParent();
        }

        // end
        
        while (solutionNodeEnd.getParent() !== null) {
            solutionPath.unshift(solutionNodeEnd);
            solutionNodeEnd = solutionNodeEnd.getParent();
        }

        // paint the path
        while (solutionPath.length > 0) {
            let cell = document.getElementById(solutionPath.pop().name);
            updateCell(cell, 'solution', cnt, animate);
            cnt++;
        }
    }

}

function updateCell(cell, state, cnt, animate=true) {
    let stateColor;
    if (state.includes('Start') === true) {
        if (cell.className.includes('low') === true) {
            stateColor = 'rgb(102, 153, 255)';
            if (state.includes('discovered') === true) {
                cell.className = 'low_discoveredStart';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'low_searchedStart';
            }
            else { cell.className = 'low_solution'; }
        }
        else if (cell.className.includes('medium') === true) {
            stateColor = 'rgb(51, 204, 51)';
            if (state.includes('discovered') === true) {
                cell.className = 'medium_discoveredStart';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'medium_searchedStart';
            }
            else { cell.className = 'medium_solution'; }
        }
        else if (cell.className.includes('high') === true) {
            stateColor = 'rgb(204, 0, 0)';
            if (state.includes('discovered') === true) {
                cell.className = 'high_discoveredStart';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'high_searchedStart';
            }
            else { cell.className = 'high_solution'; }
        }
        else {
            stateColor = 'white';
            cell.className = state;
        }
    }
    else {
        if (cell.className.includes('low') === true) {
            stateColor = 'rgb(102, 153, 255)';
            if (state.includes('discovered') === true) {
                cell.className = 'low_discoveredEnd';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'low_searchedEnd';
            }
            else { cell.className = 'low_solution'; }
        }
        else if (cell.className.includes('medium') === true) {
            stateColor = 'rgb(51, 204, 51)';
            if (state.includes('discovered') === true) {
                cell.className = 'medium_discoveredEnd';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'medium_searchedEnd';
            }
            else { cell.className = 'medium_solution'; }
        }
        else if (cell.className.includes('high') === true) {
            stateColor = 'rgb(204, 0, 0)';
            if (state.includes('discovered') === true) {
                cell.className = 'high_discoveredEnd';
            }
            else if (state.includes('searched') === true) {
                cell.className = 'high_searchedEnd';
            }
            else { cell.className = 'high_solution'; }
        }
        else {
            stateColor = 'white';
            cell.className = state;
        }
    }

    let cellColor;
    if (state.includes('discovered') === true) {
        cellColor = 'rgb(187, 153, 255)';
    } else if (state.includes('searched') === true) {
        cellColor = 'blue';
    } else { cellColor = 'gold'; }
    

    if (animate === true) {
        setTimeout(() => {
            cell.style = 'background:radial-gradient(circle at 50% 50%, ' + stateColor + ', ' + cellColor + ')';
        }, 20 * cnt);
    }
    else { cell.style = 'background:radial-gradient(circle at 50% 50%, ' + stateColor + ', ' + cellColor + ')';
}
    
}

function checkCell(cell, path) {
    let cellClass = cell.className;

    // check if the paths have intersected
    if (path === 'path1') {
        if (cellClass.includes('discoveredEnd') === true || cellClass.includes('searchedEnd') === true) { return true; }
    }
    else {
        if (cellClass.includes('discoveredStart') === true || cellClass.includes('searchedStart') === true) { return true; }
    }
    return false;
}