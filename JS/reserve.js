import { BASE_URL } from './api-config.js'

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
    reservations: [],
    dbReservation:{},
    holdReservation:{},
    dropReservations:[],
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
    dbReservedSlots:{},
    response: null,
    requestTimesWithDetails: []
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
      const reservationData = this.dbReservation[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
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
      for (let i = 0; i < this.reservations.length; i++) {
        for (let k = 0; k < this.reservations[i].timeSlot.length; k++) {
          const prof = this.reservations[i];
          if (!this.holdReservation[prof.lab]) {
            this.holdReservation[prof.lab] = {};
          }
          if (!this.holdReservation[prof.lab][prof.date]) {
            this.holdReservation[prof.lab][prof.date] = {};
          }
          if (!this.holdReservation[prof.lab][prof.date][prof.seat]) {
            this.holdReservation[prof.lab][prof.date][prof.seat] = {};
          }
          const reservationKey = `${prof.lab},${prof.date},${prof.seat},${prof.timeSlot[k]}`;
          const reservationData = {
            owner: this.reservations[i].username,
            requestTime: prof.requestTime, // Set the request time for the reservation
            anonymity: prof.anonymous
          };
          this.$set(this.dbReservedSlots, reservationKey ,this.holdReservation[prof.lab][prof.date][prof.seat][prof.timeSlot[k]] = reservationData);
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
      this.dbReservation = {}
    },
    confirmReservation: async function () {
      try {
        if (this.selectedLab && this.selectedDate && (this.loggedInUser || this.selectedUser)) {
          const requestTime = new Date().toLocaleString(); // Get the current request time
          const reservationOwner = this.loggedInUser === 'admin' ? this.selectedUser : this.loggedInUser;
    
          for (let i = 0; i < this.selectedSeats.length; i++) {
            const [seat, timeSlot] = this.selectedSeats[i].split('_');

            this.response = await fetch(`${BASE_URL}/saveReservation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: reservationOwner,
                lab: this.selectedLab,
                date: this.selectedDate,
                seat: seat,
                timeSlot: timeSlot,
                requestTime: requestTime,
                anonymous: this.anonymousReservation
              })
            });
          }
    
          const data = await this.response.json();
    
          if (this.response.status === 201) {
            this.selectedSeats = [];
            alert(data.message);
          } else {
            this.error = data.error;
          }
          window.location.href = 'reserve.html';
        }
      } catch (error) {
        alert('Please select a lab, date, and user (for admin) before confirming the reservation.');
      }
    },    
    resetReservations: async function () {
      try {
        let usernameToDelete;
        if (this.loggedInUser === 'admin') {
          usernameToDelete = this.selectedUser;
        } else {
          usernameToDelete = this.loggedInUser;
        }
    
        const response = await fetch(`${BASE_URL}/resetReservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: usernameToDelete,
            lab: this.selectedLab,
            date: this.selectedDate,
            seat: this.selectedSeat
          })
        });
    
        const data = await response.json();
    
        if (response.status === 200) {
          alert(data.message);
        } else {
          this.error = data.error;
        }
      } catch (error) {
        console.error(error);
        alert('Reservation reset not successful');
      }
    },
    
    
    canCancelReservation: function (seat, timeSlot) {
      const reservationData = this.dbReservation[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
      const reservationOwner = reservationData && reservationData.owner
      return 'admin' === this.loggedInUser  || reservationOwner === this.loggedInUser;
    },
    cancelReservation: async function (seat, timeSlot) {
      if (this.canCancelReservation(seat, timeSlot)) {
        try {
          let usernameToDelete;
          if (this.loggedInUser === 'admin') {
            usernameToDelete = this.selectedUser;
          } else {
            usernameToDelete = this.loggedInUser;
          }
      
          const response = await fetch(`${BASE_URL}/deleteTimeSlot`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: usernameToDelete,
              lab: this.selectedLab,
              date: this.selectedDate,
              seat: seat,
              timeSlot: timeSlot
            })
          });
      
          const data = await response.json();
      
          if (response.status === 200) {
            alert(data.message);
          } else {
            this.error = data.error;
          }
        } catch (error) {
          console.error(error);
          alert('Reservation reset not successful');
        }
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
    
      for (const lab in this.dbReservation) {
        for (const date in this.dbReservation[lab]) {
          for (const seat in this.dbReservation[lab][date]) {
            for (const timeSlot in this.dbReservation[lab][date][seat]) {
              if (this.dbReservation[lab][date][seat][timeSlot].requestTime === selectedTimestamp) {
                delete this.dbReservation[lab][date][seat][timeSlot];
                cancelled = true;
              }
            }
            // Clean up the seat object if it has no timeslots
            if (Object.keys(this.dbReservation[lab][date][seat]).length === 0) {
              delete this.dbReservation[lab][date][seat];
            }
          }
          // Clean up the date object if it has no seats
          if (Object.keys(this.dbReservation[lab][date]).length === 0) {
            delete this.dbReservation[lab][date];
          }
        }
        // Clean up the lab object if it has no dates
        if (Object.keys(this.dbReservation[lab]).length === 0) {
          delete this.dbReservation[lab];
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
      const reservationData = this.dbReservation[this.selectedLab]?.[this.selectedDate]?.[seat]?.[timeSlot];
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
      for (const reservation of this.reservations) {
        if (reservation.lab === lab && reservation.date === date) {
          count += reservation.timeSlot.length - 1;
        }
      }
      return count;
    },
    logOut: async function() {
      try {
        await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.loggedInUser
          })
        })
    
        window.location.href = 'login.html';
      } catch (error) {
        console.error(error);
      }
    },
    ranFunc: function(){
      return;
    }
  },
  created: async function () {
    // Retrieve reservations from localStorage
    try {
      const responseReservations = await fetch(`${BASE_URL}/reservations`);
      const responseProfiles = await fetch(`${BASE_URL}/profiles`);
      const responseLoggedUser = await fetch(`${BASE_URL}/getLoggedUser`);

      if (!responseReservations.ok || !responseProfiles.ok || !responseLoggedUser.ok) {
        console.error('Failed to fetch data from the server.');
        return;
      }

        const dataReservations = await responseReservations.json();
        const dataProfiles = await responseProfiles.json();
        const dataLoggedUser = await responseLoggedUser.json();

        this.reservations = dataReservations;
        this.loggedInUser = dataLoggedUser[0].username;
        this.profiles = dataProfiles;
        console.log(this.reservations[0].timeSlot.length)

        this.saveReservedSlots();
        this.convertToOrigFormat();

    } catch (error) {
      console.error('Error while fetching profiles:', error);
    }
    
    // Retrieve the actual reservation owners from localStorage
    const savedActualReservationOwners = localStorage.getItem('actualReservationOwners');
    if (savedActualReservationOwners) {
      this.actualReservationOwners = JSON.parse(savedActualReservationOwners);
    }
    // Save actual reservation owners to localStorage
    localStorage.setItem('actualReservationOwners', JSON.stringify(this.actualReservationOwners));
    
    this.dbReservation = JSON.parse(this.dbReservedSlots)
    console.log(this.dbReservedSlots)
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
    for (const lab in this.dbReservation) {
      for (const date in this.dbReservation[lab]) {
        for (const seat in this.dbReservation[lab][date]) {
          for (const timeSlot in this.dbReservation[lab][date][seat]) {
            const requestTime = this.dbReservation[lab][date][seat][timeSlot].requestTime;
            const reservationOwner = this.dbReservation[lab][date][seat][timeSlot].owner;
            const reservationDetails = `${requestTime} (${reservationOwner}) - ${lab}, Date: ${date}, Seat: ${seat}`;

            this.requestTimesWithOwners.push(`${requestTime} (${reservationOwner})`);
            this.requestTimesWithDetails.push(reservationDetails); // Add the details to the array
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
          } else if (this.dates[i].includes(newVal) && !this.reservations[i]?.username.includes(newVal)) {
            this.myClass = 'valid';
            this.holdDate.push(
              this.dates[i] +
                '   Lab 1: ' +
                (this.availableSeats(1)*this.availableTimeSlots(1, this.reservations[i].username) - this.reservedSlotsForProfile("Lab 1", this.dates[i])) +
                '   Lab 2: ' +
                (this.availableSeats(2)*this.availableTimeSlots(2, this.reservations[i].username) - this.reservedSlotsForProfile("Lab 2", this.dates[i])) +
                '   Lab 3: ' +
                (this.availableSeats(3)*this.availableTimeSlots(3, this.reservations[i].username) - this.reservedSlotsForProfile("Lab 3", this.dates[i]))
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