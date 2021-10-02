const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

// const provider = ganache.provider();
// const web3 = new Web3(provider);
const {interface,bytecode}=require('../compile');



//TESTING WITH MOCHA EXAMPLE

// class Car{
//     park(){
//         return 'stopped';
//     }
//     drive(){
//         return 'vroom';
//     }
// }

// let car;
// beforeEach(()=>{
//      car=new Car();

// })
// describe ('Car',()=>{
//     it('can park',()=>{
//         // const car=new Car();
//         assert.equal(car.park(),'stopped');
//     })
//     it('can drive',()=>{
//         // const car=new Car();
//         assert.equal(car.drive(),'vroom');
//     })
// })

let accounts;
let inbox;
const initialMessage="Hi Henry!";
beforeEach(async ()=>{
    //GET a list of all the accounts
   accounts=await web3.eth.getAccounts();
    // .then(fetchedAccounts=>{
    //     console.log(fetchedAccounts);
    // })


    //Use one of the accounts to 
    //deploy the contract
   inbox=await new web3.eth.Contract(JSON.parse(interface))
   .deploy({data:bytecode,arguments:[initialMessage]})
   .send({from:accounts[0],gas:'1000000'})

//    inbox.setProvider(provider);
})

describe('Inbox',()=>{
    it('deploys a contract',()=>{
        assert.ok(inbox.options.address);
    });

    it('checks for default message', async ()=>{
        const message=await inbox.methods.message().call();
        assert.equal(message,initialMessage);
    });

    it('can change message',async ()=>{
        await inbox.methods.setMessage('bye').send({from:accounts[0]});
        const message=await inbox.methods.message().call();
        assert.equal(message,'bye');
    });
})