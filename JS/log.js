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
          admin: '12345',
          yasmin_datario: '12345',
          vinnie_inocencio: '12345',
          anton_mendoza: '12345',
          charles_leclerc: '12345',
          john_doe: '12345'
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