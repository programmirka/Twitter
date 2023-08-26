import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { upperFirst } from "lodash";
import { camelCase } from "lodash";
import axios from "axios";

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
/* add icons to the library */
library.add(
  faUserSecret,
  faTwitter,
  faComment,
  faThumbsUp,
  faArrowAltCircleLeft,
  faCalendar,
  faMagnifyingGlass
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

app.mount("#app");
