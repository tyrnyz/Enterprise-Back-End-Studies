import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// 👉 add this line for the global dark theme
import "./assets/global.css";

createApp(App).use(router).mount("#app");
