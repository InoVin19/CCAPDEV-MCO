new Vue({
    el: '#app',
    data: {
      searchQuery:'',
      holdProfile:[],
      holdURL:[],
      isOpen: false,
      myClass: 'invalid',
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
      viewProfile: function(){
        for(let i = 0 ; i < this.holdProfile.length; i++){
          const profileURL = this.profilePage + '?' + holdProfile[i];
          window.location.href = profileURL;
        }
        
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