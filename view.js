new Vue({
    el: '#app',
    data: {
        isOpen: false,
        user: null,
        profiles: [
            {
                username: 'admin',
                picture: 'path_to_admin_picture.jpg',
                description: 'I am the admin.',
                reservations: []
            },
            {
                username: 'student1',
                picture: 'path_to_student1_picture.jpg',
                description: 'I am student 1.',
                reservations: [
                    { id: 1, lab: 'Lab 1', date: '2023-06-24', time: '10:00 AM - 11:00 AM' },
                    { id: 2, lab: 'Lab 2', date: '2023-06-25', time: '2:00 PM - 3:00 PM' }
                ]
            },
            {
                username: 'student2',
                picture: 'path_to_student2_picture.jpg',
                description: 'I am student 2.',
                reservations: [
                    { id: 3, lab: 'Lab 1', date: '2023-06-24', time: '3:00 PM - 4:00 PM' },
                    { id: 4, lab: 'Lab 3', date: '2023-06-26', time: '9:00 AM - 10:00 AM' }
                ]
            },
            {
                username: 'student3',
                picture: 'path_to_student3_picture.jpg',
                description: 'I am student 3.',
                reservations: [
                    { id: 5, lab: 'Lab 2', date: '2023-06-25', time: '10:00 AM - 11:00 AM' },
                    { id: 6, lab: 'Lab 3', date: '2023-06-26', time: '11:00 AM - 12:00 PM' }
                ]
            },
            {
                username: 'student4',
                picture: 'path_to_student4_picture.jpg',
                description: 'I am student 4.',
                reservations: [
                    { id: 7, lab: 'Lab 1', date: '2023-06-24', time: '1:00 PM - 2:00 PM' },
                    { id: 8, lab: 'Lab 2', date: '2023-06-25', time: '4:00 PM - 5:00 PM' }
                ]
            },
            {
                username: 'student5',
                picture: 'path_to_student5_picture.jpg',
                description: 'I am student 5.',
                reservations: [
                    { id: 9, lab: 'Lab 3', date: '2023-06-26', time: '2:00 PM - 3:00 PM' },
                    { id: 10, lab: 'Lab 1', date: '2023-06-24', time: '11:00 AM - 12:00 PM' }
                ]
            }
        ]
    },
    created: function() {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('user');
        this.user = this.profiles.find(profile => profile.username === username);
    },
    methods: {
        toggleDropdown:function(){
            this.isOpen = !this.isOpen;
        },
        goBack: function() {
            window.history.back();
        }
    },
});