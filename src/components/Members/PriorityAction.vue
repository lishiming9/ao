<template lang='pug'>

.priorities
    router-link(:to='"/task/" + taskId')
        img.singleship(src='../../assets/images/singleship.svg')
    span {{ name }} !!
    .row
        .five.grid
            button.accept(@click='claim')
                img.arrow.fr(src='../../assets/images/buddadoge.svg')
                span complete
        .five.grid
            button.dontaccept(@click='refuse')
                img.arrow.fl(src='../../assets/images/buddadoge.svg')
                span refocus
        .two.grid.cur(@click='nextAction')
            img.arrow.fl(src='../../assets/images/downRed.svg')


</template>

<script>

import request from 'superagent'

export default {
    data(){
        return {
            notes: ''
        }
    },
    props: ['taskId', 'nextAction'],
    computed: {
        name(){
            let name
            this.$store.state.tasks.some(t => {
                if (this.taskId === t.taskId){
                    name = t.name
                    return true
                }
            })
            return name
        },
    },
    methods: {
        claim(){
            request
                .post('/events')
                .set('Authorization', this.$store.state.loader.token)
                .send({
                    type: 'task-claimed',
                    taskId: this.taskId,
                    memberId: this.$store.getters.member.memberId,
                    notes: this.notes
                })
                .end((err,res)=>{

                })
        },
        refuse(){
            request
                .post('/events')
                .set('Authorization', this.$store.state.loader.token)
                .send({
                    type: 'task-refocused',
                    taskId: this.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
                .end((err,res)=>{

                })
        }
    }
}

</script>

<style lang='stylus' scoped>

@import '../../styles/colours'
@import '../../styles/grid'

button
    width: 100%
    span
        color : white
        font-weight: bolder;

.priorities
    color: red

.singleship
    display: inline
    height: 4em
    margin-right: 2em

.arrow
    height: 3.35em
    border-radius: 3px

button
    img
        background: white
        padding: .1em


.accept, .dontaccept
    background: accent5
    padding: .789em
    border-style: none
    // img
.fr
  float:right

.fl
  float:left

</style>
