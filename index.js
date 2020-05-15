const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {

    console.log("request.body.queryResult.parameters: ",request.body.queryResult.parameters);

    console.log("request.body.queryResult.action: ",request.body.queryResult.action);
        

    switch (request.body.queryResult.action) {

        case 'BookRoom':

            var params = request.body.queryResult.parameters;

    
            db.collection('orders').add(params).then(() =>
            {

                response.send({
                    fulfillmentText:
                        params["name"] + ' your hotel booking request for ' + params["RoomType"] + ' room is forwarded for ' + params["number"] + ' rooms, we will contact you on ' + params["email"] + ' soon'
            });
            return null;  
            }).catch((e => {
        
                console.log("error: ", e);

                response.send({
                    fulfillmentText: "something went wrong when writing on database"
                 });
            }))
            break;

        case 'ShowBookings':

            db.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var fulfillmentText = 'Here are your orders \n';

                    orders.forEach((eachOrder, index) => {
                        fulfillmentText += 'number ' + (index + 1) + ' is ' + eachOrder["RoomType"] + ' room for ' + eachOrder["number"] + ' rooms, ordered by ' + eachOrder["name"] + ' contact email is ' + eachOrder["email"] + '\n';
                    })

                    response.send({
                        fulfillmentText: fulfillmentText
                    });
                    return null; 
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        fulfillmentText: "something went wrong when reading from database"
                    })
                })

            break;

            case 'countBooking':

            db.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        fulfillmentText: 'you have ' + orders.length + ' orders, would you like to see them? (yes/no)'
                    });
                    return null; 
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        fulfillmentText: "something went wrong when reading from database"
                    })
                })

            break;

        default:
            response.send({
                fulfillmentText : "no action matched in webhook"
            })
        }
    });