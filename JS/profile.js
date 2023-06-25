new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    holdProfile: [],
    holdURL: [],
    isOpen: false,
    myClass: 'invalid',
    user: null,
    editingDescription: false,
    profiles: [
      {
        username: 'admin',
        picture: 'path_to_admin_picture.jpg',
        description: 'I am the admin.',
        socialMedia: {
          facebook: 'https://www.facebook.com/admin',
          twitter: 'https://www.twitter.com/admin',
          instagram: 'https://www.instagram.com/admin'
        },
        reservations: []
      },
      {
        username: 'yasmin_datario',
        picture: 'Pictures/yasmin.png',
        description: 'I am student 1.',
        socialMedia: {
          facebook: 'https://www.facebook.com/ysmndry',
          twitter: 'https://www.twitter.com/itsyasminaudrey',
          instagram: 'https://www.instagram.com/itsyasminaudrey'
        },
        reservations: [
          { id: 1, lab: 'Lab 1', date: '2023-06-24', seat: 'C2', time: ['4:00 pm - 4:30 pm', '4:30 pm - 5:00 pm'], requestTime: '6/24/2023, 10:07:15 AM' },
          { id: 2, lab: 'Lab 2', date: '2023-06-25', seat: 'C19', time: ['2:30 pm - 3:00 pm', '3:00 pm - 3:30 pm'], requestTime: '6/25/2023, 4:07:15 PM' }
        ]
      },
      {
        username: 'vinnie_inocencio',
        picture: 'Pictures/vinnie.jpg',
        description: 'I am student 2.',
        socialMedia: {
          facebook: 'https://www.facebook.com/student2',
          twitter: 'https://www.twitter.com/student2',
          instagram: 'https://www.instagram.com/student2'
        },
        reservations: [
          { id: 3, lab: 'Lab 1', date: '2023-06-24', seat: 'C18', time: ['3:00 pm - 4:00 pm'], requestTime: '6/24/2023, 3:07:15 PM' },
          { id: 4, lab: 'Lab 3', date: '2023-06-26', seat: 'C7', time: ['2:30 pm - 3:00 pm', '3:00 pm - 3:30 pm', '3:30 pm - 4:00 pm'], requestTime: '6/26/2023, 9:07:15 AM' }
        ]
      },
      {
        username: 'anton_mendoza',
        picture: 'Pictures/anton.jpg',
        description: 'I am student 3.',
        socialMedia: {
          facebook: 'https://www.facebook.com/student3',
          twitter: 'https://www.twitter.com/student3',
          instagram: 'https://www.instagram.com/student3'
        },
        reservations: [
          { id: 5, lab: 'Lab 2', date: '2023-06-25', seat: 'C10', time: ['10:00 am - 11:00 am'], requestTime: '6/25/2023, 10:07:15 AM' },
          { id: 6, lab: 'Lab 3', date: '2023-06-26', seat: 'C11', time: ['11:00 am - 12:00 pm'], requestTime: '6/26/2023, 11:07:15 AM' }
        ]
      },
      {
        username: 'charles_leclerc',
        picture: 'Pictures/charles.jpg',
        description: 'I am student 4.',
        socialMedia: {
          facebook: 'https://www.facebook.com/student4',
          twitter: 'https://www.twitter.com/student4',
          instagram: 'https://www.instagram.com/student4'
        },
        reservations: [
          { id: 7, lab: 'Lab 1', date: '2023-06-24', seat: 'C1', time: ['1:00 pm - 2:00 pm'], requestTime: '6/24/2023, 1:07:15 PM' },
          { id: 8, lab: 'Lab 2', date: '2023-06-25', seat: 'C4', time: ['4:00 pm - 5:00 pm'], requestTime: '6/25/2023, 4:07:15 PM' }
        ]
      },
      {
        username: 'john_doe',
        picture: 'Pictures/john.jpg',
        description: 'I am student 5.',
        socialMedia: {
          facebook: 'https://www.facebook.com/student5',
          twitter: 'https://www.twitter.com/student5',
          instagram: 'https://www.instagram.com/student5'
        },
        reservations: [
          { id: 9, lab: 'Lab 3', date: '2023-06-26', seat: 'C2', time: ['2:00 pm - 3:00 pm'], requestTime: '6/26/2023, 2:07:15 PM' },
          { id: 10, lab: 'Lab 1', date: '2023-06-24', seat: 'C11', time: ['11:00 am - 12:00 pm'], requestTime: '6/24/2023, 11:07:15 AM' }
        ]
      }      
    ]
  },
  created: function() {
    var loggedInUser = localStorage.getItem('loggedInUser');
    this.user = this.profiles.find(profile => profile.username === loggedInUser);
  },
  methods: {
    toggleDropdown: function() {
      this.isOpen = !this.isOpen;
    },
    logOut: function() {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    },
    toggleEdit: function() {
      this.editingDescription = !this.editingDescription;
    },
    openPictureDialog: function() {
      const pictureInput = document.getElementById('picture-input');
      pictureInput.click();
    },
    handlePictureChange: function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.user.picture = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    formatReservationTime: function(timeArray) {
      return timeArray.join('<br>');
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
