<template lang='pug'>

.upgrades
    .row
        .four.grid(@click='select(0)', :class='{selected: show === 0}')
            img.upgrade(src='../../assets/images/guildwithwhitenobkgrnd.png')
        .four.grid(@click='select(1)', :class='{selected: show === 1}')
            img.upgrade(src='../../assets/images/treasurechestnobkgrndwhiteD.png')
        .four.grid(@click='select(2)', :class='{selected: show === 2}')
            img.upgrade(src='../../assets/images/timecubewithwhite.png')
    .mainbg
      transition(name='slide-fade')
        div(v-if='show === 0')
            guild-create
            current(v-for='n in nameList'  :memberId='n')
            img.dogepepecoin(:class="{ungrabbedcoin : !isGrabbed}" src='../../assets/images/dogepepecoin.png' @click='toggleGrab')
        template(v-if='show === 1')
          .box
            form-box(v-if='!b.bolt11'   :btntxt='"invoice " + payreqAmount'  event='invoice-created'  v-bind:data='invoiceCreate')
              fancy-input(labelText='choose amount')
                  input.input-effect(v-model='payreqAmount')
            pay-req(v-else   :bolt11='b.bolt11')
            form-box(v-if='!b.address'   btntxt='get address'  event='address-updated'  v-bind:data='addressUpdate')
            pay-address(v-else   :address='b.address')
        resource-book(v-if='show === 2', :tId='b.taskId')

</template>

<script>

import request from 'superagent'
import calcs from '../../calculations'

import SharedTitle from '../slotUtils/SharedTitle'
import TaskCreate from '../forms/TaskCreate'
import HyperDeck from '../Deck/HyperDeck'
import PreviewDeck from '../Deck/PreviewDeck'
import Hypercard from '../Card'
import GuildCreate from '../forms/GuildCreate'
import BountyCreate from '../forms/BountyCreate'
import ResourceBook from '../forms/ResourceBook'
import Actions from '../Card/Actions'
import FormBox from '../slotUtils/FormBox'
import Tag from '../Nodes/Tag'
import PayReq from './PayReq'
import PayAddress from './PayAddress'
import FancyInput from '../slotUtils/FancyInput'
import Current from '../Members/Current'

export default {
    props: ['b'],
    components:{
        SharedTitle, Current, TaskCreate,
        HyperDeck, Hypercard, GuildCreate,
        BountyCreate, PreviewDeck, Actions,
        ResourceBook, FormBox, Tag, PayReq,
        PayAddress, FancyInput, Current
    },
    data(){
        return {
            show: false,
            payreqAmount: '',
        }
    },
    methods: {
        select(x){
            if (this.show === x){
                this.show = false
            } else {
                this.show = x
            }
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
        isDecked(){
          return this.$store.getters.memberCard.subTasks.indexOf(this.b.taskId) > -1
        },
        isGrabbed(){
          return this.b.deck.indexOf( this.$store.getters.member.memberId ) > -1
        },
        nameList(){
            return this.b.deck.map(mId => {
                return mId
            })
        },
        addressUpdate(){
            return {
                type: 'address-updated',
                taskId: this.b.taskId
            }
        },
        invoiceCreate(){
            let spot = this.$store.state.cash.spot | 10000
            let amount = calcs.cadToSats( parseInt(this.payreqAmount), spot)
            return {
                type: 'invoice-created',
                taskId: this.b.taskId,
                amount,
                label: '<3'
            }
        },
        calcTime(){
            if (this.b.book.startTs){
                let now = Date.now()
                let secondsTill = this.b.book.startTs - now
                let days = secondsTill / (1000 * 60 * 60 * 24)
                return parseInt(days)
            } else {
                return false
            }
        },
        calcVal(){
            if (this.calcTask){
                let v = calcs.calculateTaskPayout(this.b)
                return parseInt(v)
            }
        },
        id(){
            return this.$route.path.split('/')[2]
        },
        cardInputSty(){
            if (this.calcTask) return {
                redwx : this.calcTask.color == 'red',
                bluewx : this.calcTask.color == 'blue',
                greenwx : this.calcTask.color == 'green',
                yellowwx : this.calcTask.color == 'yellow',
                purplewx : this.calcTask.color == 'purple',
                blackwx : this.calcTask.color == 'black',
            }
        },
        calcTask(){
            let task = {}
            this.$store.state.tasks.forEach( t => {
                if (this.id === t.taskId){// XXX:
                    task = t
                }
            })
            return task
        },
    },
}

</script>

<style lang='stylus' scoped>

@import '../../styles/colours'
@import '../../styles/skeleton'
@import '../../styles/grid'
@import '../../styles/button'

.upgrades
    width: 100%

.selected
    background: white
    border-radius: 40px 40px 0 0

.formlabel
    padding-top: 1em
    padding-bottom: 1em
    text-align: center

.card
    padding: 2em
    color: white
    text-align: center

p
    padding-left: .6em
    font-size:1.3em
    font-family: 'Open Sans', light, sans-serif;

a
    color: accent2

h3
    text-align: left
    font-family: 'Open Sans', light, sans-serif;

.grid
    height: 4em
    text-align: center
    .upgrade
        height: 4em

.mainbg
    background: softGrey

.fl
    float: left

.dol
    height: 4em
    opacity: 0.27

.two
    text-align: center
    padding: .4321em

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

.box
    padding: 1em

.ungrabbedcoin {
  opacity: 0.3
}

.dogepepecoin
    height: 3em
    float: right

.pointsinput
    width: 45%;
    margin-bottom: 1em;
    text-align: center;
    font-size: 1.5em;

.centerchildren
    text-align: center;

</style>
