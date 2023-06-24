new Vue({
  el: '#app',
  data: {
    labs: ['Lab 1', 'Lab 2', 'Lab 3'],
    selectedLab: '',
    selectedDate: '',
    seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
    timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
    reservations: {},
    selectedSeats: [],
    loggedInUser: '', // Initialize the loggedInUser property
    selectedUser: '', // Initialize the selectedUser property
    users: ['student1', 'student2', 'student3'], // Modify the users array with actual user names
    profilePage: 'viewprofile.html' // Set the profile page URL
  },
  methods: {
    isReserved: function(seat, timeSlot) {
      if (
        this.reservations[this.selectedLab] &&
        this.reservations[this.selectedLab][this.selectedDate] &&
        this.reservations[this.selectedLab][this.selectedDate][seat] &&
        this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot]
      ) {
        return this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot];
      }
      return false;
    },
    isSelected: function(seat, timeSlot) {
      return this.selectedSeats.includes(seat + '_' + timeSlot);
    },
    selectSeat: function(seat, timeSlot) {
      const seatTime = seat + '_' + timeSlot;
      if (!this.isSelected(seat, timeSlot)) {
        if (!this.isReserved(seat, timeSlot)) {
          this.selectedSeats.push(seatTime);
        }
      } else {
        const index = this.selectedSeats.indexOf(seatTime);
        this.selectedSeats.splice(index, 1);
      }
    },
    confirmReservation: function() {
      if (this.selectedLab && this.selectedDate && (this.loggedInUser || this.selectedUser)) {
        if (!this.reservations[this.selectedLab]) {
          this.reservations[this.selectedLab] = {};
        }
        if (!this.reservations[this.selectedLab][this.selectedDate]) {
          this.reservations[this.selectedLab][this.selectedDate] = {};
        }
        for (let i = 0; i < this.selectedSeats.length; i++) {
          const [seat, timeSlot] = this.selectedSeats[i].split('_');
          if (!this.reservations[this.selectedLab][this.selectedDate][seat]) {
            this.reservations[this.selectedLab][this.selectedDate][seat] = {};
          }
          const reservationOwner = this.loggedInUser === 'admin' ? this.selectedUser : this.loggedInUser;
          this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot] = 'Reserved by ' + reservationOwner;
        }
        
        // Clear selected seats
        this.selectedSeats = [];

        // Save reservations to localStorage
        localStorage.setItem('reservations', JSON.stringify(this.reservations));

        alert('Reservation confirmed!');
      } else {
        alert('Please select a lab, date, and user (for admin) before confirming the reservation.');
      }
    },
    resetReservations: function() {
      this.reservations = {}; // Clear the reservations data
      localStorage.removeItem('reservations'); // Remove saved reservations from localStorage
      alert('Reservations have been reset.');
    },
    canCancelReservation: function(seat, timeSlot) {
      if (this.loggedInUser === 'admin') {
        return true; // Admin can cancel any reservation
      } else {
        const reservation = this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot];
        return reservation === 'Reserved by ' + this.loggedInUser;
      }
    },
    cancelReservation: function(seat, timeSlot) {
      if (this.canCancelReservation(seat, timeSlot)) {
        delete this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot];
        // Save updated reservations to localStorage
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        alert('Reservation canceled!');
      } else {
        alert('You are not allowed to cancel this reservation.');
      }
    },
    viewProfile: function(seat, timeSlot) {
      const reservationOwner = this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot];
      const username = reservationOwner.split(' ')[2];
      const profileURL = this.profilePage + '?user=' + username;
      window.location.href = profileURL;
    }
  },
  created: function() {
    // Retrieve reservations from localStorage
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      this.reservations = JSON.parse(savedReservations);
    }
    // Retrieve the logged-in user from localStorage
    this.loggedInUser = localStorage.getItem('loggedInUser') || '';
  }
});