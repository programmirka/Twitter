import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

class Trend{
    constructor(tag_id, tag_name, tag_created){
        this.tag_id=tag_id;
        this.tag_name=tag_name;
        this.tag_created=tag_created;
        
    }
};

export default {
  Trend,
  getTrends() {
    return apiClient.get('/trends')
  },
  }