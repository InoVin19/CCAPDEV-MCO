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
    seats: ['C1', 'C6', 'C11', 'C16', 'C2', 'C7', 'C12', 'C17', 'C3', 'C8', 'C13', 'C18', 'C4', 'C9', 'C14', 'C19', 'C5', 'C10', 'C15', 'C20'],
    timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
    selectedSeat: '',
    selectedGridItem: '',
    reservations: {},
    dbReservation:{},
    selectedSeats: [],
    loggedInUser: '', // Initialize the loggedInUser property
    selectedUser: '', // Initialize the selectedUser property
    users: null, // Modify the users array with actual user names
    profilePage: 'viewprofile.html', // Set the profile page URL
    anonymousReservation: false, // Initialize the anonymousReservation property
    actualReservationOwners: {}, // For storing actual owners of anonymous reservations
    requestTimesWithOwners: [], // Initialize an array to hold formatted request times with owners
    selectedRequestTime: '', // New data property to hold the selected request time
    dates:[],
    profiles:[],
    dbReservedSlots:{}
  },
  methods: {
    updateSelectedSeat: function(seat) {
      this.selectedSeat = seat;
      this.selectedGridItem = seat;
    },
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
    saveReservedSlots: function () {
      for (let i = 0; i < this.profiles.length; i++) {
        for (let j = 0; j < this.profiles[i].reservations.length; j++) {
          for (let k = 0; k < this.profiles[i].reservations[j].timeSlot.length; k++) {
            const prof = this.profiles[i].reservations[j];
            this.dbReservation[prof.lab] = {};
            this.dbReservation[prof.lab][prof.date] = {};
            this.dbReservation[prof.lab][prof.date][prof.seat] = {};
            const reservationKey = `${prof.lab},${prof.date},${prof.seat},${prof.timeSlot[k]}`;
            const reservationData = {
              owner: this.profiles[i].username,
              requestTime: prof.requestTime // Set the request time for the reservation
            };
            this.$set(this.dbReservedSlots, reservationKey ,this.dbReservation[prof.lab][prof.date][prof.seat][prof.timeSlot[k]] = reservationData);
          }
        }
      }
    },
    convertToOrigFormat: function () {
      // Create an empty object to store the result in the original format
      const origFormatReservations = {};

      for (const key in this.dbReservedSlots) {
        const [lab, date, seat, timeSlot] = key.split(',');
        const reservationData = this.dbReservedSlots[key];

        // Create objects for each level if they don't exist yet
        if (!origFormatReservations[lab]) {
          origFormatReservations[lab] = {};
        }
        if (!origFormatReservations[lab][date]) {
          origFormatReservations[lab][date] = {};
        }
        if (!origFormatReservations[lab][date][seat]) {
          origFormatReservations[lab][date][seat] = {};
        }

        origFormatReservations[lab][date][seat][timeSlot] = reservationData;
      }

      // Update the reservations object with the new data in the original format
      this.dbReservation = origFormatReservations;
      this.dbReservedSlots = JSON.stringify(this.dbReservation);
      localStorage.setItem('reservations', JSON.stringify(this.dbReservation));
      this.dbReservation = {}
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
    cancelEntireReservation: function () {
      if (this.selectedLab && this.selectedDate && this.selectedSeat) {
        if (this.loggedInUser !== 'admin') {
          alert('You do not have permission to cancel all reservations for the selected seat, date, and lab.');
          return;
        }
    
        if (confirm('Are you sure you want to cancel all reservations for the selected lab, date, and seat?')) {
          // Remove all reservations for the selected seat, date, and lab
          this.reservations[this.selectedLab][this.selectedDate][this.selectedSeat] = {};
          // Save updated reservations to localStorage
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
          alert('All reservations for the selected seat, date, and lab canceled!');
        }
      } else {
        alert('Please select a lab, date, and seat before canceling the reservations.');
      }
    },
    cancelReservationsByRequestTime: function() {
      if (this.loggedInUser !== 'admin') {
        alert('Only an admin can bulk cancel reservations.');
        return;
      }
    
      if (!this.selectedRequestTime) {
        alert('Please select a request time from the dropdown before proceeding.');
        return;
      }
    
      const confirmation = confirm('Are you sure you want to cancel all reservations made at the selected request time?');
      if (!confirmation) {
        return;
      }
    
      let selectedTimestamp = this.selectedRequestTime.split(' (')[0];  // Extract the timestamp from selectedRequestTime
      let cancelled = false; // A flag to check if any reservations were cancelled
    
      for (const lab in this.reservations) {
        for (const date in this.reservations[lab]) {
          for (const seat in this.reservations[lab][date]) {
            for (const timeSlot in this.reservations[lab][date][seat]) {
              if (this.reservations[lab][date][seat][timeSlot].requestTime === selectedTimestamp) {
                delete this.reservations[lab][date][seat][timeSlot];
                cancelled = true;
              }
            }
            // Clean up the seat object if it has no timeslots
            if (Object.keys(this.reservations[lab][date][seat]).length === 0) {
              delete this.reservations[lab][date][seat];
            }
          }
          // Clean up the date object if it has no seats
          if (Object.keys(this.reservations[lab][date]).length === 0) {
            delete this.reservations[lab][date];
          }
        }
        // Clean up the lab object if it has no dates
        if (Object.keys(this.reservations[lab]).length === 0) {
          delete this.reservations[lab];
        }
      }
    
      if (cancelled) {
        // Update the requestTimesWithOwners array
        this.requestTimesWithOwners = this.requestTimesWithOwners.filter(requestTime => requestTime.split(' (')[0] !== selectedTimestamp);
    
        // Save updated reservations to localStorage
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
    
        alert('All reservations made at the selected request time have been canceled.');
      } else {
        alert('No reservations found with the selected request time.');
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
      return count - 1;
    },
    reservedSlotsForProfile: function (lab, date) {
      let count = 0;
      for (const profile of this.profiles) {
        for (const reservation of profile.reservations) {
          if (reservation.lab === lab && reservation.date === date) {
            count += reservation.timeSlot.length - 1;
          }
        }
      }
      return count;
    },
    logOut: function () {
      localStorage.removeItem('reservations');
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    },
    ranFunc: function(){
      return;
    }
  },
  created: async function () {
    // Retrieve reservations from localStorage
    try {
      const response = await fetch('http://localhost:3000/profiles'); // Update the URL to the correct backend server URL
      if (response.ok) {
        const data = await response.json();
        this.profiles = data; // Update the profiles array with the received data
        console.log(this.profiles)

      } else {
        console.error('Failed to fetch profiles from the server.');
      }
    } catch (error) {
      console.error('Error while fetching profiles:', error);
    }
    this.saveReservedSlots()
    this.convertToOrigFormat();
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
    
    console.log(savedReservations)
    console.log(JSON.stringify(this.dbReservedSlots))
    console.log(this.actualReservationOwners)
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
    
    // Create the array of formatted request times with owners for the dropdown
    for (const lab in this.reservations) {
      for (const date in this.reservations[lab]) {
        for (const seat in this.reservations[lab][date]) {
          for (const timeSlot in this.reservations[lab][date][seat]) {
            const requestTime = this.reservations[lab][date][seat][timeSlot].requestTime;
            const reservationOwner = this.reservations[lab][date][seat][timeSlot].owner;
            this.requestTimesWithOwners.push(`${requestTime} (${reservationOwner})`);
          }
        }
      }
    }
  },
  watch: {
    searchQuery: function (newVal) {
      this.holdProfile = [];
      this.holdURL = [];
      this.holdDate = [];

      if (!newVal || newVal.trim() === '') {
        this.myClass = 'invalid';
      } else {
        for (let i = 0; i < this.profiles.length; i++) { // Fixed the loop to iterate only over existing profiles
          if (this.profiles[i]?.username.includes(newVal) && !this.dates[i].includes(newVal)) {
            this.myClass = 'valid';
            this.holdProfile.push(this.profiles[i].username);
            this.holdURL.push(this.profilePage + '?user=' + this.profiles[i].username);
            this.isDate = false;
          } else if (this.dates[i].includes(newVal) && !this.profiles[i]?.username.includes(newVal)) {
            this.myClass = 'valid';
            this.holdDate.push(
              this.dates[i] +
                '   Lab 1: ' +
                (this.availableSeats(1)*this.availableTimeSlots(1, this.profiles[i].username) - this.reservedSlotsForProfile("Lab 1", this.dates[i])) +
                '   Lab 2: ' +
                (this.availableSeats(2)*this.availableTimeSlots(2, this.profiles[i].username) - this.reservedSlotsForProfile("Lab 2", this.dates[i])) +
                '   Lab 3: ' +
                (this.availableSeats(3)*this.availableTimeSlots(3, this.profiles[i].username) - this.reservedSlotsForProfile("Lab 3", this.dates[i]))
            );
            this.holdURL.push('reserve.html?date=' + this.dates[i]);
            this.isDate = true;
          } else {
            this.myClass = 'invalid';
          }
        }
      }
    }
  }
});
