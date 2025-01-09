import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { upperFirst } from "lodash";
import { camelCase } from "lodash";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import mitt from "mitt";
import Icons from "@/services/Icons.js";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

axios.defaults.withCredentials = true;
/*If a user is authenticated, their credentials are typically stored in
 cookies. With withCredentials set to true, those cookies will be sent 
 with every request to the API, keeping the user authenticated during 
 each interaction with the server. */

const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

//creating Base components global
const requireComponent = import.meta.globEager(
  "./components/Base/Base[A-Z]*.(vue|js)"
);

Object.keys(requireComponent).forEach((fileName) => {
  const componentConfig = requireComponent[fileName];

  // Get the component name from the file name
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/components\/Base\/(.*)\.\w+$/, "$1"))
  );

  // Register the component globally
  app.component(componentName, componentConfig.default || componentConfig);
});

app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("VueDatePicker", VueDatePicker);

app.mount("#app");
