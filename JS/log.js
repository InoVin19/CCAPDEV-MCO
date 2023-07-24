new Vue({
  el: '#app',
  data: {
    username: '',
    password: '',
    loginError: ''
  },
  methods: {
    submitForm: async function() {
      try {
        // Make a POST request to the server for user authentication
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.status === 200) {
          // Login successful
          this.loginError = '';
          alert('Login successful!');
          localStorage.setItem('loggedInUser', this.username);
          window.location.href = 'index.html';
        } else {
          // Login failed
          this.loginError = data.error;
        }
      } catch (error) {
        console.error(error);
        this.loginError = 'Failed to log in. Please try again later.';
      }
    }
  }
});
