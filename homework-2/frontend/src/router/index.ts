import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import InterviewRoom from '../views/InterviewRoom.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/room/:id',
        name: 'Room',
        component: InterviewRoom,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
