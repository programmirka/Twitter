<script>
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import LocalStorage from "./services/LocalStorage";
export default {
  components: {
    Header,
    SideBar,
  },
  data() {
    return {
      loggedUserNav: false,
    };
  },
  mounted() {
    //kada refreshujemo stranicu zelimo da nam za logovanog user ostane loggedUsser navigacija(home, profile)
    if (LocalStorage.id()) {
      this.loggedUserNav = true;
      this.loggedUserId = LocalStorage.id;
    } else {
      this.loggedUserNav = false;
    }
  },
};
</script>

<template>
  <Header
    @loggedUserNavTrue="loggedUserNav = true"
    @loggedUserNavFalse="loggedUserNav = false"
  ></Header>
  <!-- loggedUserNav ce biti prop u sidebar componenti, pa ce ovde kad se ubaci biti :loggedUserNav = "loggedUserNav"
      Kada importujemo header emitovacemo iz njega app-u emit sa kojom ce se app-ov loggedUserNav boolean menjati
     kad god se neko uspesno uloguje-->
  <SideBar :loggedUserNav="loggedUserNav"></SideBar>
  <main class="mainDiv">
    <RouterView />
  </main>
</template>

<style>
.main-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 200px;
  background-color: #f4f4f4;
  top: 80px;
  bottom: 0;
  padding-top: 20px;
  font-size: large;
}
.logo a,
.main-nav a {
  padding: 10px 10px 10px 40px;
  text-transform: uppercase;
  text-align: left;
  display: block;
}

.main-nav a,
a.routher-link {
  color: #34495e;
  font-size: 0.99em;
}

.main-nav a:hover {
  color: #fff;
  background-color: #6287ad;
}

.mainDiv {
  margin-top: 80px;
  margin-left: 200px;
  padding: 15px;
}

body {
  font-family: "Montserrat", sans-serif;
  line-height: 1.6;
  margin: 0;
  min-height: 100vh;
}
.replyBtn {
  border-radius: 15px;
  height: 40px;
  width: 80px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background-color: #6287ad;
  cursor: pointer;
  border: 1px solid grey;
}
.replyBtn:hover {
  height: 45px;
  width: 85px;
}
.cancelBtn {
  border-radius: 20px;
  height: 50px;
  width: 80px;
  font-size: 18px;
  font-weight: 400;
  color: black;
  background-color: aliceblue;
  cursor: pointer;
  margin-bottom: 7px;
}
.cancelBtn:hover {
  height: 55px;
  width: 85px;
}
.tweetEdit {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.tweetEdit textarea {
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
  box-shadow: 10px 5px 5px grey;
  margin-top: 20px;
  width: 500px;
  height: 150px;
  resize: none;
  margin-right: 20px;
  border-radius: 15px;
  padding: 10px;
}
.adminDeleteBtn {
  border-radius: 15px;
  height: 50px;
  width: 100px;
  font-size: 18px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.641);
  background-color: rgba(128, 128, 128, 0.168);
  cursor: pointer;
  margin-right: 20px;
  border: 0.5px solid grey;
}
.adminDeleteBtn:hover {
  background-color: rgba(128, 128, 128, 0.345);
}
.adminDeleteBtn:active {
  background-color: rgba(128, 128, 128, 0.617);
  color: rgb(255, 255, 255);
}
.mainColor {
  color: #34495e;
}
.pagination {
  display: flex;
  margin: 0px 80px;
  justify-content: space-between;
}
.pagination a {
  text-decoration: none;
  color: #2c3e50;
}

#page-prev {
  padding: 20px;
  font-size: 1.1em;
  font-weight: 700;
}

#page-next {
  padding: 20px;
  font-size: 1.1em;
  font-weight: 700;
}
.modal {
  position: fixed;
  z-index: 3000;
  top: 0px;
  left: 0px;
  min-height: 100vh;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 15px;
}

.close:hover {
  color: black;
  cursor: pointer;
}

/* ================================= 
  Media Queries
==================================== */
</style>
