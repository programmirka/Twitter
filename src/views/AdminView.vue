<template>
  <div class="mainAdmin">
    <h1>Admin Panel</h1>

    <Search
      @searchTerms="search"
      :placeholder="searchPlaceholder"
      :noResults="noResults"
      :label="searchLabel"
    ></Search>
  </div>
  <div class="searchResults">
    <table>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Handle</th>
        <th>Email</th>
        <th>Joined</th>
        <th>Blocked</th>
        <th>Admin</th>
      </tr>
      <tr v-for="(user, i) in users" :key="i" :class="{ grey: i % 2 }">
        <td>{{ i + 1 }}.</td>
        <td>{{ user.usr_name }}</td>
        <td>@{{ user.usr_handle }}</td>
        <td>{{ user.usr_email }}</td>
        <td class="center">{{ user.usr_joined }}</td>
        <td class="center" @click="block">
          <label class="switch">
            <input
              :checked="user.usr_blocked === 1"
              @change="switchBlock(user.usr_id)"
              type="checkbox"
              id="mySwitch"
            />
            <span class="slider"></span>
          </label>
        </td>
        <td class="center">
          <label class="switch">
            <input
              :checked="user.usr_admin === 1"
              @change="switchAdmin(user.usr_id)"
              type="checkbox"
              id="mySwitch"
            />
            <span class="slider"></span>
          </label>
        </td>
      </tr>
      <tr class="hidden" v-if="users.length < 3">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr class="hidden" v-if="users.length < 5">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr class="hidden" v-if="users.length < 3">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
  </div>
</template>
<script>
import Search from "@/components/Search.vue";
import SearchService from "@/services/SearchServices.js";
import AdminServices from "@/services/AdminServices.js";
import CreatedService from "../services/CreatedService";

//admin ce u ovom view-u moci da vidi celu listu user-a.
// moci ce da ih pretrazuje na vrhu u search-bar-u. Imace tabelu sa
//ime i prezime, handle, id, block/unblock

//zatim pored toga van ovog view-a ce moci da: block unblock usera-a na ProfileView
//moze da brise tweetove i komentare i moze da druge user-e pretvori u admin-e

export default {
  components: { Search },
  data() {
    return {
      searchLabel:
        "Search for user by name, handle, email or keywords 'blocked' or 'admin':",
      searchPlaceholder:
        "e.g. Jane, @jane, jane@gmail.com, 'blocked' or 'admin'",
      noResults: false,
      users: [],
    };
  },
  methods: {
    search(term) {
      //smisli logiku, dobijas search term preko emit-a
      //ako nema rezultata noResults je true

      AdminServices.searchUsers(term)
        .then((res) => {
          if (res) {
            this.users = AdminServices.getAllUsersSuccess(res);
            console.log("broj user-a", this.users.length);
            if (this.users.length < 3) {
              //
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    loadUsers() {
      AdminServices.getAllUsers()
        .then((res) => {
          this.users = AdminServices.getAllUsersSuccess(res);
          console.log(this.users);
          //
        })
        .catch((err) => {
          console.error(err);
        });
    },
    switchAdmin(id) {
      AdminServices.switchAdmin(id)
        .then((res) => {
          this.loadUsers();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    switchBlock(id) {
      AdminServices.switchBlock(id)
        .then((res) => {
          this.loadUsers();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>
<style scoped>
.mainAdmin {
  position: fixed;
  background-color: #f7fbffce;
  width: 100%;
  z-index: 2;
}
.mainAdmin h1 {
  font-size: 1.5em;
  font-weight: 400;
  color: #34495e;
  padding-left: 25px;
}
.searchResults {
  padding: 220px 0px 10px;
}
.searchResults table {
  width: 100%;
  border: 1px solid rgba(128, 128, 128, 0.231);
  border-collapse: collapse;
}

.searchResults tr:first-of-type {
  background-color: rgb(226, 239, 250);
  width: 100%;
  position: sticky;
  top: 320px;
  z-index: 2;
}
.searchResults td,
.searchResults th {
  padding: 15px 10px 10px;
  border: 1px rgba(128, 128, 128, 0.159) solid;
  width: 16.16%;
  color: #34495e;
}

.searchResults td:first-of-type,
.searchResults th:first-of-type {
  width: 3%;
  text-align: center;
}
.center {
  text-align: center;
}
.grey {
  background-color: rgba(128, 128, 128, 0.131);
}

.red {
  background-color: rgb(255, 208, 196);
}
.green {
  background-color: rgb(196, 232, 196);
}

/* //////////////// */

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  z-index: 1;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  z-index: 1;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  /* Positions the ::before content relative to .slider. */
  content: "";
  /* Essential for the ::before pseudo-element to work. */
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

/* Checked state */

/* This targets the .slider immediately following any checked input. */
input:checked + .slider {
  background-color: #6287ad;
}

/* Targets the ::before pseudo-element of .slider 
immediately following any checked input. */
input:checked + .slider:before {
  transform: translateX(26px);
}
.hidden {
  height: 100px;
  border-color: rgba(255, 255, 255, 0);
}
.hidden td {
  border-color: rgba(255, 255, 255, 0);
}
</style>
