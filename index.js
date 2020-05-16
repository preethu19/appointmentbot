const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {


    function reformatDate(s) {
        // ["2018-11-23", "16:51:42+05:30"]
        var b = s.split('T');
        // ["16", "51"]
        var t = b[1].slice(0,5).split(':');  
        return [b[0], `${t[0]%12||12}:${t[1]} ${t[0]<12?'am':'pm'}`];
      }

    var params = request.body.queryResult.parameters;
    console.log(params);
    function arrayRemove(arr, value) { 
  
   return arr.filter(function(geeks){ 
       return geeks !== value; 
   }); 
}
    var time = '';
    var date = '';

    switch (request.body.queryResult.action) {
        case 'SelectTime':
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            console.log(params);
            db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).get()
                    .then(snapshot => {
                        var fulfillmentText = ''
                        if (snapshot.empty) {
                            var time_slots = ['9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm']
                            time_slots.forEach((time, index) => {
                                if (params['time'] === time){
                                    db.collection('appointments').add(params)
                                    fulfillmentText = 'You are all set for your '+params['type']+' on '+params['date']+' at '+params['time']+',  See you then!\n'
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
                        
                        var time_slots = ['9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm']
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
                            
                            date = reformatDate(params['date']);
                            
                            params['date'] = date[0];
                            console.log(params);
                            // converting array to speech
                            var fulfillmentText = 'You have the following appointments on '+params['date']+':\n';
        
                            appointments.forEach((eachAppointment, index) => {
                                if (params['date'] === eachAppointment['date'])
                                    fulfillmentText +=  eachAppointment["type"] + ' at ' + eachAppointment["time"] + '\n';
                            })
                            if (fulfillmentText === 'You have the following appointments on '+params['date']+':\n')
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
                    time = reformatDate(params['time']);
                    date = reformatDate(params['date']);
                    params['time'] = time[1];
                    params['date'] = date[0];
                    console.log(params);
                    
                    db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).get()
                    .then(snapshot => {
                        var fulfillmentText = ''
                        if (snapshot.empty) {
                            console.log('No data found')
                            fulfillmentText = 'There is no appointment set on '+params['date']+' at '+params['time']+'\n';
                        
                        }  

                        snapshot.forEach(doc => {
                            db.collection('appointments').doc(doc.id).delete();
                            fulfillmentText =  'Your appointment on '+params['date']+' at '+params['time']+' has been cancelled successfully\nPlease re-schedule a new appointment if you wish!\n';
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
