import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { upperFirst } from "lodash";
import { camelCase } from "lodash";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faUserSecret,
  faTwitter,
  faComment,
  faThumbsUp,
  faArrowAltCircleLeft,
  faCalendar,
  faMagnifyingGlass,
  faUser,
  faCompass,
  faHome,
  faGear,
  faArrowRightLong,
  faArrowLeftLong,
  faArrowDownLong,
  faChevronDown
);

axios.defaults.withCredentials = true;

const app = createApp(App);

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
