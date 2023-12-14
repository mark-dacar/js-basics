export class path_node {
    name;
    parent;
    cost;
    
    constructor(name, parent = null, cost = 0, startDistanceCost = 0) {
        this.name = name;
        this.parent = parent;
        this.cost = cost;
        this.startDistanceCost = startDistanceCost;
    }

    getName() { return this.name; }
    getParent() { return this.parent; }
    getCost() { return this.cost; }
    getStartDistanceCost() { return this.startDistanceCost; }

    setParent(path_node) { this.parent = path_node; }
    setCost(num) { this.cost = num; }
    setStartDistanceCost(num) { this.startDistanceCost = num; }
}