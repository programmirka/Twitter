<template>
    <div class="follow">
        <div class="profile">
            <img src="@/assets/profile.png">
           <p>{{name}} |<br> <span>{{handle}}</span></p>
        </div>
        <div>
            <button class="followBtn">Follow</button>
        </div>
    </div>

</template>
<script>
export default{
    props: {
        name: String,
        handle: String,
        id: Number
    }
}
</script>
<style scoped>
.follow{
    display: flex;
    justify-content: space-between;
    align-items: start;
    width: 80%;
    margin: 20px 5px;
    border-radius: 10px;
    background-color: #6287ad2b;
    padding: 5px 20px;


}
.follow p{
    margin: 0;
}
.profile{
    display: flex;
    margin: 10px;
    
}
.profile img{
    width: 50px;
    margin-right: 10px;
}
.followBtn{
  background-color: #b6bdc4;
  padding: 20px 30px;
  border-radius: 10px;
  margin: 10px;
  border: none;
}
.followBtn:hover{
  background-color: #6287ad;
}
.followBtn:hover, .signIn:hover{
  color: #fff;
  cursor: pointer;
}


</style>