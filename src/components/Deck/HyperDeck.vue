<template lang='pug'>

.deck.paperwrapper(v-if='parent')
    .row
        .six.columns.card()
            member-row(v-if='dogeCard', :m='dogeCard')
            hypercard(v-else  :b="parent" )
            .bar()
        .six.columns.buffer
            div.upgradesbar()
                upgrades(:b='parent')
            priorities.padbottom(:taskId="parent.taskId")
    div.fadey(:class='cardInputSty')
        task-create(:taskId='parent.taskId')
        panels(v-if='deck.length > 0', :c='deck', :inId='parent.taskId')
        bounty-card(v-if='bountyValue > 1'  :b='parent')
    img.fw(src='../../assets/images/pixeldesert.png')
    .agedbackground.translucent(:class='cardInputSty')
    .agedbackground.freshpaperbg(v-if='cardAge < 8')
    .agedbackground.weekoldpaperbg(v-else-if='cardAge < 30')
    .agedbackground.montholdpaperbg(v-else-if='cardAge < 90')
    .agedbackground.threemontholdpaperbg(v-else='cardAge >= 90')
</template>

<script>

import calculations from '../../calculations'
import Hypercard from "../Card"
import SharedTitle from '../slotUtils/SharedTitle'
import TaskCreate from '../forms/TaskCreate'
import Panels from './Panels'
import Priorities from './Priorities'
import Upgrades from './Upgrades'
import MemberRow from './Member'
import BountyCard from '../Bounties/BountyCard'

export default {
  props: ['taskId', 'task'],
  components:{
      SharedTitle, Hypercard, TaskCreate,
      Panels, Priorities, MemberRow,
      Upgrades, BountyCard
  },
  methods:{
      getTask(taskId){
          let task
          this.$store.state.tasks.forEach( t => {
              if (taskId === t.taskId) {
                  task = t
              }
          })
          return task
      },
  },
  computed: {
      bountyValue(){
          return calculations.calculateTaskPayout(this.parent)
      },
      dogeCard(){
          let mc
          this.$store.state.members.forEach( m => {
              if (this.parent.name === m.memberId ){
                  mc = m
              }
          })
          return mc
      },
      cardInputSty(){
          if (this.parent) return {
              redwx : this.parent.color == 'red',
              bluewx : this.parent.color == 'blue',
              greenwx : this.parent.color == 'green',
              yellowwx : this.parent.color == 'yellow',
              purplewx : this.parent.color == 'purple',
              blackwx : this.parent.color == 'black',
          }
      },
      parent(){
          if (this.taskId) return this.getTask(this.taskId)
          if (this.task) return this.task
          return false
      },
      deck(){
          let tasks = []
          if (this.taskId) {
              let subTasks = []
              this.$store.state.tasks.forEach( t => {
                  if (this.taskId === t.taskId){
                      t.subTasks.slice().reverse().forEach(t => tasks.push( this.getTask(t)))
                  }
              })
          } else if (this.task && this.task.subTasks) {
              this.task.subTasks.forEach( tId => tasks.push( this.getTask(tId) ))
          }
          return tasks
      },
      cardAge(){
          let now = Date.now()
          let msSince = now - this.parent.timestamp
          let days = msSince / (1000 * 60 * 60 * 24)
          return days
      },
  },

}

</script>

<style lang="stylus" scoped>

@import '../../styles/colours'
@import '../../styles/skeleton'
@import '../../styles/button'

.deck
    width: 100%

.card
    color: white
    font-size:1.111em
    padding-left: 1em
    padding-top: 1em

#cyber
    width: 100%
    opacity: 0.5

.buffer
    padding-right: 1em
    padding-top: 1em

.padbottom
    margin-bottom: 2em
    
.upgradesbar
  height: fit-content
  margin-bottom: 2em
  background-color: rgba(21, 21, 21, 0.25)
  border-radius: 40px
  
.upgrade
    height: 4em
    border: 4px solid rgba(0, 0, 0, 0.5)
    background-color: rgba(0, 0, 0, 0, 0.2)

.bar
    min-height: 1em

.fw
    width: 100%
    opacity: 0.11

.fadey
    background-color: rgba(255,255,255,0.1)
    padding: 1em 0 1em 0
    margin: 0 1em

.slide-fade-enter-active {
  transition: all .6s ease;
}
.slide-fade-leave-active {
  transition: all .4s ease;
}
.slide-fade-enter {
  // transform: translateY(-400px);
  opacity: 0;
}
.slide-fade-leave-to {
 // transform: translateY(-400px);
  opacity: 0;
}

.paperwrapper
    position: relative
    
.agedbackground
    background-image: url('../../assets/images/paper.jpg')
    background-repeat: no-repeat
    background-position: center center
    background-size: cover
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: absolute
    width: 100%
    height: 100%
    pointer-events: none

.freshpaperbg
    background-image: url('../../assets/images/paper.jpg')
    opacity: 0.2
    z-index: -2

.weekoldpaperbg
    background-image: url('../../assets/images/paper_aged_1.png')
    opacity: 0.25
    z-index: -2

.montholdpaperbg
    background-image: url('../../assets/images/paper_aged_2.png')
    opacity: 0.3
    z-index: -2

.threemontholdpaperbg
    background-image: url('../../assets/images/paper_aged_3.png')
    opacity: 0.35
    z-index: -2

.translucent
    background-image: none
    z-index: -2
    opacity: 0.42
    // content: " "
    // z-index: 10
    // display: block
    // position: absolute
    // height: 100%
    // width: 100%
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // height: 0;
    // z-index: -3

// .bluewx
//   background-color: rgba(255, 0, 0, 0.2)

// .greenwx
//   background-color: rgba(255, 0, 0, 0.2)

// .yellowwx
//   background-color: rgba(255, 0, 0, 0.2)

// .purplewx
//   background-color: rgba(134, 66, 169, 0.2)
  
// .redwx
//   background-color: rgba(255, 0, 0, 0.2)
    
</style>
