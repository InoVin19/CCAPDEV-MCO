new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    holdProfile: [],
    holdURL: [],
    isOpen: false,
    myClass: 'invalid',
    user: null,
    editedDescription: '',
    editingDescription: false,
    profilePage: 'profile.html',
    profiles: [
      {
        username: 'admin',
        picture: 'path_to_admin_picture.jpg',
        description: 'I am the admin.',
      },
      {
        username: 'student1',
        picture: 'path_to_student1_picture.jpg',
        description: 'I am student 1.',
        reservations: [
          { id: 1, lab: 'Lab 1', date: '2023-06-24', time: '10:00 AM - 11:00 AM', requestTime: '6/24/2023, 10:07:15 AM' },
          { id: 2, lab: 'Lab 2', date: '2023-06-25', time: '2:00 PM - 3:00 PM', requestTime: '6/25/2023, 4:07:15 PM' }
        ]
      },
      {
        username: 'student2',
        picture: 'path_to_student2_picture.jpg',
        description: 'I am student 2.',
        reservations: [
          { id: 3, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM', requestTime: '6/24/2023, 3:07:15 PM' },
          { id: 4, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM', requestTime: '6/26/2023, 9:07:15 AM' }
        ]
      },
      {
        username: 'student3',
        picture: 'path_to_student3_picture.jpg',
        description: 'I am student 3.',
        reservations: [
          { id: 5, lab: 'Lab 2', date: '2023-06-25', time: '10:00 AM - 11:00 AM', requestTime: '6/25/2023, 10:07:15 AM' },
          { id: 6, lab: 'Lab 3', date: '2023-06-26', time: '11:00 AM - 12:00 PM', requestTime: '6/26/2023, 11:07:15 AM' }
        ]
      },
      {
        username: 'student4',
        picture: 'path_to_student4_picture.jpg',
        description: 'I am student 4.',
        reservations: [
          { id: 7, lab: 'Lab 1', date: '2023-06-24', time: '1:00 PM - 2:00 PM', requestTime: '6/24/2023, 1:07:15 PM' },
          { id: 8, lab: 'Lab 2', date: '2023-06-25', time: '4:00 PM - 5:00 PM', requestTime: '6/25/2023, 4:07:15 PM' }
        ]
      },
      {
        username: 'student5',
        picture: 'path_to_student5_picture.jpg',
        description: 'I am student 5.',
        reservations: [
          { id: 9, lab: 'Lab 3', date: '2023-06-26', time: '2:00 PM - 3:00 PM', requestTime: '6/26/2023, 2:07:15 PM' },
          { id: 10, lab: 'Lab 1', date: '2023-06-24', time: '11:00 AM - 12:00 PM', requestTime: '6/24/2023, 11:07:15 AM' }
        ]
      }
    ]
  },
  created: function() {
    var loggedInUser = localStorage.getItem('loggedInUser');
    this.user = this.profiles.find(profile => profile.username === loggedInUser);
  },
  methods: {
    toggleDropdown:function(){
      this.isOpen = !this.isOpen;
    },
    logOut: function() {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    },
    toggleEdit: function() {
      this.editingDescription = !this.editingDescription;
      this.editedDescription = this.user.description;
    },
    saveProfile: function() {
      // Perform any necessary API calls or database updates to save the user's updated description
      this.user.description = this.editedDescription;
      alert('Profile updated successfully!');
      this.toggleEdit();
    },
    changeProfilePicture: function() {
      const file = this.$refs.profilePictureInput.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.user.picture = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    editReservation: function(reservationId) {
      // Redirect to the reservation edit page with the reservationId
      window.location.href = 'reserve.html?reservationId=' + reservationId;
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
