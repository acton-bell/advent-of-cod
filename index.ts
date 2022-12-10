import { readFileSync } from "fs";

const LINE_TERMINATOR = "\r\n";

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
  console.log(impl1(rawString, 4));
  // This is correct:
  console.log(impl2(rawString, 4));

  // This is not correct (returns undefined), but why?
  console.log(impl1(rawString, 14));
  // This is correct:
  console.log(impl2(rawString, 14));
};
