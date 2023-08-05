import { BASE_URL } from './api-config.js'

new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    holdProfile: [],
    holdURL: [],
    holdDate:[],
    isDate:false,
    isOpen: false,
    loggedInUser: '',
    labs: ['Lab 1', 'Lab 2', 'Lab 3'],
    selectedDate: '',
    seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
    timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'],
    reservations: [],
    myClass: 'invalid',
    profilePage: 'viewprofile.html',
    user: null,
    editingDescription: false,
    dates: [],
    profiles: [],
    confirmed: null
  },
  created: async function() {
    try {
      const response = await fetch(`${BASE_URL}/profiles`) 
      const getUser = await fetch(`${BASE_URL}/getLoggedUser`)
      const getReservations = await fetch(`${BASE_URL}/reservations`)
      
      if (response.ok) {
        const data = await response.json();
        const log = await getUser.json();
        const reserve  = await getReservations.json()

        this.profiles = data; 
        this.loggedInUser = log[0].username
        this.reservations = reserve;
        this.user = this.profiles.find(profile => profile.username === this.loggedInUser);
        console.log(this.reservations)
      } else {
        console.error('Failed to fetch profiles from the server.');
      }
    } catch (error) {
      console.error('Error while fetching profiles:', error);
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
  methods: {
    toggleDropdown: function() {
      this.isOpen = !this.isOpen;
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
    
    saveProfile: async function() {
      this.editingDescription = !this.editingDescription;
      if(this.editingDescription == false){
        try {
          const editedDescription = document.getElementById('profile-info').innerText;
          const response = await fetch(`${BASE_URL}/saveDescription`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.loggedInUser,
              description: editedDescription // Use the updated description from the UI
            })
          });
      
          const data = await response.json();
          if (response.status === 200) {
            console.log(data.message); // Display a success message or perform any desired action
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error while saving profile:', error);
        }
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
    reservedSlotsForProfile: function (lab, date) {
      let count = 0;
      for (const reservation of this.reservations) {
        if (reservation.lab === lab && reservation.date === date) {
          count += reservation.timeSlot.length - 1;
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
    openPictureDialog: function() {
      const pictureInput = document.getElementById('picture-input');
      pictureInput.click();
    },
    handlePictureChange: function(event) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];
  
      //checks for valid filee (jpg or png)
      if (!file || !allowedTypes.includes(file.type)) {
        const errorMessageElement = document.getElementById('pic-error');

        const errorMessage = 'Invalid file type. Only JPG and PNG files are allowed.';
        errorMessageElement.textContent = errorMessage;
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        this.user.picture = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    formatReservationTime: function(timeArray) {
      return timeArray.join('<br>');
    },
    promptDeleteAccount: function() {
      // Show a prompt to confirm the account deletion
      this.confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      console.log(this.confirmed)
      if (this.confirmed) {
        // Call the deleteAccount method to handle the account deletion
        this.deleteAccount();
      }
    },

    deleteAccount: async function() {
      // Show a prompt to confirm the account deletion

      if (this.confirmed) {
        try {
          const response = await fetch(`${BASE_URL}/deleteUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.loggedInUser
            })
          });

          if (response.ok) {
            // Account deleted successfully, redirect to the login page
            window.location.href = 'login.html';
          } else {
            // Handle the error response appropriately (e.g., display an error message)
            const data = await response.json();
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error while deleting account:', error);
        }
      }
    },
  },
  watch: {
    searchQuery: function (newVal) {
      this.holdProfile = [];
      this.holdURL = [];
      this.holdDate = [];
  
      if (!newVal || newVal.trim() === '') {
        this.myClass = 'invalid';
      } else {
        for (let i = 0; i < this.profiles.length; i++) {
          const profileUsername = this.profiles[i]?.username; // Check for undefined profile username
          const profileDate = this.dates[i];
  
          if (profileUsername && profileUsername.includes(newVal) && (!profileDate || !profileDate.includes(newVal))) {
            this.myClass = 'valid';
            this.holdProfile.push(profileUsername);
            this.holdURL.push(this.profilePage + '?user=' + profileUsername);
            this.isDate = false;
          } else if (profileDate && profileDate.includes(newVal) && (!this.reservations[i]?.username || !this.reservations[i]?.username.includes(newVal))) {
            this.myClass = 'valid';
            this.holdDate.push(
              profileDate +
              '   Lab 1: ' +
              (this.availableSeats(1) * this.availableTimeSlots(1, profileUsername) - this.reservedSlotsForProfile("Lab 1", profileDate)) +
              '   Lab 2: ' +
              (this.availableSeats(2) * this.availableTimeSlots(2, profileUsername) - this.reservedSlotsForProfile("Lab 2", profileDate)) +
              '   Lab 3: ' +
              (this.availableSeats(3) * this.availableTimeSlots(3, profileUsername) - this.reservedSlotsForProfile("Lab 3", profileDate))
            );
            this.holdURL.push('reserve.html?date=' + profileDate);
            this.isDate = true;
          } else {
            this.myClass = 'invalid';
          }
        }
      }
    }
  }
});