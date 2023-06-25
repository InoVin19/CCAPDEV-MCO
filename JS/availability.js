new Vue({
  el: '.app',
  data: {
    searchQuery: '',
    holdProfile: [],
    holdURL: [],
    isOpen: false,
    myClass: 'invalid',
    loggedInUser: '',
    labs: ['Lab 1', 'Lab 2', 'Lab 3'],
    selectedDate: '',
    seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
    timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
    reservations: {},
    profilePage: 'profile.html',
    profiles:[
      {
        username: 'admin'
      },
      {
        username: 'student1'
      },
      {
        username: 'student2'
      },
      {
        username: 'student3'
      },
      {
        username: 'student4'
      },
      {
        username: 'student5'
      }
    ],
    dates: [],
  },
  methods: {
    toggleDropdown:function(){
      this.isOpen = !this.isOpen;
    },
    isReserved: function (lab, seat) {
      for (let timeSlot of this.timeSlots) {
        if (this.reservations[lab]?.[this.selectedDate]?.[seat]?.[timeSlot]) {
          return true;
        }
      }
      return false;
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
    reserveLab: function(lab) {
      window.location.href = 'reserve.html?lab=' + encodeURIComponent(lab) + '&date=' + encodeURIComponent(this.selectedDate);
    }   
  },
  created: function () {
    this.loggedInUser = localStorage.getItem('loggedInUser')
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      this.reservations = JSON.parse(savedReservations);
    }
    
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let newDate = new Date();
      newDate.setDate(today.getDate() + i);
      this.dates.push(newDate.toISOString().split('T')[0]);
    }

    if (this.dates.length > 0) {
      this.selectedDate = this.dates[0];
    }
  },
  watch: {
    searchQuery: function(newVal) {
      this.holdProfile = [];
      this.holdURL = [];
      if (!newVal || newVal.trim() === '') {
        this.myClass = 'invalid';
      } else {
        for (let i = 0; i < this.profiles.length; i++) {
          if (this.profiles[i].username.includes(newVal)) {
            this.myClass = 'valid';
            this.holdProfile.push(this.profiles[i].username);
            this.holdURL.push(this.profilePage + '?user=' + this.profiles[i].username);
          } else {
            this.myClass = 'invalid';
          }
        }
      }
    }
  }
});
