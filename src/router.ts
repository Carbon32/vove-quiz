import { createWebHistory, createRouter } from "vue-router"
import About from "./pages/About.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"
import Auth from "./pages/Auth.vue"
import Terms from "./pages/Terms.vue"
import Privacy from "./pages/Privacy.vue"
import Profile from "./pages/Profile.vue"
import Actions from "./pages/Actions.vue"
import PasswordRecovery from "./pages/PasswordRecovery.vue"
import Quiz from "./pages/Quiz.vue"
import History from "./pages/History.vue"

const routes = [
    { path: "/", component: Home },
    { path: "/auth", component: Auth },
    { path: "/about", component: About },
    { path: "/:pathMatch(.*)*", component: NotFound },

    { path: "/quiz", component: Quiz },
    { path: "/history", component: History },

    { path: "/profile", component: Profile },
    { path: "/confirm", component: Actions },
    { path: "/verify_email", component: Actions },
    { path: "/confirm_email", component: Actions },
    { path: "/forgot_password", component: PasswordRecovery },
    { path: "/reset_password", component: PasswordRecovery },

    { path: "/terms", component: Terms },
    { path: "/privacy", component: Privacy },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})
