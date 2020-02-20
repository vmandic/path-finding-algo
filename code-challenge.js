// NOTE: find start X and Y
const findStartNode = maxY => {
  let currentNode = { x: -1, y: 0 };

  for (; currentNode.y < maxY; currentNode.y++) {
    currentNode.x = charMap[currentNode.y].indexOf("@");

    if (currentNode.x > -1) {
      console.log(`@ is on: [x: ${currentNode.x}, y: ${currentNode.y}]`);
      break;
    }
  }

  if (currentNode.x < 0) {
    throw new Error("Invalid ASCII map, @ character not found");
  }

  return currentNode;
};

// NOTE: clockwise direction lookup
const getNextPosition = (nextDirection, currentNode) => {
  switch (nextDirection) {
    case "left":
      return { x: currentNode.x - 1, y: currentNode.y, nextDirection: "up" };
    case "up":
      return { x: currentNode.x, y: currentNode.y - 1, nextDirection: "right" };
    case "right":
      return { x: currentNode.x + 1, y: currentNode.y, nextDirection: "down" };
    case "down":
      return { x: currentNode.x, y: currentNode.y + 1, nextDirection: "left" };
  }
};

const shouldSkipVertical = (currentNode, nextNode) => {
  if (currentNode.char == "|" && /^[A-Z\+\-]$/.test(nextNode.char)) {
    if (currentNode.y < nextNode.y) {
      currentNode.y++;
    } else {
      currentNode.y--;
    }
    return true;
  }
};

const shouldSkipHorizontal = (currentNode, nextNode) => {
  if (currentNode.char == "-" && /^[A-Z|\-]$/.test(nextNode.char)) {
    if (currentNode.x < nextNode.x) {
      currentNode.x++;
    } else {
      currentNode.x--;
    }
    return true;
  }
};

const getNextNodeFromPosition = (charNodeMap, nextPosition) => charNodeMap[nextPosition.y][nextPosition.x];

const advanceNode = nextNode => {
  nextNode.visited = true;
  return nextNode;
};

const collectNodeCharPath = (char, path, letters) => {
  path.push(char);

  if (/^[A-Z]$/.test(char)) {
    letters.push(char);
  }
};

// NOTE: start here
const input1 = 
`  @---A---+
          |
  x-B-+   C
      |   |
      +---+`;

const input2 = 
`      @
      | C----+
      A |    |
      +---B--+
        |      x
        |      |
        +---D--+`;

const input3 = 
`  @---+
      B
K-----|--A
|     |  |
|  +--E  |
|  |     |
+--E--Ex C
   |     |
   +--F--+`;

// NOTE: select input...
const lines = input3.split("\n");
const charMap = lines.map(l => l.split(""));
const charNodeMap = charMap.map((line, y) =>
  line.map((char, x) => ({ char, x, y }))
);
let nextNode;
let direction = "left";
const path = ["@"];
const letters = [];

let currentNode = findStartNode(lines.length);

do {
  let nextPosition = getNextPosition(direction, currentNode);

  try { nextNode = getNextNodeFromPosition(charNodeMap, nextPosition); }
  catch { /*  NOTE: when undefined */ }

  if (!nextNode || nextNode.char == " " || nextNode.visited) {
    if (nextNode && nextNode.visited) {
      if ( // NOTE: skip over visited nodes in path
        shouldSkipVertical(currentNode, nextNode) ||
        shouldSkipHorizontal(currentNode, nextNode)
      ) {
        // NOTE: must collect visited (again) and skipped node
        path.push(nextNode.char);
        continue;
      }
    }
    // NOTE: advance position clockwise
    direction = nextPosition.nextDirection;
    continue;
  }

  // NOTE: got valid unvisited node, make it current
  currentNode = advanceNode(nextNode);

  collectNodeCharPath(currentNode.char, path, letters);
} while (currentNode.char != "x");

console.log(letters.join(""));
console.log(path.join(""));
