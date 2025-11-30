import { createRouter, createWebHistory } from 'vue-router';
import InterviewRoom from '../views/InterviewRoom.vue';

const routes = [
    {
        path: '/',
        redirect: '/room/default-room'
    },
    {
        path: '/room/:id',
        name: 'InterviewRoom',
        component: InterviewRoom
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
