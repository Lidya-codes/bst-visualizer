let nodeIdCounter = 0;

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = nodeIdCounter++;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      } else {
        return;
      }
    }
  }
}

const tree = new BST();

function insertValue() {
  const value = parseInt(document.getElementById("valueInput").value);
  if (!isNaN(value)) {
    tree.insert(value);
    renderTree();
    document.getElementById("valueInput").value = '';
  }
}

function clearTree() {
  tree.root = null;
  document.getElementById("svg-lines").innerHTML = '';
  renderTree();
}

function renderTree() {
  const treeContainer = document.getElementById("tree");
  const svg = document.getElementById("svg-lines");
  treeContainer.innerHTML = "";
  svg.innerHTML = "";

  if (tree.root) {
    const treeElement = buildTreeVisual(tree.root);
    treeContainer.appendChild(treeElement);

    // Delay drawing arrows until DOM is laid out
    setTimeout(() => drawLines(tree.root), 50);
  }
}

function buildTreeVisual(node) {
  if (!node) return null;

  const container = document.createElement("div");
  container.className = "node-container";

  const nodeDiv = document.createElement("div");
  nodeDiv.className = "node";
  nodeDiv.textContent = node.value;
  nodeDiv.id = `node-${node.id}`;

  const childrenDiv = document.createElement("div");
  childrenDiv.className = "level";

  const left = buildTreeVisual(node.left);
  const right = buildTreeVisual(node.right);

  if (left) childrenDiv.appendChild(left);
  else childrenDiv.appendChild(emptyNode());

  if (right) childrenDiv.appendChild(right);
  else childrenDiv.appendChild(emptyNode());

  container.appendChild(nodeDiv);
  if (left || right) container.appendChild(childrenDiv);

  return container;
}

function emptyNode() {
  const empty = document.createElement("div");
  empty.className = "node-container";
  empty.style.flex = "1";
  return empty;
}

function drawLines(node) {
  if (!node) return;

  const parentElem = document.getElementById(`node-${node.id}`);
  const parentBox = parentElem.getBoundingClientRect();

  if (node.left) {
    const childElem = document.getElementById(`node-${node.left.id}`);
    const childBox = childElem.getBoundingClientRect();
    drawLineBetweenElements(parentBox, childBox);
    drawLines(node.left);
  }

  if (node.right) {
    const childElem = document.getElementById(`node-${node.right.id}`);
    const childBox = childElem.getBoundingClientRect();
    drawLineBetweenElements(parentBox, childBox);
    drawLines(node.right);
  }
}

function drawLineBetweenElements(parentBox, childBox) {
  const svg = document.getElementById("svg-lines");

  const treeWrapperBox = document.getElementById("tree-wrapper").getBoundingClientRect();

  const x1 = parentBox.left + parentBox.width / 2 - treeWrapperBox.left;
  const y1 = parentBox.bottom - treeWrapperBox.top;
  const x2 = childBox.left + childBox.width / 2 - treeWrapperBox.left;
  const y2 = childBox.top - treeWrapperBox.top;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("class", "line");

  svg.appendChild(line);
}
