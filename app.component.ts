import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  seatRows: number[][] = [];
  numSeats: number = 0;
  rows: number = 12;
  seatsPerRow: number = 7;
  lastRowSeats: number = 3;
  totalSeats: number =
    this.rows * this.seatsPerRow - (this.seatsPerRow - this.lastRowSeats);
  reservedSeats: number[] = [];
  isSeatReserved: any;

  constructor() {
    const rows = 12; // Number of rows
    const seatsPerRow = 7; // Seats per row
    const lastRowSeats = 3; // Seats in the last row
    for (let i = 0; i < rows; i++) {
      const rowSeats = i === rows - 1 ? lastRowSeats : seatsPerRow;
      const row = Array.from(
        { length: rowSeats },
        (_, index) => i * seatsPerRow + index + 1
      );
      this.seatRows.push(row);
    }
  }
  //  -------------------  function for Reserve Seat -----------------------------------------------------

  reserveSeats(numSeats: number) {
    if (numSeats > 0 && numSeats <= this.totalSeats) {
      let seatsToReserve: number[] = [];

      // Check if enough seats are available in one row
      let rowToCheck = -1;
      for (let i = 0; i < this.seatRows.length; i++) {
        const rowSeats = this.seatRows[i];
        const availableSeatsInRow = rowSeats.filter(
          (seat) => !this.reservedSeats.includes(seat)
        );

        if (availableSeatsInRow.length >= numSeats) {
          rowToCheck = i;
          break;
        }
      }

      if (rowToCheck !== -1) {
        const rowSeats = this.seatRows[rowToCheck];
        seatsToReserve = rowSeats
          .filter((seat) => !this.reservedSeats.includes(seat))
          .slice(0, numSeats);

        // Reserve the seats
        this.reservedSeats = this.reservedSeats.concat(seatsToReserve);
        console.log(`Reserved seats: ${seatsToReserve.join(', ')}`);
      } else {
        seatsToReserve = this.reserveNearbySeats(numSeats);
      }
    } else {
      alert(' Invalid Number of seats. !! ');

      console.log('Invalid number of seats.');
    }
  }
  //  ------------------determine the number of seats that are already reserved -----------------------------------------------------

  getReservedSeatsInRow(row: number): number {
    const startSeat = row * this.seatsPerRow + 1;
    const endSeat = Math.min(startSeat + this.seatsPerRow - 1, this.totalSeats);
    const reservedSeatsInRow = this.reservedSeats.filter(
      (seat) => seat >= startSeat && seat <= endSeat
    );
    return reservedSeatsInRow.length;
  }
  //  ------------------- Reserving nearest Seat -----------------------------------------------------
  reserveNearbySeats(numSeats: number): number[] {
    let seatsToReserve: number[] = [];
    let seatsRemaining = numSeats;

    for (let row = 0; row < this.rows; row++) {
      const reservedSeatsInRow = this.getReservedSeatsInRow(row);
      const seatsInRow =
        row === this.rows - 1 ? this.lastRowSeats : this.seatsPerRow;
      const availableSeatsInRow = seatsInRow - reservedSeatsInRow;

      if (availableSeatsInRow >= seatsRemaining) {
        // Enough seats available in the current row
        const startSeat = row * this.seatsPerRow + 1;
        const endSeat = startSeat + seatsInRow - 1;

        for (
          let seat = startSeat;
          seat <= endSeat && seatsRemaining > 0;
          seat++
        ) {
          if (!this.isSeatReserved(seat) && !seatsToReserve.includes(seat)) {
            seatsToReserve.push(seat);
            seatsRemaining--;
          }
        }

        if (seatsRemaining === 0) {
          break;
        }
      } else {
        alert('Invalid Number of seats. !!');
        break;
      }
    }

    return seatsToReserve;
  }
  // -------------------------check the availability of a specific seat--------------
  isSeatAvailable(seat: number): boolean {
    return !this.reservedSeats.includes(seat);
  }
}
