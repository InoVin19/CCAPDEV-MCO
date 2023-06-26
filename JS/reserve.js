new Vue({
  el: '.app',
  data: {
    searchQuery: '',
    holdProfile: [],
    holdURL: [],
    holdDate:[],
    isDate:false,
    isOpen: false,
    myClass: 'invalid',
    labs: ['Lab 1', 'Lab 2', 'Lab 3'],
    selectedLab: '',
    selectedDate: '',
    seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
    timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
    reservations: {},
    selectedSeats: [],
    loggedInUser: '', // Initialize the loggedInUser property
    selectedUser: '', // Initialize the selectedUser property
    users: ['admin', 'yasmin_datario', 'vinnie_inocencio', 'anton_mendoza', 'charles_leclerc', 'john_doe'], // Modify the users array with actual user names
    profilePage: 'viewprofile.html', // Set the profile page URL
    anonymousReservation: false, // Initialize the anonymousReservation property
    actualReservationOwners: {}, // For storing actual owners of anonymous reservations
    dates:[]
  },
  methods: {
    toggleDropdown: function () {
      this.isOpen = !this.isOpen;
    },
    isReserved: function (seat, timeSlot) {
      const reservationData = this.reservations[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
      return !!reservationData;
    },
    isSelected: function (seat, timeSlot) {
      return this.selectedSeats.includes(seat + '_' + timeSlot);
    },
    selectSeat: function (seat, timeSlot) {
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
    confirmReservation: function () {
      if (this.selectedLab && this.selectedDate && (this.loggedInUser || this.selectedUser)) {
        if (!this.reservations[this.selectedLab]) {
          this.reservations[this.selectedLab] = {};
        }
        if (!this.reservations[this.selectedLab][this.selectedDate]) {
          this.reservations[this.selectedLab][this.selectedDate] = {};
        }
        const requestTime = new Date().toLocaleString(); // Get the current request time
        for (let i = 0; i < this.selectedSeats.length; i++) {
          const [seat, timeSlot] = this.selectedSeats[i].split('_');
          if (!this.reservations[this.selectedLab][this.selectedDate][seat]) {
            this.reservations[this.selectedLab][this.selectedDate][seat] = {};
          }
          const reservationOwner = this.loggedInUser === 'admin' ? this.selectedUser : this.loggedInUser;
          const displayedReservationOwner = this.anonymousReservation ? 'Anonymous' : reservationOwner;

          // If the reservation is anonymous, store the actual owner
          if (this.anonymousReservation) {
            if (!this.actualReservationOwners[this.selectedLab]) {
              this.actualReservationOwners[this.selectedLab] = {};
            }
            if (!this.actualReservationOwners[this.selectedLab][this.selectedDate]) {
              this.actualReservationOwners[this.selectedLab][this.selectedDate] = {};
            }
            if (!this.actualReservationOwners[this.selectedLab][this.selectedDate][seat]) {
              this.actualReservationOwners[this.selectedLab][this.selectedDate][seat] = {};
            }
            this.actualReservationOwners[this.selectedLab][this.selectedDate][seat][timeSlot] = reservationOwner;
          }

          if (!this.reservations[this.selectedLab][this.selectedDate][seat]) {
            this.reservations[this.selectedLab][this.selectedDate][seat] = {};
          }
          const reservationData = {
            owner: displayedReservationOwner,
            requestTime: requestTime // Set the request time for the reservation
          };
          this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot] = reservationData;
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
    resetReservations: function () {
      this.reservations = {}; // Clear the reservations data
      localStorage.removeItem('reservations'); // Remove saved reservations from localStorage
      alert('Reservations have been reset.');
    },
    canCancelReservation: function (seat, timeSlot) {
      const reservationData = this.reservations[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
      const actualReservationOwner = this.actualReservationOwners[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
      const reservationOwner = actualReservationOwner || (reservationData && reservationData.owner);
      return this.loggedInUser === 'admin' || reservationOwner === this.loggedInUser;
    },
    cancelReservation: function (seat, timeSlot) {
      if (this.canCancelReservation(seat, timeSlot)) {
        delete this.reservations[this.selectedLab][this.selectedDate][seat][timeSlot];
        // Save updated reservations to localStorage
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        alert('Reservation canceled!');
      } else {
        alert('You are not allowed to cancel this reservation.');
      }
    },
    viewProfile: function (seat, timeSlot) {
      const reservationData = this.reservations[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
      if (reservationData && reservationData.owner !== 'Anonymous') {
        const profileURL = this.profilePage + '?user=' + reservationData.owner;
        window.location.href = profileURL;
      } else {
        alert('This is an anonymous reservation. Profile cannot be viewed.');
      }
    },
    availableSeats: function (lab) {
      let count = 0;
      for (let seat of this.seats) {
        if (this.availableTimeSlots(lab, seat) > 0) {
          count++;
        }
      }
      return count;
    },
    availableTimeSlots: function (lab, seat) {
      let count = 0;
      const dateReservations = this.reservations[lab]?.[this.selectedDate];
      for (let timeSlot of this.timeSlots) {
        if (!dateReservations?.[seat]?.[timeSlot]) {
          count++;
        }
      }
      return count;
    },
    logOut: function () {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    }
  },
  created: function () {
    // Retrieve reservations from localStorage
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      this.reservations = JSON.parse(savedReservations);
    }
    // Retrieve the logged-in user from localStorage
    this.loggedInUser = localStorage.getItem('loggedInUser') || '';
    // Retrieve the actual reservation owners from localStorage
    const savedActualReservationOwners = localStorage.getItem('actualReservationOwners');
    if (savedActualReservationOwners) {
      this.actualReservationOwners = JSON.parse(savedActualReservationOwners);
    }
    // Save actual reservation owners to localStorage
    localStorage.setItem('actualReservationOwners', JSON.stringify(this.actualReservationOwners));

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const minDateString = minDate.toISOString().split('T')[0];
    const maxDateString = maxDate.toISOString().split('T')[0];
    const datePicker = document.getElementById('date');
    if (datePicker) {
      datePicker.setAttribute('min', minDateString);
      datePicker.setAttribute('max', maxDateString);
    }

    let day = new Date();
    for (let i = 0; i < 7; i++) {
      let newDate = new Date();
      newDate.setDate(day.getDate() + i);
      this.dates.push(newDate.toISOString().split('T')[0]);
    }

    if (this.dates.length > 0) {
      this.selectedDate = this.dates[0];
    }

    // Parse the lab and date from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.selectedLab = urlParams.get('lab');
    this.selectedDate = urlParams.get('date');
  },
  watch: {
    searchQuery: function (newVal) {
      this.holdProfile = [];
      this.holdURL = [];
      this.holdDate = [];
      if (!newVal || newVal.trim() === '') {
        this.myClass = 'invalid';
      } else {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].includes(newVal) && !this.dates[i].includes(newVal)) {
            this.myClass = 'valid'
            this.holdProfile.push(this.users[i])
            this.holdURL.push(this.profilePage + '?user=' + this.users[i])
            this.isDate = false
          } 
          else if(this.dates[i].includes(newVal) && !this.users[i].includes(newVal)){
            this.myClass = 'valid'
            this.holdDate.push(this.dates[i] + '   Lab 1: ' + this.availableSeats(1) + '   Lab 2: ' + this.availableSeats(2)+'   Lab 3: ' + this.availableSeats(3))
            this.holdURL.push('reserve.html?date=' + this.dates[i])
            this.isDate = true
          } 
          else {
            this.myClass = 'invalid';
          }
        }
      }
    }
  }
});
