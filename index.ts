import { readFileSync } from "fs";

() => {
  // Strategy: sort and destructure values.

  // Read:
  const lines = readFileSync("./day1.txt", "utf-8").split("\n");

  // Process:
  const elves = [0];
  let elfIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") {
      elfIndex++;
      elves[elfIndex] = 0;
    } else {
      elves[elfIndex] += parseInt(line);
    }
  }

  // Extract sorted values:
  const [first, second, third] = elves.sort((a, b) => b - a);

  // Part One
  console.log(first);

  // Part Two
  console.log(first + second + third);
};

() => {
  // Strategy: encode the results in a matrix (actually nested dictionaries) and just index in.

  const lines = readFileSync("./day2.txt", "utf-8").split("\n");

  // ABC XYZ
  // 123 123
  // 036
  // Lose=0
  // Draw=3
  // Win=6
  // Rock=AX
  // Paper=BY
  // Scissors=CZ
  // -- A beats C beats B beats A --
  // -- X beats Z beats Y beats X --
  // -- A beats Z
  // -- B beats

  const resultMap = {
    A: { X: 3, Y: 6, Z: 0 },
    B: { X: 0, Y: 3, Z: 6 },
    C: { X: 6, Y: 0, Z: 3 },
  };

  const selectionValue = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  // Part One
  console.log(
    lines
      .map((line) => {
        const [them, us] = line.split(" ");

        return resultMap[them][us] + selectionValue[us];
      })
      .reduce((a, b) => a + b, 0)
  );

  // Part Two
  // X:lose, Y:draw, Z:win
  // rock:1, paper:2, scissors:3
  const resultValue = {
    X: 0,
    Y: 3,
    Z: 6,
  };
  const choiceMap = {
    A: { X: 3, Y: 1, Z: 2 },
    B: { X: 1, Y: 2, Z: 3 },
    C: { X: 2, Y: 3, Z: 1 },
  };

  console.log(
    lines
      .map((line) => {
        const [them, requiredResult] = line.split(" ");

        return choiceMap[them][requiredResult] + resultValue[requiredResult];
      })
      .reduce((a, b) => a + b, 0)
  );
};
