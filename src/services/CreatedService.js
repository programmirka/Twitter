import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function getMonthName(monthNumber) {
  switch (monthNumber) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      throw new Error("Invalid month number");
  }
}

//month + year e.g. January 1999
function date(created) {
  let parts = created.split("T");
  let date = parts[0];
  let time = parts[1];
  let dateParts = date.split("-");
  let year = parseInt(dateParts[0]);
  let month = parseInt(dateParts[1]);
  if (month > 0 || month <= 12) {
    month--;
  }
  month = getMonthName(month);
  return month + " " + year;
}

//11 minutes, 3 days (ago) and similar...
function timeAgo(created) {
  if (created === undefined) {
    return;
  }

  let parts = created.split("T");
  let date = parts[0];
  let time = parts[1];
  let dateParts = date.split("-");
  let year = parseInt(dateParts[0]);
  let month = parseInt(dateParts[1]);
  if (month > 0 || month <= 12) {
    month--;
  }
  let day = parseInt(dateParts[2]);
  let justTime = time.split(".");
  let timeParts = justTime[0].split(":");
  let hour = parseInt(timeParts[0]) + 2; //it shows server time by default which is 2 hours less
  let minute = parseInt(timeParts[1]);
  let second = parseInt(timeParts[2]);
  let now = new Date();
  var past = new Date(year, month, day, hour, minute, second);

  var razlika = now.getTime() - past.getTime();
  var milisekunde = razlika % 1000;
  var ukupneSekunde = Math.floor(razlika / 1000);
  var sekundi = ukupneSekunde % 60;
  var ukupneMinute = Math.floor(ukupneSekunde / 60);
  var minuta = ukupneMinute % 60;
  var ukupniSati = Math.floor(ukupneMinute / 60);
  var sati = ukupniSati % 24;
  var ukupniDani = Math.floor(ukupniSati / 24);
  if (ukupniDani < 1 && sati < 1 && minuta < 1) {
    if (sekundi < 10) {
      sekundi = "0" + sekundi;
    }
    if (sekundi === 1) {
      return sekundi + " second ago";
    }
    return sekundi + " seconds ago";
  }
  if (ukupniDani < 1 && sati < 1 && minuta >= 1) {
    if (minuta < 10) {
      minuta = "0" + minuta;
    }
    if (minuta === 1) {
      return minuta + " minute ago";
    }
    return minuta + " minutes ago";
  }
  if (ukupniDani < 1 && sati >= 1) {
    if (ukupniSati < 10) {
      ukupniSati = "0" + ukupniSati;
    }
    if (ukupniSati === 1) {
      return ukupniSati + " hour ago";
    }
    return ukupniSati + " hours ago";
  }
  if (ukupniDani >= 1) {
    if (ukupniDani < 10) {
      ukupniDani = "0" + ukupniDani;
    }
    if (ukupniDani === 1) {
      return ukupniDani + " day ago";
    }
    return ukupniDani + " days ago";
  }
}

function month(dateString) {
  const date = new Date(dateString);
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  return parseInt(month);
}
function year(dateString) {
  const date = new Date(dateString);
  var year = date.getFullYear();
  return year;
}
function day(dateString) {
  const date = new Date(dateString);
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  return parseInt(day);
}

export default {
  timeAgo,
  date,
  month,
  day,
  year,
};
