export function allocateSeats(passengers, seatMap) {
  const allocatedSeats = {};

  passengers.sort((a, b) => {
    if (a.age >= 60 && b.age < 60) {
      return -1;
    } else if (a.age < 60 && b.age >= 60) {
      return 1;
    } else if (a.gender === "F" && b.gender === "M") {
      return -1;
    } else if (a.gender === "M" && b.gender === "F") {
      return 1;
    } else {
      return 0;
    }
  });

  for (const passenger of passengers) {
    let preferredSeats = [];

    if (passenger.age >= 60) {
      preferredSeats = seatMap
        .map((row, rowIndex) =>
          row.map((seat, colIndex) => ({
            row: rowIndex,
            col: colIndex,
            distanceFromWindow: Math.min(colIndex, row.length - colIndex - 1),
          }))
        )
        .flat()
        .filter((seat) => {
          return (
            seat.distanceFromWindow === 0 &&
            !allocatedSeats[`${seat.row},${seat.col}`]
          );
        });
    }

    if (preferredSeats.length === 0) {
      preferredSeats = seatMap
        .map((row, rowIndex) =>
          row.map((seat, colIndex) => ({
            row: rowIndex,
            col: colIndex,
            distanceFromWindow: Math.min(colIndex, row.length - colIndex - 1),
          }))
        )
        .flat()
        .filter((seat) => {
          return (
            seat.distanceFromWindow > 0 &&
            !allocatedSeats[`${seat.row},${seat.col}`]
          );
        });
    }

    for (const seat of preferredSeats) {
      if (
        isSeatAvailable(seat.row, seat.col, seatMap, allocatedSeats, passenger)
      ) {
        allocatedSeats[`${seat.row},${seat.col}`] = passenger;
        passenger.seat = `${seat.row},${seat.col}`;
        break;
      }
    }

    if (!passenger.seat) {
      for (let row = 0; row < seatMap.length; row++) {
        for (let col = 0; col < seatMap[row].length; col++) {
          if (isSeatAvailable(row, col, seatMap, allocatedSeats, passenger)) {
            allocatedSeats[`${row},${col}`] = passenger;
            passenger.seat = `${row},${col}`;
            break;
          }
        }
        if (passenger.seat) break;
      }
    }
  }

  passengers.forEach((ele) => {
    if (ele.seat) {
      const split = ele.seat.split(",");
      seatMap[split[0]][split[1]] = ele;
    }
  });
  return [passengers, seatMap];
}

function isSeatAvailable(row, col, seatMap, allocatedSeats, passenger) {
  if (seatMap[row][col]?.name) return false; // Seat is unavailable
  if (allocatedSeats[`${row},${col}`]) {
    const existingPassenger = allocatedSeats[`${row},${col}`];
    if (existingPassenger.agentId === passenger.agentId) return true;
    if (existingPassenger.gender === passenger.gender) return false;
    if (existingPassenger.age >= 60 && passenger.age >= 60) {
      if (
        existingPassenger.seat.split(",")[1] === passenger.seat.split(",")[1]
      ) {
        return false;
      }
    }
    return true;
  }
  return true;
}

export function createZeroMatrix(n) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}

// const passengers = [
//   { name: "Jane", age: 60, gender: "F", agentId: 3 },
//   { name: "Mike", age: 50, gender: "M", agentId: 2 },
//   { name: "Rose", age: 61, gender: "F", agentId: 1 },
// ];

// const p2 = [
//   { name: "Ram", age: 70, gender: "M", agentId: 1 },
//   { name: "Susan", age: 35, gender: "F", agentId: 3 },
//   { name: "Sumitha", age: 30, gender: "F", agentId: 2 },
// ];

// var seatMap = [
//   ["O", "O", "O", "O", "O", "O"],
//   ["O", "O", "O", "O", "O", "O"],
//   ["O", "O", "O", "O", "O", "O"],
//   ["O", "O", "O", "O", "O", "O"],
//   ["O", "O", "O", "O", "O", "O"],
// ];
