        LA RESERVA is a simple web application of a computer Laboratory Reservation System that's meant to handle multiple accounts and profiles that is used when reserving seats for three laboratory rooms. Each laboratory ending up with the same layout from C1-C20. This was developed by three students (Audrey, Vinnie, and Anton) for the completion of their CCAPDEV class in their third term, SY 2022-2023. Steps should follow after this message on how to use it locally as well as how-to's when utilizing the web application. 

How to use the COMPUTER LABORATORY RESERVATION SYSTEM locally

1. Make sure link under api-config.js shows "http://localhost:3000"
2. Using Visual Studio Code, Download the extension called Live Server
3. Once finished, go to the node folder before running the npm commands by typing in "CD node"
4. Type in "npm install" to ensure that you installed all dependencies
5. Start the server by typing in "npm start" 
6. Right click "login.html" and you should see the command "Open with Live Server", press that to start the web application
7. Upon opening starting the web application, you can use the registration button or to see the populated database, Use any of these accounts to login: 
        admin: '12345',
        yasmin_datario: '12345',
        vinnie_inocencio: '12345',
        anton_mendoza: '12345',
        charles_leclerc: '12345',
        john_doe: '12345'
7. Once logged in, you will be redirected to index.html or the website dashboard
8. Press the username on the navbar to see profile, see availability, reserve, or login
9. The left side of the navbar includes quick links to the pertinent pages
10. Freely explore the web application

HOW TO RESERVE 
1. Go to reserve from index.html, see availability, searching for date, and directly pressing "Reserve" from the username dropdown in the navigation bar
2. Choose a date and Laboratory
3. OPTIONAL: Anonymous button if you want to stay anonymous as the reservation owner
3.5. Admin needs to choose user they want to make the reservation for
4. Choose your seat and time slots (increments of 30 minutes)
5. Press "Confirm Reservation" 

HOW TO CANCEL RESERVATION PER TIME SLOT
1. Hover over the reserved slot
2. If reservation is yours, a "Cancel" button will appear and pressing that will immediately cancel that reservation for the specific seat and time slot

HOW TO CANCEL RESERVATION (ENTIRE SEAT)
1. Input the reservation date, lab number, and seat number
2. Press "Cancel Entire Seat Reservation"
3. The entire seat's timeslots should be deleted

HOW TO EDIT RESERVATION (Add Seats)
1. Go to your "Profile"
2. Beside your specific reservation, click "Edit", this should automatically fill-up the date, lab number, and seat number
3. To add, you can just press another timeslot and hit "Confirm Reservation"
4. To remove/cancel a timeslot, hover and press "Cancel"

HOW TO VIEW PROFILE OF RESERVATION OWNER 
1. Hover over the reserved slot
2. If reservation is not anonymous, pressing the "View Profile" button will take you to the profile of that user

HOW TO VIEW AVAILABILITY 
1. Go to "View Availability"
2. Select the date you want to view the seats available for
3. Press "Make a Reservation for Lab _" to be directed to the reservation proper with the fields filled in 

EDITING PROFILE
1. You can only edit your own profile
2. Select edit profile
3. Change Profile description
4. Save Changes
5. Changing the photo: "Edit Picture" which prompts you to select a photo and will immediately take effect 

SEARCHING PROFILES AND AVAILABLE SLOTS
1. Utilize search bar on Navigation Bar 
2. Perform your search by inputting the username and click the result to be directed to their public profile 
3. Perform your available slot seach by inputting the date (7 days including the current date) and pressing that will take you to reservation proper with date field filled in 

DELETING PROFILE
1. Go to your "Profile"
2. Press "Delete Account" which should prompt a confirmation message

ADMIN PROFILE
1. Over at the admin's profile, all reservations can be seen
2. The admin can edit or delete reservations easily