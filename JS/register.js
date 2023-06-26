new Vue({
    el: '#app',
    data: {
      email: '',
      password: '',
      error: ''
    },
    methods: {
      submitForm: function() {
        var domain = '@dlsu.edu.ph';
        if (this.email.substr(-domain.length) !== domain) {
          this.error = 'Email must end with ' + domain;
          return;
        }

        // Simulate successful registration
        this.error = '';
        alert('Registration successful! You may now log in.');
        this.email = '';
        this.password = '';

        // Redirect to index.html
        window.location.href = 'login.html';
      }
    }
  });