<template>
     <div class="mainComment">
        <div class="profilePic">
            <img src="@/assets/profile.png">
        </div>
        <div class="commentContent">
            <p>{{name}} | <span>{{handle}}</span> | <span>{{ time }}</span></p>
            <p >{{content}}</p>
            <div class="engagement" >
                <div><button>{{likes}} <font-awesome-icon icon="fa-regular fa-thumbs-up" /></button></div>
            </div>
        </div>
    </div>

</template>
<script>
export default{
    props: {
        id: Number,
        name: String,
        handle: String,
        time: String,
        content: String,
        likes: Number
    }
}
</script>
<style>
.mainComment{
    display: flex;
    align-items: start;
    justify-content: space-between;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.497);
    padding: 18px;
}
.profilePic{
    flex-basis: 2%;
}
.commentContent{
    flex-basis: 96%;
}
.profilePic img{
    height: 40px;
}
.commentContent p{
    margin-top: 0px;
}
.engagement{
    display: flex;
}
.engagement div{
    margin-right: 10px;
}
</style>