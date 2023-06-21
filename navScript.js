const app = Vue.createApp({
    data() {
        return {
            searchQuery: '',
            userOptions: [
                { title: 'View Profile', link: '#' },
                { title: 'Reserve', link: '#' },
                { title: 'View Reservation', link: '#' },
                { title: 'Logout', link: '#' }
            ]
        }
    }
})

app.component('dropdown', {
    template: `
    <div class="profile-button" @click="isOpen = !isOpen">
        <a href="#">
            {{ title }}
        </a>
        <transition name="fade" appear>
            <div class="sub-profile" v-if="isOpen">
                <div v-for="(item, i) in items" :key="i" class="dropdown">
                    <a :href="item.link">{{ item.title }}</a>
                </div>
            </div>
        </transition>
    </div>`,
    props: ['title', 'items'],
    data() {
        return {
            isOpen: false
        }
    }
})
app.mount('#app');


