
#### Autonomous Organization

AO is locally run infrastructure to help create successful commons hackerspaces.

`git clone ...`
`cd ao`

`yarn install`
`yarn compile`
`yarn start`

Feature list:
    - Connect physical resources (door, vending) with readers and pin activated hardware.
    - Maintain list of accounts associated with rfid tags.
    - Accounts can create cards, send them between accounts, create lists of priorities, plunge cards into cards inception.

To fully function ao requires sqlite3, bitcoind, and clightning. Example configuration.js:

````
module.exports = {
    bitcoind:{
        username:'dctrl',
        password:'123',
        network: 'regtest'
    },
    bitcoinAverage: {
        pub: '',
        secret: ''
    },
    clightning: {
        dir:'/home/trhode/.lightning'
    },
    sqlite3: {
        file: '/home/trhode/.ao/database.sqlite3'
    }
}
````

The addresses created by ao are on this device - backup the ~/.lightning/hsm_secret file - this is very experimental; use at your own risk.
