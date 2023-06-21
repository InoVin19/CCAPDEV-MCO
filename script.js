const app =  Vue.createApp({
  data() {
    return {
      email: '',
      password: '',
      firstName:'',
      lastName:'',
      allowedUsers: [
        {email: 'user1@dlsu.edu.ph', password: 'password1'},
        {email: 'user2@dlsu.edu.ph', password: 'password1'},
        {email: 'user3@dlsu.edu.ph', password: 'password1'},
        {email: 'user4@dlsu.edu.ph', password: 'password1'},
        {email: 'admin@dlsu.edu.ph', password: 'password1'}
      ],
      inpAddress: '',
      myClass:'invalid'
    }
  },
  methods: {
    loginUser() {

      const match = this.allowedUsers.find(
        combination => combination.email === this.email && combination.password === this.password
      );

      if (match) {
        window.location.href = 'doginsta.html';
      } else {
        alert('Invalid email or password');
      }
    },
    registerUser(){
      if(this.myClass == 'valid'){
        let user = {
        email: this.inpAddress,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      }

        this.allowedUsers.push(user)
        this.inpAddress = ''
        this.firstName=''
        this.lastName=''
        this.password = ''
      
        window.location.href = 'login.html';
        alert('User successfully registered');
      }
      else{
        alert('User registration denied');
      }
    },
    redirectRegis(){
      window.location.href = 'regis.html';
    }

  },
  watch: {
    inpAddress(newVal) {
      if(!newVal.includes('@dlsu.edu.ph') || newVal.includes('admin')){
        this.myClass = 'invalid';
      }
      else {
        this.myClass = 'valid';
      }
    }
  }

})
app.mount('#app')