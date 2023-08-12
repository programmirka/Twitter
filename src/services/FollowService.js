import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

class Follow{
    constructor(usr_id, usr_name,usr_handle){
        this.usr_id = usr_id;
        this.usr_name = usr_name;
        this.usr_handle = usr_handle;  
    }
};

export default {
  Follow,
  getFollows() {
    return apiClient.get('/follow')
  
  }}