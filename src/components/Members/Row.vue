<template lang='pug'>

.memberrow
      .row
        .four.columns
            img(v-if='isLoggedIn', src='../../assets/images/loggedIn.svg')
            img(v-else, src='../../assets/images/loggedOut.svg')
            label {{ m.name }}
        .eight.columns
            priorities(:taskId='getTaskId')


</template>


<script>

import DctrlActive from './DctrlActive'
import Badges from './Badges'
import Addr from './Addr'
import PreviewDeck from '../Deck/PreviewDeck'
import Priorities from '../Deck/Priorities'

export default {
    props: ['m'],
    components: {DctrlActive, Badges, Addr, PreviewDeck, Priorities},
    computed:{
        isLoggedIn(){
            let isLoggedIn
            this.$store.state.sessions.forEach( s => {
                if ( s.ownerId === this.m.memberId ){
                    isLoggedIn = true
                }
            })
            return isLoggedIn
        },
        getTaskId(){
            let id
            this.$store.getters.memberCards.forEach( t => {
                if (this.m.memberId === t.name){
                    id = t.taskId
                }
            })
            return id
        }
    },
    methods: {
        getName(taskId){
            let name
            this.$store.state.tasks.some(t => {
                if (taskId === t.taskId){
                    name = t.name
                    return true
                }
            })
            return name
        }
    }
}

</script>

<style lang="stylus" scoped>

@import '../../styles/colours'
@import '../../styles/skeleton'
@import '../../styles/grid'

img
    height: 4em

label
    font-size: 1.246em
    font-weight: normal;
    margin: 1em

.memberrow
    border-bottom: .2em dashed softGrey
    padding-bottom: .3em
    margin-bottom: .5em

</style>
