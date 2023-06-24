new Vue({
    el: '#availability-app',
    data: {
      labs: ['Lab 1', 'Lab 2', 'Lab 3'], // Your lab names
      selectedDate: '', // Selected date
      seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'], // Your seat names
      timeSlots: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'], // Your time slots
      reservations: {} // Your reservations
    },
    methods: {
      availableSeats: function(lab) {
        let count = 0;
        
        if (
          this.reservations[lab] &&
          this.reservations[lab][this.selectedDate]
        ) {
          for (let i = 0; i < this.seats.length; i++) {
            for (let j = 0; j < this.timeSlots.length; j++) {
              if (!this.reservations[lab][this.selectedDate][this.seats[i]] ||
                  !this.reservations[lab][this.selectedDate][this.seats[i]][this.timeSlots[j]]
              ) {
                count++;
              }
            }
          }
        } else {
          count = this.seats.length * this.timeSlots.length;
        }
  
        return count;
      },
      updateAvailability: function() {
        // Perform any additional logic here if needed
        // For example, you could load the reservations data for the selected date from the server
        
        // Reset the reservations object since we don't have data for the selected date
        this.reservations = {};
  
        // Update the available seats count based on the selected date
        // The Vue reactive system will automatically update the DOM
      }
    },
    created: function() {
      // Retrieve reservations from localStorage
      const savedReservations = localStorage.getItem('reservations');
      if (savedReservations) {
        this.reservations = JSON.parse(savedReservations);
      }
    }
  });
  