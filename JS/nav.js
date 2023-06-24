new Vue({
    el: '#navBar',
    data:{
        isOpen: false
    },
    methods:{
        toggleDropdown: function(){
            this.isOpen = !this.isOpen
        }
    }
})