<template lang='pug'>
.task(v-if='b'  :class="cardInputSty").dont-break-out.agedwrapper
  .agedbackground.freshpaper(v-if='cardAge < 8')
  .agedbackground.weekoldpaper(v-else-if='cardAge < 30')
  .agedbackground.montholdpaper(v-else-if='cardAge < 90')
  .agedbackground.threemontholdpaper(v-else='cardAge >= 90')
  .row
      .ten.grid
          bird(:b='b', :inId='inId')
      .two.grid
          flag(:b='b', :inId='inId')
  img.claimvine(v-for='n in b.claimed', v-if='n === $store.getters.member.memberId', src='../../assets/images/mark.svg')
  .row()
    .mainColumn.columns.name
        img.upgrade(v-if='b.book.type', src='../../assets/images/time.svg')
        h2(v-if='b.guild')
            img.upgrade(src='../../assets/images/spartan.png')
            span {{ b.guild }}
        h2(v-if='calcVal')
            img.upgrade(v-if='calcVal', src='../../assets/images/cash1.svg')
            span + {{ calcVal }}
        linky(:x='b.name')
        priorities.tinypriorities(v-if='b.guild', :taskId="b.taskId", :inId='b.taskId')
        preview-deck.pd(:task='b')
  .row
      scroll.faded(:b='b', :inId='inId')
      img.btn.dogepepecoin.spinslow(:class="{ungrabbedcoin : !isGrabbed}" src='../../assets/images/dogepepecoin.png' @click='toggleGrab')
      p.hodlcount() {{ b.deck.length }}
      vine.faded(:b='b')
  passed(:b='b')
  
</template>

<script>

import request from 'superagent'
import calculations from '../../calculations'
import FormBox from '../slotUtils/FormBox'
import PreviewDeck from '../Deck/PreviewDeck'
import Bird from './Bird'
import Flag from './Flag'
import Scroll from './Scroll'
import Vine from './Vine'
import Passed from './Passed'
import Linky from './Linky'
import spin from '../../styles/spinners.styl'
import Priorities from '../Deck/Priorities'

export default {
    props: ['b', 'inId'],
    data(){
        return { active: false }
    },
    components: { FormBox, PreviewDeck, Bird, Flag, Scroll, Vine, Passed, Linky, Priorities },
    methods: {
        goIn(){
            this.$router.push("/task/" + this.b.taskId)
        },
        toggleActive(){
            this.active = !this.active
        },
        toggleGrab(){
            if (this.isGrabbed) {
                request
                    .post('/events')
                    .set('Authorization', this.$store.state.loader.token)
                    .send({
                        type: 'task-dropped',
                        taskId: this.b.taskId,
                        memberId: this.$store.getters.member.memberId,
                    })
                    .end((err,res)=>{

                    })
            } else {
                request
                    .post('/events')
                    .set('Authorization', this.$store.state.loader.token)
                    .send({
                        type: 'task-grabbed',
                        taskId: this.b.taskId,
                        memberId: this.$store.getters.member.memberId,
                    })
                    .end((err,res)=>{

                    })
                if(!this.isDecked) {
                request
                    .post('/events')
                    .set('Authorization', this.$store.state.loader.token)
                    .send({
                      type: 'task-sub-tasked',
                      subTask: this.b.taskId,
                      taskId: this.$store.getters.memberCard.taskId,
                    })
                    .end((err,res)=>{

                    })
                }
            }
        }
    },
    computed: {
        calcVal(){
            let v = calculations.calculateTaskPayout(this.b)
            return parseInt(v)
        },
        countClass(){
            return {
                grabbed : this.b.deck.indexOf(this.$store.getters.member.memberId) !== -1,
            }
        },
        cardInputSty(){
          return {
              redwx : this.b.color == 'red',
              bluewx : this.b.color == 'blue',
              greenwx : this.b.color == 'green',
              yellowwx : this.b.color == 'yellow',
              purplewx : this.b.color == 'purple',
              blackwx : this.b.color == 'black',
          }
        },
        parent(){
          let task
          this.$store.state.tasks.forEach( t => {
              if(t.taskId === this.inId) {
                  task = t
              }
          })
          return task
        },
        isGrabbed(){
          return this.b.deck.indexOf( this.$store.getters.member.memberId ) > -1
        },
        isDecked(){
          return this.$store.getters.memberCard.subTasks.indexOf(this.b.taskId) > -1
        },
        cardAge(){
          let now = Date.now()
          let msSince = now - this.b.timestamp
          let days = msSince / (1000 * 60 * 60 * 24)
          return days
        },
    },
}

</script>

<style lang="stylus" scoped>

@import '../../styles/colours'
@import '../../styles/skeleton'
@import '../../styles/grid'
@import '../../styles/button'

.count
    float: right

.activated
    border-style: solid
    border-width: thick
    border-color: white

.upgrade
    height: 3em

.task
    color: white
    margin:0
    margin-bottom: .25em
    padding:1em
    //border-radius: 12px
    box-shadow: -7px 7px 7px 1px rgba(21, 21, 21, 0.5)

.dont-break-out
  overflow-wrap: break-word
  word-wrap: break-word
  word-break: break-word
  hyphens: auto

.row
    position: relative
    width: 100%
    .mainColumn
      width:calc(100% - 75px - 4%)
    .secondaryColumn
      padding-bottom: 1em
      width:75px
      button
        height:75px

.btn
    width:100%
    margin-top: 4em

.brder
    label
        text-align: center

.claimvine
    position: relative
    height: 1em
    top: 0
    left: 0

.arrow
    height: 3.35em

.thumbnail-container {
  width: calc(1440px * 0.19)
  height: calc(900px * 0.19)
  display: inline-block
  overflow: hidden
  position: relative
}

.thumbnail {
  width: calc(1440px)
  height: calc(900px)
  position: relative
  -ms-zoom: 0.19
  -moz-transform: scale(0.19)
  -moz-transform-origin: 0 0
  -o-transform: scale(0.19)
  -o-transform-origin: 0 0
  -webkit-transform: scale(0.19)
  -webkit-transform-origin: 0 0
}

.thumbnail iframe {
  width: 1440px
  height: 900px
}

.thumbnail:after {
  content: ""
  display: block
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
}

.dogepepecoin {
  width: 35px
  height: 35px
  position: absolute
  left: calc(50% - 17.5px)
  bottom: 0
}

.hodlcount {
    position: absolute
    left: calc(50% - 17.5px)
    text-align: center
    width: 35px
    bottom: 9px
    padding-bottom: 0
    margin-bottom: 0
    font-weight: bold
    color: rgba(255, 255, 255, 0.75)
    pointer-events: none
}

.ungrabbedcoin {
  opacity: 0.3
}

.tinypriorities {
    font-size: 75%
    margin-bottom: 2em
    color: white
}

.pd
    max-width: 75px
    position: relative;
    right: 0

.faded
    opacity: 0.235654

.agedwrapper
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
    //border-radius: 12px

.freshpaper
    background-image: url('../../assets/images/paper.jpg')
    opacity: 0.2

.weekoldpaper
    background-image: url('../../assets/images/paper_aged_1.png')
    opacity: 0.25

.montholdpaper
    background-image: url('../../assets/images/paper_aged_2.png')
    opacity: 0.3

.threemontholdpaper
    background-image: url('../../assets/images/paper_aged_3.png')
    opacity: 0.35

// .innerborder
//     // border: 20px solid white;
//     // box-shadow: inset 0px 0px 0px 10px white;
//     // box-sizing: border-box; /* Include padding and border in element's width and height */
//     padding: 2em
//     // .inner-outline {
//     outline: 4px double rgba(255, 255, 255, 0.235654);
//     outline-offset: -16px;
//     // }

</style>
