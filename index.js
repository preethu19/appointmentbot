const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {
    var params = request.body.queryResult.parameters;

    function arrayRemove(arr, value) { 
  
   return arr.filter(function(geeks){ 
       return geeks !== value; 
   }); 
}

   function appoint(){
    
    return appointments;
   }
  

  

    switch (request.body.queryResult.action) {
        case 'SelectTime':
            

            

            db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).get()
                    .then(snapshot => {
                        var fulfillmentText = ''
                        if (snapshot.empty) {
                            var time_slots = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm']
                            time_slots.forEach((time, index) => {
                                if (params['time'] === time){
                                    db.collection('appointments').add(params)
                                    fulfillmentText = 'Done! Your appointment is set on '+params['date']+' at '+params['time']+' See you soon.'
                                }
                            })
                            if (fulfillmentText === '')
                                fulfillmentText = 'This is out of meeting hours. Choose from available time.\n'

                            }  
                        else{
                            fulfillmentText = 'This time slot is already filled. Choose from available time.\n'
                        }
                                
                        
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
            case 'bookAppointment':

                db.collection('appointments').get()
                    .then((querySnapshot) => {
    
                        var appointments = [];
                        querySnapshot.forEach((doc) => { appointments.push(doc.data()) });
                        // now orders have something like this [ {...}, {...}, {...} ]
                        
                        var time_slots = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm']
                        // converting array to speech
                        var fulfillmentText = 'Time Slots Available. Choose your time. \n';
    
                        appointments.forEach((eachAppointment, index) => {
                            if (params['date'] === eachAppointment['date'])
                                // Remove eachAppointment['time'] from time_slots
                                time_slots = arrayRemove(time_slots, eachAppointment['time']); 
                                
                        })

                        time_slots.forEach((time, index) => {
                            fulfillmentText += time + '\n';
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
                case 'showSchedule':

                    db.collection('appointments').get()
                        .then((querySnapshot) => {
        
                            var appointments = [];
                            querySnapshot.forEach((doc) => { appointments.push(doc.data()) });
                            // now orders have something like this [ {...}, {...}, {...} ]
        
                            // converting array to speech
                            var fulfillmentText = 'This is your schedule on '+ params['date'] +' You have meetings at\n';
        
                            appointments.forEach((eachAppointment, index) => {
                                if (params['date'] === eachAppointment['date'])
                                    fulfillmentText +=  eachAppointment["time"] + '\n';
                            })
                            if (fulfillmentText === 'This is your schedule on '+ params['date'] +' You have meetings at\n')
                                fulfillmentText = 'You have no meetings on ' +params['date']
        
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
                case 'cancelAppointment':
                    
                    db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).get()
                    .then(snapshot => {
                        var fulfillmentText = ''
                        if (snapshot.empty) {
                            console.log('No data found')
                            fulfillmentText = 'There is no appointment set on '+params['date']+' at '+params['time']+'\n';
                        
                        }  

                        snapshot.forEach(doc => {
                            db.collection('appointments').doc(doc.id).delete();
                            fulfillmentText =  'Your appointment on '+params['date']+' at '+params['time']+' has been cancelled successfully\n';
                        });
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
        default:
            response.send({
                fulfillmentText : "no action matched in webhook"
            })
    }
});
