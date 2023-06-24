new Vue({
    el: '#app',
    data: {
      username: '',
      password: '',
      loginError: ''
    },
    methods: {
      submitForm: function() {
        var accounts = {
          admin: 'adminPass',
          student1: 'student1Pass',
          student2: 'student2Pass',
          student3: 'student3Pass',
          student4: 'student4Pass',
          student5: 'student5Pass'
        };

        if (accounts[this.username] && this.password === accounts[this.username]) {
          alert('Login successful!');
          localStorage.setItem('loggedInUser', this.username);
          window.location.href = 'index.html';
        } else {
          this.loginError = 'Invalid username or password';
        }
      }
    }
  });