<template lang='pug'>

#member
    .list(v-if="$store.getters.isLoggedIn")
        .row
            .three.columns
                router-link(to='/members')
                    img#sunexper(src='../../assets/images/kisspng-sunlight-sunlight-solar-eclipse-sun-png-5ac3de5a164717.6591244715227858820913.png')
            .nine.columns
                h2 {{ $store.getters.activeMembers.length }} active doges
                row(v-for="m in $store.getters.activeMembers", :m="m")
                purg
    .padding(v-else)
        p dctrl member
        ol
            li Believer in a transcendent future.
            li Possess dctrl rfid tag.
            li Possible human, magical entity, fairy, cyborg or alien.
        p
            strong visit a node to find out more

</template>

<script>

import _ from "lodash"
import Row from "./Row"
import request from "superagent"
import SharedTitle from '../slotUtils/SharedTitle'
import CrazyBtn from '../slotUtils/CrazyBtn'
import DctrlActive from './DctrlActive'
import Addr from './Addr'
import Purg from './Purg'
import Bounties from '../Bounties'

export default {
    components : {
        Bounties,
        SharedTitle,
        Row,
        CrazyBtn,
        DctrlActive,
        Addr,
        Purg
    }
}

</script>

<style lang='stylus' scoped>

@import '../../styles/colours'
@import '../../styles/input'
@import '../../styles/skeleton'

#sunexper
    width: 130%

#member
    width: 100%

li
    margin-left: 1em

.padding
    padding: 1.987654321em

.cross
    text-decoration: line-through;


</style>
