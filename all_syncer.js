var tiny = require('tiny-json-http')
var url1 = "http://127.0.0.1:3333/api/cron/create-user";
var url2 = "http://127.0.0.1:3333/api/cron/update-user";
var url3 = "http://127.0.0.1:3333/api/cron/create-batch";

var url4 = "http://127.0.0.1:3333/api/cron/insert-reward-history";
var url5 = "http://127.0.0.1:3333/api/cron/insert-percentage-history";
var url6 = "http://127.0.0.1:3333/api/cron/insert-create-stake-history";
var url7 = "http://127.0.0.1:3333/api/cron/insert-remove-stake-history";

(async() => {
   do {
     try {
       console.log(await tiny.get({url:url1}))
     } catch (err) {
       console.log('Error Occured in Create User', err)
     }

     await new Promise(r => setTimeout(r, 5000));
 	
     try {
       console.log(await tiny.get({url:url2}))
     } catch (err) {
       console.log('Error Occured in Update User', err)
     }
     
     await new Promise(r => setTimeout(r, 5000));
     
     try {
       console.log(await tiny.get({url:url3}))
     } catch (err) {
       console.log('Error Occured in Create Batch', err)
     }
 
     await new Promise(r => setTimeout(r, 5000));

    try {
       console.log(await tiny.get({url:url4}))
     } catch (err) {
       console.log('Error Occured in Create Reward History', err)
     }
 
     await new Promise(r => setTimeout(r, 10000));

    try {
       console.log(await tiny.get({url:url5}))
     } catch (err) {
       console.log('Error Occured in Create Percentage History', err)
     }
 
     await new Promise(r => setTimeout(r, 10000));

    try {
       console.log(await tiny.get({url:url6}))
     } catch (err) {
       console.log('Error Occured in Create Stake History', err)
     }
 
     await new Promise(r => setTimeout(r, 10000));

    try {
       console.log(await tiny.get({url:url7}))
     } catch (err) {
       console.log('Error Occured in Remove Stake History', err)
     }
 
     await new Promise(r => setTimeout(r, 10000));

   }while(1);

}) ();
