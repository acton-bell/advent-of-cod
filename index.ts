import { readFileSync, writeFileSync } from "fs";

const LINE_TERMINATOR = /\r?\n/;

const day1 = () => {
  // Strategy: sort and destructure values.

  // Read:
  const lines = readFileSync("./day1.txt", "utf-8").split(LINE_TERMINATOR);

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

const day2 = () => {
  // Strategy: encode the results in a matrix (actually nested dictionaries) and just index in.

  const lines = readFileSync("./day2.txt", "utf-8").split(LINE_TERMINATOR);

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

const day3 = () => {
  const lines = readFileSync("./day3.txt", "utf-8").split(LINE_TERMINATOR);
  const priority = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const partOne = lines
    .map((line) => {
      const compartmentOne = line.slice(0, line.length / 2);
      const compartmentTwo = line.slice(line.length / 2);

      for (let i = 0; i < compartmentOne.length; i++) {
        for (let j = 0; j < compartmentTwo.length; j++) {
          if (compartmentOne[i] === compartmentTwo[j]) {
            return priority.indexOf(compartmentOne[i]) + 1;
          }
        }
      }
    })
    .reduce((a, b) => a + b, 0);

  console.log(partOne);

  let partTwo = 0;

  const checkRucksacks = (
    rucksack_i: string,
    rucksack_j: string,
    rucksack_k: string
  ) => {
    for (let i = 0; i < rucksack_i.length; i++) {
      const item_i = rucksack_i[i];
      for (let j = 0; j < rucksack_j.length; j++) {
        const item_j = rucksack_j[j];
        if (item_i === item_j) {
          for (let k = 0; k < rucksack_k.length; k++) {
            if (item_j === rucksack_k[k]) {
              return priority.indexOf(item_i) + 1;
            }
          }
        }
      }
    }
  };

  while (lines.length > 2) {
    partTwo += checkRucksacks(lines.pop(), lines.pop(), lines.pop());
  }

  console.log(partTwo);
};

const day4 = () => {
  // 24-91,80-92
  const lines = readFileSync("./day4.txt", "utf-8").split(LINE_TERMINATOR);

  const parsed = lines.map((line) =>
    line.split(",").flatMap((range) => range.split("-").map((_) => parseInt(_)))
  );

  const partOne = parsed.filter(
    ([range1Min, range1Max, range2Min, range2Max]) =>
      (range1Min >= range2Min && range1Max <= range2Max) ||
      (range2Min >= range1Min && range2Max <= range1Max)
  );

  console.log(partOne.length);

  const partTwo = parsed.filter(
    ([range1Min, range1Max, range2Min, range2Max]) =>
      (range1Min >= range2Min && range1Min <= range2Max) ||
      (range1Min < range2Min && range1Max >= range2Min) ||
      (range1Max >= range2Min && range1Max <= range2Max)
  );

  console.log(partTwo.length);
};

// day4();

const day5 = () => {
  // Could just encode the input as arrays...
  const input = `[F]         [L]     [M]            
[T]     [H] [V] [G] [V]            
[N]     [T] [D] [R] [N]     [D]    
[Z]     [B] [C] [P] [B] [R] [Z]    
[M]     [J] [N] [M] [F] [M] [V] [H]
[G] [J] [L] [J] [S] [C] [G] [M] [F]
[H] [W] [V] [P] [W] [H] [H] [N] [N]
[J] [V] [G] [B] [F] [G] [D] [H] [G]
 1   2   3   4   5   6   7   8   9 `;

  // TODO: Is there an easier way to construct the initial state?
  const [_, ...entryLines] = input.split("\n\n").reverse();
  const initialState = Array.from(Array(9), () => []);
  entryLines.forEach((line) => {
    for (let i = 1; i < line.length; i += 4) {
      if (line[i] !== " ") {
        initialState[(i - 1) / 4].push(line[i]);
      }
    }
  });

  // TODO: Is there a nice way to destructure the instruction?
  const instructions = readFileSync("day5.txt", "utf8")
    .split(LINE_TERMINATOR)
    .map((rawInstruction) => {
      let move = parseInt(
        rawInstruction.slice(5, rawInstruction.indexOf(" from "))
      );
      const from = parseInt(
        rawInstruction.slice(
          rawInstruction.indexOf(" from ") + 6,
          rawInstruction.indexOf(" to ")
        )
      );
      const to = parseInt(
        rawInstruction.slice(rawInstruction.indexOf(" to ") + 4)
      );

      return [move, from, to] as [number, number, number];
    });

  console.log(
    instructions
      .reduce((slots, [move, from, to]) => {
        while (move > 0) {
          move--;
          slots[to - 1].push(slots[from - 1].pop());
        }

        return slots;
      }, JSON.parse(JSON.stringify(initialState)) as typeof initialState)
      .map((slot) => slot[slot.length - 1])
      .join("")
  );

  console.log(
    instructions
      .reduce((slots, [move, from, to]) => {
        slots[to - 1].splice(
          slots[to - 1].length,
          0,
          ...slots[from - 1].splice(slots[from - 1].length - move)
        );

        return slots;
      }, JSON.parse(JSON.stringify(initialState)) as typeof initialState)
      .map((slot) => slot[slot.length - 1])
      .join("")
  );
};

const day6 = () => {
  const rawString = readFileSync("./day6.txt", "utf-8");

  // This only works for part 1 (?):
  // IMPORTANT: Aha, this doesn't work for sequences like 'gtbzgtn' (looking for 5), because it resets when hitting the second 'g' and misses the sequence starting at 'b'.
  const impl1 = (input: string, uniqueSequenceLength: number) => {
    const workingSet = new Set();
    for (let i = 0; i < input.length; i++) {
      // The next character:
      const char = input[i];
      // We found a duplicate so reset the sequence:
      if (workingSet.has(char)) {
        workingSet.clear();
      }

      // Character is now guaranteed to be unique in the set, so add it:
      workingSet.add(char);

      // We reached the desired length...
      if (workingSet.size === uniqueSequenceLength) {
        // ...so return the index:
        return i;
      }
    }
  };

  // This works for both:
  const impl2 = (input: string, uniqueSequenceLength: number) => {
    for (let i = uniqueSequenceLength; i < input.length; i++) {
      const s = new Set(input.split("").slice(i - uniqueSequenceLength, i));
      if (s.size === uniqueSequenceLength) {
        return i;
      }
    }
  };

  // This is correct:
  // console.log(impl1(rawString, 4));
  // This is correct:
  console.log(impl2(rawString, 4));

  // This is not correct (returns undefined), but why?
  // console.log(impl1(rawString, 14));
  // This is correct:
  console.log(impl2(rawString, 14));
};

const day7 = () => {
  const instructions = readFileSync("./day7.txt", "utf8").split(
    LINE_TERMINATOR
  );

  // Purposes as defined by the Symbol descriptions:
  const parentPointerSymbol = Symbol("holds reference to the object's parent");
  const rolledUpSizeSymbol = "folderSize";

  // The root file system:
  const fileSystem = { "/": { [rolledUpSizeSymbol]: 0 } };
  let locationPointer = fileSystem;
  instructions.forEach((instruction) => {
    const instArr = instruction.split(" ");
    switch (instArr[0]) {
      case "$": {
        const userCommand = instArr[1];
        // We're executing a user command (cd or ls):
        switch (userCommand) {
          case "cd":
            const changeToDirectory = instArr[2];
            locationPointer =
              locationPointer[
                changeToDirectory === ".."
                  ? parentPointerSymbol
                  : changeToDirectory
              ];
            break;
          case "ls":
            // Nothing to do here, would be different if implementing as a state machine.
            break;
        }
        break;
      }
      case "dir":
        // We've discovered a directory, initialise it if it doesn't already exist (I think it's always new, but just in case):
        const directoryName = instArr[1];
        locationPointer[directoryName] = {
          [parentPointerSymbol]: locationPointer,
          [rolledUpSizeSymbol]: 0,
        };

        break;
      default: {
        // Only other possible instruction SHOULD be a file size listing (we could check this I guess):
        const size = parseInt(instArr[0]);

        // Recurse up the directory structure and add the new size:
        let cur = locationPointer;
        while (cur) {
          cur[rolledUpSizeSymbol] += size;
          cur = cur[parentPointerSymbol];
        }
      }
    }
  });

  // Part one answer calculation:

  // Traverse and record <100000:
  const rollup = (item: any) =>
    (item[rolledUpSizeSymbol] <= 100000 ? item[rolledUpSizeSymbol] : 0) +
    Object.values(item)
      .map((child) => rollup(child))
      .reduce((a, b) => a + b, 0);

  console.log(rollup(fileSystem["/"]));

  // Part two answer calculation:
  const totalSpace = 70000000;
  const unusedSpace = totalSpace - fileSystem["/"][rolledUpSizeSymbol];
  const updateSpaceRequired = 30000000;
  const needToFreeUpSpace = updateSpaceRequired - unusedSpace;
  let partTwoAnswer = Infinity;
  const traverseAndFindAnswer = (item: any) => {
    if (
      item[rolledUpSizeSymbol] > needToFreeUpSpace &&
      item[rolledUpSizeSymbol] < partTwoAnswer
    ) {
      partTwoAnswer = item[rolledUpSizeSymbol];
    }

    Object.values(item).forEach((child) => traverseAndFindAnswer(child));
  };

  traverseAndFindAnswer(fileSystem["/"]);

  console.log(partTwoAnswer);
};

const day8 = () => {
  const input = readFileSync("./day8.txt", "utf8")
    .split(LINE_TERMINATOR)
    .map((line) => line.split("").map((char) => parseInt(char)));

  // console.log(input);

  // ASSUMPTION: Input is square
  const processedMap: Record<
    string,
    | {
        visible: 1 | 0;
        leftComponent: number;
        rightComponent: number;
        bottomComponent: number;
        topComponent: number;
      }
    | undefined
  > = {};
  const debugMap = Array.from(Array(input.length), () =>
    Array.from(Array(input.length), () => 0)
  );

  for (let y = 0; y < input.length; y++) {
    const row = input[y];

    let heightPositionMap: Record<number, number | undefined> = {};
    let highestFromTheLeft = -1;
    for (let x = 0; x < row.length; x++) {
      const height = row[x];
      if (processedMap[`${x},${y}`] === undefined) {
        processedMap[`${x},${y}`] = {
          visible: 0,
          bottomComponent: input.length - y - 1,
          leftComponent: x,
          rightComponent: input[y].length - x - 1,
          topComponent: y,
        };
      }

      if (height > highestFromTheLeft) {
        highestFromTheLeft = height;
        processedMap[`${x},${y}`].visible = 1;
      }

      for (let i = height; i < 10; i++) {
        if (
          heightPositionMap[i] !== undefined &&
          x - heightPositionMap[i] < processedMap[`${x},${y}`]?.leftComponent
        ) {
          processedMap[`${x},${y}`].leftComponent = x - heightPositionMap[i];
        }
      }

      heightPositionMap[height] = x;
    }

    heightPositionMap = {};
    let highestFromTheRight = -1;
    for (let x = row.length - 1; x > -1; x--) {
      const height = row[x];

      if (processedMap[`${x},${y}`] === undefined) {
        processedMap[`${x},${y}`] = {
          visible: 0,
          bottomComponent: input.length - y - 1,
          leftComponent: x,
          rightComponent: input[y].length - x - 1,
          topComponent: y,
        };
      }

      if (height > highestFromTheRight) {
        highestFromTheRight = height;
        processedMap[`${x},${y}`].visible = 1;
      }

      for (let i = height; i < 10; i++) {
        if (
          heightPositionMap[i] !== undefined &&
          heightPositionMap[i] - x < processedMap[`${x},${y}`]?.rightComponent
        ) {
          processedMap[`${x},${y}`].rightComponent = heightPositionMap[i] - x;
        }
      }

      heightPositionMap[height] = x;
    }
  }

  for (let x = 0; x < input[0].length; x++) {
    let heightPositionMap: Record<number, number | undefined> = {};
    let highestFromTheTop = -1;
    for (let y = 0; y < input.length; y++) {
      const height = input[y][x];

      if (processedMap[`${x},${y}`] === undefined) {
        processedMap[`${x},${y}`] = {
          visible: 0,
          bottomComponent: input.length - y - 1,
          leftComponent: x,
          rightComponent: input[y].length - x - 1,
          topComponent: y,
        };
      }
      if (height > highestFromTheTop) {
        highestFromTheTop = height;
        processedMap[`${x},${y}`].visible = 1;
      }

      for (let i = height; i < 10; i++) {
        if (
          heightPositionMap[i] !== undefined &&
          y - heightPositionMap[i] < processedMap[`${x},${y}`]?.topComponent
        ) {
          processedMap[`${x},${y}`].topComponent = y - heightPositionMap[i];
        }
      }

      heightPositionMap[height] = y;
    }

    heightPositionMap = {};
    let highestFromTheBottom = -1;
    for (let y = input.length - 1; y > -1; y--) {
      const height = input[y][x];

      if (processedMap[`${x},${y}`] === undefined) {
        processedMap[`${x},${y}`] = {
          visible: 0,
          bottomComponent: input.length - y - 1,
          leftComponent: x,
          rightComponent: input[y].length - x - 1,
          topComponent: y,
        };
      }
      if (height > highestFromTheBottom) {
        highestFromTheBottom = height;
        processedMap[`${x},${y}`].visible = 1;
      }

      for (let i = height; i < 10; i++) {
        if (
          heightPositionMap[i] !== undefined &&
          heightPositionMap[i] - y < processedMap[`${x},${y}`]?.bottomComponent
        ) {
          processedMap[`${x},${y}`].bottomComponent = heightPositionMap[i] - y;
        }
      }

      heightPositionMap[height] = y;
    }
  }

  // console.log(visibleMap);
  console.log(
    "Part one",
    Object.values(processedMap).filter((item) => item?.visible === 1).length
  );
  Object.keys(processedMap).forEach((key) => {
    const [x, y] = key.split(",").map((coord) => parseInt(coord));
    debugMap[y][x] = processedMap[`${x},${y}`]?.bottomComponent;
  });
  // console.log(processedMap);
  writeFileSync(
    "./day8Debug.txt",
    debugMap
      .map((line) => line.map((char) => (char === -1 ? "X" : char)).join(""))
      .join("/n"),
    "utf8"
  );

  writeFileSync(
    "./day8Part2Debug.json",
    JSON.stringify(processedMap, null, 2),
    "utf8"
  );

  console.log(
    "Part two:",
    Object.values(processedMap)
      .map(
        (item) =>
          (item?.bottomComponent ?? 0) *
          (item?.topComponent ?? 0) *
          (item?.leftComponent ?? 0) *
          (item?.rightComponent ?? 0)
      )
      .sort((a, b) => b - a)[0]
  );

  // console.log(Object.values(processedMap));
};

day8();
