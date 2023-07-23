// register.js

new Vue({
  el: '#app',
  data: {
    email: '',
    password: '',
    error: '',
    username:'',
  },
  methods: {
    submitForm: async function() {
      var domain = '@dlsu.edu.ph';
      if (this.email.substr(-domain.length) !== domain) {
        this.error = 'Email must end with ' + domain;
        return;
      }

      try {
        // Make a POST request to the server for registration
        const username = this.email.substring(0, this.email.indexOf('@'));
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            username: username,
          })
        });

        const data = await response.json();

        if (response.status === 201) {
          // Registration successful
          this.error = '';
          alert(data.message);
          this.email = '';
          this.password = '';
          this.username= '';
          // Redirect to login.html
          window.location.href = 'login.html';
        } else {
          // Registration failed
          this.error = data.error;
        }
      } catch (error) {
        console.error(error);
        this.error = 'Failed to register. Please try again later.';
      }
    }
  }
});
