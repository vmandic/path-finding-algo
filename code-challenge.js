// TASK: https://gist.github.com/tuomasj/8061c6940d74d3ab55bbea582e6c8f24

var input1 = `  @---A---+
          |
  x-B-+   C
      |   |
      +---+`;

var input2 = `      @
      | C----+
      A |    |
      +---B--+
        |      x
        |      |
        +---D--+`;

var input3 = `  @---+
      B
K-----|--A
|     |  |
|  +--E  |
|  |     |
+--E--Ex C
   |     |
   +--F--+`;

// NOTE: find start X and Y
const findStartNode = maxY => {
  let currentNode = { x: -1, y: 0 };

  for (; currentNode.y < maxY; currentNode.y++) {
    currentNode.x = charMap[currentNode.y].indexOf("@");

    if (currentNode.x > -1) {
      log(`@ is on: [x: ${currentNode.x}, y: ${currentNode.y}]`);
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
  return false;
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
  return false;
};

const getNextNode = (charNodeMap, nextPos) => charNodeMap[nextPos.y][nextPos.x];

const advanceNode = nextNode => ({ ...nextNode, visited: true });

const isCharCapitalLetter = char => /^[A-Z]$/.test(char);

const collectNodeCharPath = (char, path, letters) => {
  path.push(char);

  if (isCharCapitalLetter(char)) {
    letters.push(char);
  }
};

const log = console.log;
const lines = input3.split("\n");
const charMap = lines.map(l => l.split(""));
const charNodeMap = charMap.map((line, y) => line.map((char, x) => ({ char, x, y })));
let nextNode;
let direction = "left";
const path = ["@"];
const letters = [];

let currentNode = findStartNode(lines.length);

do {
  let nextPos = getNextPosition(direction, currentNode);

  try {
    nextNode = getNextNode(charNodeMap, nextPos);
  } catch {
    /*  NOTE: when undefined */
  }

  if (!nextNode || nextNode.char == " " || nextNode.visited) {
    if (nextNode && nextNode.visited) {
      // NOTE: skip over visited nodes in path
      if (
        shouldSkipVertical(currentNode, nextNode) ||
        shouldSkipHorizontal(currentNode, nextNode)
      ) {
        // NOTE: collect visited (again) and skipped node
        path.push(nextNode.char);
        continue;
      }
    }
    direction = nextPos.nextDirection;
    continue;
  }

  // NOTE: got valid unvisited node
  currentNode = nextNode;
  currentNode.visited = true;
  collectNodeCharPath(currentNode.char, path, letters);
} while (currentNode.char != "x");

log(letters.join(""));
log(path.join(""));
