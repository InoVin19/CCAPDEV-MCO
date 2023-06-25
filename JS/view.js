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
        description: 'A flexible and tenacious individual with over seven years of student leadership experience dealing with administrative and creative responsibilities through versatility and determination. She received multiple recognition for leadership, academic excellence, research ability, and effective writing. She looks forward to furthering her understanding of the systems and foundations behind a computer for both hardware and software. Currently, she has studied the basic principles of Data Science and Data Visualization through Basic SQL, Python Pandas, and Tableau. She has also built her programming foundations by learning Python and C. Despite being a student, She is also a part-time assistant and social media manager to a Realtor from the United States of America. Yasmin has learned different applications, social media advertisements, and lead generation techniques through continuous training as the Realtors assistant and Cyberbacker. If any of my interests and craft align with yours, feel free to contact me at datario.yasminaudrey@gmail.com as I would love to have an exchange of ideas with another individual.',
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
        description: 'Charles Leclerc is a Monacan motorsports racing driver who currently competes in Formula 1 for the Scuderia Ferrari team. Known for his exceptional talent and speed, Leclerc began his racing career in karting and quickly rose through the ranks. He achieved tremendous success in the karting world, winning multiple championships. In 2017, he won the FIA Formula 2 Championship, showcasing his potential as a top-tier driver. Leclerc made his Formula 1 debut in 2018 and has since secured multiple victories in Grand Prix races. With his remarkable skills, determination, and fearless driving style, Charles Leclerc has established himself as one of the rising stars in the world of motorsports.',
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
        description: 'John Doe is a passionate computer science student at De La Salle University (DLSU). Currently in his 3rd year, he is dedicated to learning and mastering various programming languages and software development techniques. John has a strong interest in algorithms, data structures, and artificial intelligence. He actively participates in coding competitions and hackathons to enhance his problem-solving skills. Apart from academics, John enjoys playing video games, exploring the latest technology trends, and reading tech blogs. With his strong foundation in computer science principles and his passion for innovation, John aspires to contribute to the field by developing cutting-edge software solutions.',
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
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');
    this.user = this.profiles.find(profile => profile.username === username);
    this.loggedInUser = localStorage.getItem('loggedInUser');
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
