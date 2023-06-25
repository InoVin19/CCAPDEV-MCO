new Vue({
    el: '#app',
    data: {
        searchQuery:'',
        holdProfile:[],
        holdURL:[],
        isOpen: false,
        myClass: 'invalid',
        user: null,
        loggedInUser:'',
        profilePage: 'viewprofile.html',
        profiles: [
            {
              username: 'admin',
              picture: 'path_to_admin_picture.jpg',
              description: 'I am the admin.',
              reservations: []
            },
            {
              username: 'student1',
              picture: 'path_to_student1_picture.jpg',
              description: 'I am student 1.',
              reservations: [
                { id: 1, lab: 'Lab 1', date: '2023-06-24', time: '10:00 AM - 11:00 AM', requestTime: '6/25/2023, 4:07:15 PM' },
                { id: 2, lab: 'Lab 2', date: '2023-06-25', time: '2:00 PM - 3:00 PM', requestTime: '6/25/2023, 4:10:30 PM' }
              ]
            },
            {
              username: 'student2',
              picture: 'path_to_student2_picture.jpg',
              description: 'I am student 2.',
              reservations: [
                { id: 3, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM', requestTime: '6/25/2023, 4:15:45 PM' },
                { id: 4, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM', requestTime: '6/25/2023, 4:20:00 PM' }
              ]
            },
            {
              username: 'student3',
              picture: 'path_to_student3_picture.jpg',
              description: 'I am student 3.',
              reservations: [
                { id: 5, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM', requestTime: '6/25/2023, 4:15:45 PM' },
                { id: 6, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM', requestTime: '6/25/2023, 4:20:00 PM' }
              ]
            },
            {
              username: 'student4',
              picture: 'path_to_student4_picture.jpg',
              description: 'I am student 4.',
              reservations: [
                { id: 7, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM', requestTime: '6/25/2023, 4:15:45 PM' },
                { id: 8, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM', requestTime: '6/25/2023, 4:20:00 PM' }
              ]
            },
            {
              username: 'student5',
              picture: 'path_to_student5_picture.jpg',
              description: 'I am student 5.',
              reservations: [
                { id: 9, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM', requestTime: '6/25/2023, 4:15:45 PM' },
                { id: 10, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM', requestTime: '6/25/2023, 4:20:00 PM' }
              ]
            },
          ]
        },
    created: function() {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('user');
        this.user = this.profiles.find(profile => profile.username === username);
        this.loggedInUser = localStorage.getItem('loggedInUser');
    },
    methods: {
        toggleDropdown:function(){
            this.isOpen = !this.isOpen;
        },
        goBack: function() {
            window.history.back();
        },
        logOut: function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        }
    },
    watch:{
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
                  this.holdURL.push(this.profilePage+'?user='+this.profiles[i].username)
                } else {
                  this.myClass = 'invalid';
                }
              }
            }
          }
      }
});