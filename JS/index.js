new Vue({
    el: '#app',
    data: {
      searchQuery: '',
      holdProfile: [],
      holdURL: [],
      holdDate:[],
      isDate:false,
      isOpen: false,
      myClass: 'invalid',
      loggedInUser: '',
      labs: ['Lab 1', 'Lab 2', 'Lab 3'],
      selectedDate: '',
      seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
      timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
      reservations: {},
      user: null,
      profilePage: 'viewprofile.html',
      profiles: [
        {
          username: 'admin',
          picture: 'path_to_admin_picture.jpg'
        },
        {
          username: 'student1',
          picture: 'path_to_student1_picture.jpg'
        },
        {
          username: 'student2',
          picture: 'path_to_student2_picture.jpg'
        },
        {
          username: 'student3',
          picture: 'path_to_student3_picture.jpg'
        },
        {
          username: 'student4',
          picture: 'path_to_student4_picture.jpg'
        },
        {
          username: 'student5',
          picture: 'path_to_student5_picture.jpg'
        },
        {
          username: 'student6',
          picture: 'path_to_student6_picture.jpg'
        }
      ],
      dates: [],
    },
    methods: {
      toggleDropdown:function(){
        this.isOpen = !this.isOpen;
      },
      viewProfile: function(){
        for(let i = 0 ; i < this.holdProfile.length; i++){
          const profileURL = this.profilePage + '?' + holdProfile[i];
          window.location.href = profileURL;
        }
        
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
      logOut: function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
      }
    },
    created: function() {
      var loggedInUser = localStorage.getItem('loggedInUser');
      this.user = this.profiles.find(profile => profile.username === loggedInUser);
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
    watch:{
      searchQuery: function(newVal) {
        this.holdProfile = [];
        this.holdURL = [];
        this.holdDate = [];
        if (!newVal || newVal.trim() === '') {
          this.myClass = 'invalid';
        } else {
          for (let i = 0; i <= (this.profiles.length + this.dates.length); i++) {
            if (this.profiles[i].username.includes(newVal) && !this.dates[i].includes(newVal) ) {
              this.myClass = 'valid';
              this.holdProfile.push(this.profiles[i].username);
              this.holdURL.push(this.profilePage + '?user=' + this.profiles[i].username);
              this.isDate = false
            } 
            else if(this.dates[i].includes(newVal) && !this.profiles[i].username.includes(newVal)){
              this.myClass = 'valid';
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