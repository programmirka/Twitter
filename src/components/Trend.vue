<template>
    <div class="trend">
            <p>#{{ trend }}<br>
                <span> 5 tweet</span></p>
    </div>
</template>
<script>
export default{
    props: {
        trend: String
    }
}
</script>
<style scoped>
.trend{
    width: 80%;
    margin: 20px 5px;
    border-radius: 10px;
    background-color: #6287ad2b;
    padding: 5px 20px;
}
.trend p{
    margin: 12px;
}

</style>