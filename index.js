const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {

    console.log("request.body.queryResult.outputContexts.parameters: ",request.body.queryResult.outputContexts[0].parameters);
    console.log("request.body.queryResult.parameters: ",request.body.queryResult.parameters);

    console.log("request.body.queryResult.action: ",request.body.queryResult.action);
    var fulfillmentText = ''
    var params = request.body.queryResult.parameters;
    var language = request.body.queryResult.languageCode;
    console.log('request.body.languageCode',request.body.queryResult.languageCode)

    function reformatDate(s) {
        // ["2018-11-23", "16:51:42+05:30"]
        var b = s.split('T');
        // ["16", "51"]
        var t = b[1].slice(0,5).split(':');  
        return [b[0], `${t[0]%12||12}:${t[1]} ${t[0]<12?'am':'pm'}`];
      }
      function arrayRemove(arr, value) { 
  
        return arr.filter(function(geeks){ 
            return geeks !== value; 
        });
     }

     Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };
    function nxtday(d){
        var currentDate = new Date(d);
        p=currentDate.addDays(1).toISOString().slice(0,10);
        return p
    }
    var range = [];
    function isInRange(value, range) {
    return value >= range[0] && value <= range[1];
    }
    

    function currentdatetime(){
        var today = new Date();
        console.log("today",today)
        var dateUTC = new Date(today);
        dateUTC = dateUTC.getTime() 
        var dateIST = new Date(dateUTC);
        //date shifting for IST timezone (+5 hours and 30 minutes)
        dateIST.setHours(dateIST.getHours()+5); 
        dateIST.setMinutes(dateIST.getMinutes()+30);
        date = dateIST
        date = date.toLocaleString().split(' ')
        console.log("date",date)
        temp = date[0]
        temp = temp.split('-')
        if(temp[1].length<2){
            temp[1]='0'+temp[1]
            }
        if(temp[2].length<2){
        temp[2]='0'+temp[2]
        }
        date[0] = temp[0]+'-'+temp[1]+'-'+temp[2]
          
        return date;
    }
    function get12hour(time){
        var t = date[1].split(':');
        return `${t[0]%12||12}:${t[1]} ${t[0]<12?'am':'pm'}`;
    }
    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
      
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
          hours = '00';
        }
      
        if (modifier === 'pm') {
          hours = parseInt(hours, 10) + 12;
        }
      
        return `${hours}:${minutes}`;
      }

      function assign_specialization(symptoms) { //assuming symptoms is an array with all the possible symptoms
        //the following are the various specialists with different symptoms they treat
        var audiologist = ["hear"];
        var allergist = ["allergy"];
        var cardiologist = ["heart"];
        var dentist = ["tooth"];
        var dermatologist = ["skin","scalp","nail"];
        var endocrinologist = ["hormone","diabetes","thyroid"];
        var gynecologist = ["women health"];
        var neurologist = ["nervous","spinal cord","brain"];
        var obstetrician = ["pregnancy"];
        var oncologist = ["cancer"];
        var orthopedic = ["joint pain","muscle"];
        var ent = ["nose","throat","ear"];
        var pediatrician = ["my child"];
        var plastic = ["plastic surgery"];
        var psychiatrist = ["depression"];
        var urologist = ["urinary tract"];
        var ophthalmologist = ["eye"];
        //below is the array to determine which specialization
        var which_spec = ["General Physician","Audiologist","Allergist","Cardiologist","Dentist","Dermatologist","Endocrinologist","Gynecologist","Neurologist","Obstetrician","Oncologist","Orthopedic","ENT Specialist","Pediatrician","Plastic","Psychiatrist","Urologist","Ophthalmologist"];
        //counter variable keeps track of which specialization to index to in the above array which_spec. counter is initialized to 0 so that if none of the symptoms are there, they are sent to general physician
        var counter = 0;
        for (i=0; i < symptoms.length; i++){
            if(audiologist.includes(symptoms[i])){
                counter = 1;
                break;
            }
            if(allergist.includes(symptoms[i])){
                counter = 2;
                break;
            }
            if(cardiologist.includes(symptoms[i])){
                counter = 3;
                break;
            }
            if(dentist.includes(symptoms[i])){
                counter = 4;
                break;
            }
            if(dermatologist.includes(symptoms[i])){
                counter = 5;
                break;
            }
            if(endocrinologist.includes(symptoms[i])){
                counter = 6;
                break;
            }
            if(gynecologist.includes(symptoms[i])){
                counter = 7;
                break;
            }
            if(neurologist.includes(symptoms[i])){
                counter = 8;
                break;
            }
            if(obstetrician.includes(symptoms[i])){
                counter = 9;
                break;
            }
            if(oncologist.includes(symptoms[i])){
                counter = 10;
                break;
            }
            if(orthopedic.includes(symptoms[i])){
                counter = 11;
                break;
            }
            if(ent.includes(symptoms[i])){
                counter = 12;
                break;
            }
            if(pediatrician.includes(symptoms[i])){
                counter = 13;
                break;
            }
            if(plastic.includes(symptoms[i])){
                counter = 14;
                break;
            }
            if(psychiatrist.includes(symptoms[i])){
                counter = 15;
                break;
            }
            if(urologist.includes(symptoms[i])){
                counter = 16;
                break;
            }
            if(ophthalmologist.includes(symptoms[i])){
                counter = 17;
                break;
            }
        }
        return which_spec[counter]; //return name of specializaton. data type: string
    }



    getHindi = {
      'Allergist': "एलर्जिस्ट",
      'Anesthesiologist': "निश्चेतना विशेषज्ञ",
      'Audiologist': "ऑडियोलॉजिस्ट",
      'Cardiologist': "हृदय रोग विशेषज्ञ",
      'Dentist': "दंत चिकित्सक",
      'Dermatologist': "त्वचा विशेषज्ञ",
      'Dr. Aakash Ashtekar': "डॉ। आकाश अष्टेकर",
      'Dr. Abhinav Bagchi': "डॉ। अभिनव बागची",
      'Dr. Akshara Heravdakar': "डॉ। अक्षरा हेरावडकर",
      'Dr. Akshey Dvivedi': "डॉ। अक्षी द्विवेदी",
      'Dr. Aman Ranganekary': "डॉ। अमन रंगानेरी",
      'Dr. Amish Ayyangar': "डॉ। अमीष अयंगर",
      'Dr. Amrit Poddar': "डॉ। अमृत पोद्दार",
      'Dr. Ananda Dattachaudhuri': "डॉ। आनंद दत्ताचौधुरी",
      'Dr. Anuraag Vaknis': "डॉ। अनुराग वकानिस",
      'Dr. Anushka Upasani': "डॉ। अनुष्का उपासनी",
      'Dr. Arjuna Chadda': "डॉ। अर्जुन चड्डा",
      'Dr. Arjuna Dayal': "डॉ। अर्जुन दयाल",
      'Dr. Arun Adwani': "डॉ। अरुण अदवानी",
      'Dr. Ashia Mirchandani': "डॉ। आशिया मीरचंदानी",
      'Dr. Ayaan Chetti': "डॉ। अयान चेट्टी",
      'Dr. Ayush Vad': "डॉ। आयुष बड़",
      'Dr. Bhairavi Kashyap': "डॉ। भैरवी कश्यप",
      'Dr. Chakravarti Prabhu': "डॉ। चक्रवर्ती प्रभु",
      'Dr. Chander Gandhi': "डॉ। चंदर गांधी",
      'Dr. Cyavana Kapudia': "डॉ। साइवाना कपुड़िया",
      'Dr. Dakini Kapadia': "डॉ। डाकिनी कपाड़िया",
      'Dr. Damayanti Singh': "डॉ। दमयंती सिंह",
      'Dr. Dheeraj Kumar': "डॉ। धीरज कुमार",
      'Dr. Dhule Adwani': "डॉ। धुले अदवानी",
      'Dr. Dhuleep Navathe': "डॉ। धुलिप नवाथे",
      'Dr. Gauri Tavade': "डॉ। गौरी तावड़े",
      'Dr. Gopal Mukhtar': "डॉ। गोपाल मुख्तार",
      'Dr. Har Kayal': "डॉ। हर कयाल",
      'Dr. Har Kumar': "डॉ। हर कुमार",
      'Dr. Harsh Pandey': "डॉ। हर्ष पांडे",
      'Dr. Ishwar Nandi': "डॉ। ईश्वर नंदी",
      'Dr. Kanwal Viswan': "डॉ। कंवल विश्व",
      'Dr. Kareena Poddar': "डॉ। करीना पोद्दार",
      'Dr. Katyayana Mallaya': "डॉ। कात्यायन मल्लया",
      'Dr. Komal Dayal': "डॉ। कोमल दयाल",
      'Dr. Krishnaa Prabhu': "डॉ। कृष्णा प्रभु",
      'Dr. Kusika Munshi': "डॉ। कुसिका मुंशी",
      'Dr. Lakshmi Pandey': "डॉ। लक्ष्मी पांडे",
      'Dr. Lavanya Sabanis': "डॉ लावण्या सबानीस",
      'Dr. Leela Parekh': "डॉ। लीला पारेख",
      'Dr. Mahadaji Kumar': "डॉ। महादजी कुमार",
      'Dr. Manas Ajagavakar': "डॉ मानस अजगावकर",
      'Dr. Manas Heravdakar': "डॉ। मानस हेरवादकर",
      'Dr. Maya Raj': "डॉ। माया राज",
      'Dr. Megh Dvivedi': "डॉ। मेघ द्विवेदी",
      'Dr. Mishri Divekar': "डॉ। मिश्री दिवेकर",
      'Dr. Mohun Bhate': "डॉ। मोहन भाटे",
      'Dr. Motilal Nambisan': "डॉ। मोतीलाल नंबिसन",
      'Dr. Navin Sharma': "डॉ। नवीन शर्मा",
      'Dr. Nupur Chopade': "डॉ। नूपुर चोपड़े",
      'Dr. Om Chitanis': "डॉ। ओम चिटनिस",
      'Dr. Padmini Bhattacharya': "डॉ। पद्मिनी भट्टाचार्य",
      'Dr. Pandu Gaur': "डॉ। पांडु गौड़",
      'Dr. Pranav Nambisan': "डॉ। प्रणव नंबिसन",
      'Dr. Radha Munshif': "डॉ। राधा मुंसिफ",
      'Dr. Raghu Acharekar': "डॉ। रघु आचरेकर",
      'Dr. Rani Adhya': "डॉ। रानी अधिया",
      'Dr. Rakesh Sharma': "डॉ। राकेश शर्मा",
      'Dr. Ruhi Sirasikar': "डॉ। रूही सिरासिकर",
      'Dr. Sadhana Parikh': "डॉ। साधना पारिख",
      'Dr. Sahadeva Gupta': "डॉ। सहदेव गुप्ता",
      'Dr. Samarj Adwani': "डॉ। समरज अदवानी",
      'Dr. Saryu Srivastav': "डॉ। सरयू श्रीवास्तव",
      'Dr. Shalini Viswan': "डॉ। शालिनी विश्वन",
      'Dr. Shanti Patil': "डॉ। शांति पाटिल",
      'Dr. Sharad Kamath': "डॉ। शरद कामथ",
      'Dr. Sharad Ojha': "डॉ। शरद ओझा",
      'Dr. Shinu Ayyangar': "डॉ। शिनू अयंगर",
      'Dr. Shristi Jayavant': "डॉ। श्रीस्ती जयवंत",
      'Dr. Shruti Seth': "डॉ। श्रुति सेठ",
      'Dr. Steve Shawn': "डॉ। स्टीव शॉन",
      'Dr. Sulini Chitanis': "डॉ। सुलिनी चिटनिस",
      'Dr. Sumit Nambiyar': "डॉ। सुमित नाम्बियार",
      'Dr. Surya Heravdakar': "डॉ। सूर्य हेरवादकर",
      'Dr. Usha Mayadev': "डॉ। उषा मायादेव",
      'Dr. Vineet Jayavant': "डॉ। विनीत जयवंत",
      'Dr. Viswamitra Adhya': "डॉ। विश्वामित्र आद्या",
      'Dr. Yudhishthira Upasani': "डॉ। युधिष्ठिर उपासनी",
      'Dr. Zalim Naidu': "डॉ। ज़ालिम नायडू",
      'Dr. Zohana Sharma': "डॉ। जोहाना शर्मा",
      'ENT Specialist': "ईएनटी विशेषज्ञ",
      'Endrocinologist': "एंडोक्राइनोलॉजिस्ट",
      'Epidemiologist': "महामारी",
      'General Physician': "सामान्य चिकित्सक",
      'Gynecologist': "प्रसूतिशास्री",
      'Immunologist': "प्रतिरक्षाविज्ञानी",
      'Medical Geneticist': "मेडिकल जेनेटिक",
      'Neurologist': "न्यूरोलॉजिस्ट",
      'Neurosurgeon': "न्यूरोसर्जन",
      'Obstetrician': "दाई",
      'Oncologist': "ऑन्कोलॉजिस्ट",
      'Orthopedic Surgeon': "हड्डियो का सर्जन",
      'Pediatrician': "बच्चों का चिकित्सक",
      'Physiologist': "विज्ञानी",
      'Plastic Surgeon': "प्लास्टिक शल्यचिकित्सक",
      'Podiatrist': "पोडियाट्रिस्ट",
      'Psychiatrist': "मनोचिकित्सक",
      'Rheumatologist': "ह्रुमेटोलॉजिस्ट",
      'Surgeon': "शल्य चिकित्सक",
      'Urologist': "उरोलोजिस्त",
      '10:00 am': 'सुबह 10 बजे',
      '10:30 am': 'सुबह 10.30 बजे',
      '11:00 am': 'सुबह 11 बजे',
      '11:30 am': 'सुबह 11.30 बजे',
      '12:00 pm': 'दोपहर 12 बजे',
      '12:30 pm': 'दोपहर 12.30 बजे',
      '1:00 pm': 'दोपहर 1 बजे',
      '1:30 pm': 'दोपहर 1.30 बजे',
      '2:00 pm': 'दोपहर 2 बजे',
      '2:30 pm': 'दोपहर 2.30 बजे',
      '3:00 pm': 'दोपहर 3 बजे',
      '3:30 pm': 'दोपहर 3.30 बजे',
      '4:00 pm': 'शाम 4 बजे',
      '4:30 pm': 'शाम 4.30 बजे',
      '5:00 pm': 'शाम 5 बजे',
      '5:30 pm': 'शाम 5.30 बजे',
      '6:00 pm': 'शाम 6 बजे',
      '6:30 pm': 'शाम 6.30 बजे',
      }



    var time = ''
    var date = ''
    var doctors = [];
    var appointments = [];
    var bookeddoctors = [];
    var alldoctors = [];
    var availdoctors = [];
    var time_slots = [];
    var bookedtime = [];
    var bookeddates = [];
    var availdates = [];
    var count = 0;
    var fulfillmentMessages = [];
    var timelist = []
    var success = false
    var availdoctorshin = []
    var time_slotshin = []



    switch (request.body.queryResult.action) {

        case 'input.welcome':
          if(language==='en'){
            fulfillmentText = "Hello! I'm your Doctor bot!  What do you like to do\nSet an appointment\nCancel an appointment\nShow appointments\n"
            fulfillmentMessages = [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": "Hello! I'm your Doctor bot!  What do you like to do"
                      }
                    ]
                  }
                },
                {
                  "quickReplies": {
                    "title": "Hello! I'm your Doctor bot!  What do you like to do",
                    "quickReplies": [
                      "Set an appointment",
                      "Cancel an appointment",
                      "Show appointments"
                    ]
                  },
                  "platform": "FACEBOOK"
                },
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "suggestions": {
                    "suggestions": [
                      {
                        "title": "Set an appointment"
                      },
                      {
                        "title": "Cancel an appointment"
                      },
                      {
                        "title": "Show appointments"
                      }
                    ]
                  }
                },
                {
                  "text": {
                    "text": [
                      fulfillmentText
                    ]
                  }
                }
              ]
            }
            else if(language==='hi'){
              fulfillmentText = "नमस्कार! मैं आपका डॉक्टर बॉट हूँ! आप क्या करना पसंद करते हैं\nएक अपॉइंटमेंट लें\nअपॉइंटमेंट रद्द करें\nअपॉइंटमेंट्स\n"
              fulfillmentMessages = [
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                      "simpleResponses": [
                        {
                          "textToSpeech": "नमस्कार! मैं आपका डॉक्टर बॉट हूँ! आपको क्या करना पसंद है"
                        }
                      ]
                    }
                  },
                  {
                    "quickReplies": {
                      "title": "नमस्कार! मैं आपका डॉक्टर बॉट हूँ! आपको क्या करना पसंद है",
                      "quickReplies": [
                        "एक अपॉइंटमेंट लें",
                        "अपॉइंटमेंट रद्द करें",
                        "नियुक्ति दिखाएं"
                      ]
                    },
                    "platform": "FACEBOOK"
                  },
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "suggestions": {
                      "suggestions": [
                        {
                          "title": "एक अपॉइंटमेंट लें"
                        },
                        {
                          "title": "अपॉइंटमेंट रद्द करें"
                        },
                        {
                          "title": "नियुक्ति दिखाएं"
                        }
                      ]
                    }
                  },
                  {
                    "text": {
                      "text": [
                        fulfillmentText
                      ]
                    }
                  }
                ]
              }
              response.send({
                fulfillmentText: fulfillmentText,
                fulfillmentMessages : fulfillmentMessages
            })
        
            break;

        case 'enteredChoice':
            if(params['choice']==='specialization'){
              if(language==='en'){
                fulfillmentText = 'Enter the specialization you are looking for'
              }
               else if(language==='hi'){
                fulfillmentText = 'वह विशेषज्ञता दर्ज करें जिसकी आपको तलाश है'
              } 
            }
            else if(params['choice']==='symptoms'){
              if(language==='en'){
                fulfillmentText = 'What are the symptoms you noticed?'
              }
              else if(language==='hi'){
                fulfillmentText = 'आपके द्वारा देखे गए लक्षण क्या हैं?'
              }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Choose from availale options'
              }
              else if(language==='hi'){
                fulfillmentText = 'उपलब्ध विकल्प से चुनें'
              }  
            }
            response.send({
                fulfillmentText: fulfillmentText
            })
            break;
            
        
        case 'chosenPreference':
          if(params['symptoms'].length>0){
            params['specialization'] = assign_specialization(params['symptoms'])
        }
            if( params['preference']==='date'){
              if(language==='en'){
                fulfillmentText = 'You can book appointments for next 7 days\nEnter the date\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nदिनांक दर्ज करें\n'
              }
            }
            else if( params['preference']==='time'){
              if(language==='en'){
                fulfillmentText = 'Enter the time between 10:00 am to 7:00 pm in intervals of 30 mins (Ex: 11 am, 11:30 am)\n'
              }
              else if(language==='hi'){
                fulfillmentText = '30 मिनट के अंतराल में सुबह 10:00 से शाम 7:00 बजे के बीच का समय दर्ज करें (उदा: सुबह 11 बजे, 11:30 बजे)\n'
              } 
            }
            else if( params['preference']==='doctor'){
              if(language==='en'){
                fulfillmentText = 'Enter doctor name who is a '+params['specialization']+'\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'एक डॉक्टर का नाम दर्ज करें जो एक '+getHindi[params['specialization']]+' है\n'
              }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Choose from availale options'
              }
              else if(language==='hi'){
                fulfillmentText = 'उपलब्ध विकल्प से चुनें'
              }
            }
            response.send({
                        fulfillmentText: fulfillmentText
                })
            
            break;

        case 'chosenPreferenceDate':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            if(params['preference']==='time'){
              if(language==='en'){
                fulfillmentText = 'Enter the time between 10:00 am to 7:00 pm in intervals of 30 mins (Ex: 11 am, 11:30 am)\n'
              }
              else if(language==='hi'){
                fulfillmentText = '30 मिनट के अंतराल में सुबह 10:00 से शाम 7:00 बजे के बीच का समय दर्ज करें (उदा: सुबह 11 बजे, 11:30 बजे)\n'
              } 
            }
            else if(params['preference']==='doctor'){
              if(language==='en'){
                fulfillmentText = 'Enter doctor name who is a '+params['specialization']+'\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'एक डॉक्टर का नाम दर्ज करें जो एक '+getHindi[params['specialization']]+' है\n'
              }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Choose from availale options'
              }
              else if(language==='hi'){
                fulfillmentText = 'उपलब्ध विकल्प से चुनें'
              }
            }
            response.send({
                fulfillmentText: fulfillmentText
            })
            break;

        case 'chosenPreferenceTime':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            if(params['preference']==='date'){
              if(language==='en'){
                fulfillmentText = 'You can book appointments for next 7 days\nEnter the date\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nदिनांक दर्ज करें\n'
              }
            }
            else if(params['preference']==='doctor'){
              if(language==='en'){
                fulfillmentText = 'Enter doctor name who is a '+params['specialization']+'\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'एक डॉक्टर का नाम दर्ज करें जो एक '+getHindi[params['specialization']]+' है\n'
              }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Choose from availale options'
              }
              else if(language==='hi'){
                fulfillmentText = 'उपलब्ध विकल्प से चुनें'
              }
            }
            response.send({
                fulfillmentText: fulfillmentText
            })
            break;

        case 'chosenPreferenceDoctor':
            if(params['preference']==='time'){
              if(language==='en'){
                fulfillmentText = 'Enter the time between 10:00 am to 7:00 pm in intervals of 30 mins (Ex: 11 am, 11:30 am)\n'
              }
              else if(language==='hi'){
                fulfillmentText = '30 मिनट के अंतराल में सुबह 10:00 से शाम 7:00 बजे के बीच का समय दर्ज करें (उदा: सुबह 11 बजे, 11:30 बजे)\n'
              } 
            }
            else if(params['preference']==='date'){
              if(language==='en'){
                fulfillmentText = 'You can book appointments for next 7 days\nEnter the date\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nदिनांक दर्ज करें\n'
              }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Choose from availale options'
              }
              else if(language==='hi'){
                fulfillmentText = 'उपलब्ध विकल्प से चुनें'
              }
            }
            response.send({
                fulfillmentText: fulfillmentText
            })
            break;

        case 'selectedDate':
            date = reformatDate(params['date']);
            params['date'] = date[0];
            console.log("params['date']",params['date'])
            date = currentdatetime();
            date = date[0]
            console.log("date",date)
            if(date===params['date']){
              if(language==='en'){
                fulfillmentText = 'You cannot book appointment for less than 24 hours\nEnter valid date\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते\nमान्य दिनांक दर्ज करें\n'
              }
            }
            else{
                while(count<7){
                    date = nxtday(date);
                    availdates.push(date);
                    count++;
                    }
                if(availdates.includes(params['date'])){
                  if(language==='en'){
                    fulfillmentText = 'Choose between time and doctor\n'
                    fulfillmentMessages = [
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "simpleResponses": {
                            "simpleResponses": [
                              {
                                "textToSpeech": "Choose between time and doctor."
                              }
                            ]
                          }
                        },
                        {
                          "quickReplies": {
                            "title": "Choose one",
                            "quickReplies": [
                              "Time",
                              "Doctor"
                            ]
                          },
                          "platform": "FACEBOOK"
                        },
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "suggestions": {
                            "suggestions": [
                              {
                                "title": "Time"
                              },
                              {
                                "title": "Doctor"
                              }
                            ]
                          }
                        },
                        {
                          "text": {
                            "text": [
                              "Choose between time and doctor."
                            ]
                          }
                        }
                      ]
                 }
                  else if(language==='hi'){
                    fulfillmentText = 'समय और चिकित्सक के बीच चयन करें\n'
                    fulfillmentMessages = [
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "simpleResponses": {
                            "simpleResponses": [
                              {
                                "textToSpeech": "समय और चिकित्सक के बीच चयन करें"
                              }
                            ]
                          }
                        },
                        {
                          "quickReplies": {
                            "title": "एक चुनो",
                            "quickReplies": [
                              "समय",
                              "चिकित्सक"
                            ]
                          },
                          "platform": "FACEBOOK"
                        },
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "suggestions": {
                            "suggestions": [
                              {
                                "title": "समय"
                              },
                              {
                                "title": "चिकित्सक"
                              }
                            ]
                          }
                        },
                        {
                          "text": {
                            "text": [
                              "समय और चिकित्सक के बीच चयन करें"
                            ]
                          }
                        }
                      ]
                }
                else{
                  if(language==='en'){
                    fulfillmentText = 'You can book appointments only for next 7 days\nEnter valid date\n'
                  }
                   else if(language==='hi'){
                    fulfillmentText = 'आप केवल अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nमान्य दिनांक दर्ज करें\n'
                  } 
                }
            }
          }
            response.send({
                fulfillmentText: fulfillmentText,
                fulfillmentMessages : fulfillmentMessages
            })
            break;
        
        case 'selectedTime':
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            params['time'] = time[1];
            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm'];
            range = ['10:00:00','19:00:00']
            if(isInRange(timerange, range)){
                if(time_slots.includes(params['time'])){
                  if(language==='en'){
                    fulfillmentText = 'Choose between date and doctor\n';
                    fulfillmentMessages = [
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "simpleResponses": {
                            "simpleResponses": [
                              {
                                "textToSpeech": "Choose between date and doctor."
                              }
                            ]
                          }
                        },
                        {
                          "quickReplies": {
                            "title": "Choose one",
                            "quickReplies": [
                              "Date",
                              "Doctor"
                            ]
                          },
                          "platform": "FACEBOOK"
                        },
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "suggestions": {
                            "suggestions": [
                              {
                                "title": "Date"
                              },
                              {
                                "title": "Doctor"
                              }
                            ]
                          }
                        },
                        {
                          "text": {
                            "text": [
                              "Choose between date and doctor."
                            ]
                          }
                        }
                      ]
                  }
                  else if(language==='hi'){
                    fulfillmentText = 'तारीख और चिकित्सक के बीच चयन करें\n';
                    fulfillmentMessages = [
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "simpleResponses": {
                            "simpleResponses": [
                              {
                                "textToSpeech": "तारीख और चिकित्सक के बीच चयन करें"
                              }
                            ]
                          }
                        },
                        {
                          "quickReplies": {
                            "title": "Choose one",
                            "quickReplies": [
                              "तारीख",
                              "चिकित्सक"
                            ]
                          },
                          "platform": "FACEBOOK"
                        },
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "suggestions": {
                            "suggestions": [
                              {
                                "title": "तारीख"
                              },
                              {
                                "title": "चिकित्सक"
                              }
                            ]
                          }
                        },
                        {
                          "text": {
                            "text": [
                              "तारीख और चिकित्सक के बीच चयन करें"
                            ]
                          }
                        }
                      ]
                  }
                      response.send({
                        fulfillmentText: fulfillmentText,
                        fulfillmentMessages : fulfillmentMessages
                    })
                }
                else{
                    
                      if(language==='en'){
                        fulfillmentText = 'Enter time in the interval of 30mins (Ex: 11:00 am, 11:30 am)\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = '30 मिनट के अंतराल में समय दर्ज करें (उदाहरण: सुबह 11:00 बजे, 11:30 बजे)\n'
                      }
                    response.send({
                      fulfillmentText : fulfillmentText
                    })
                }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Selected time is not within 10:00 am and 7:00 pm. Enter valid time\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'चयनित समय सुबह 10:00 बजे और शाम 7:00 बजे तक नहीं है। मान्य समय दर्ज करें\n'
              }
                response.send({
                    fulfillmentText: fulfillmentText
                })
            }
            break;

        case 'selectedDoctor':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            db.collection('doctors').where('name', '==', params['doctor']).where('specialization', '==', params['specialization']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                      if(language==='en'){
                        fulfillmentText = params['doctor']+' is not a '+params['specialization']+'.Enter appropriate doctor name\n';
                      }
                      else if(language==='hi'){
                        fulfillmentText = getHindi[params['doctor']]+' '+getHindi[params['specialization']]+' नहीं हैं। उपयुक्त चिकित्सक नाम दर्ज करें\n';
                      }
                    }
                    else{
                      if(language==='en'){
                        fulfillmentText = 'Choose between date and time\n'
                        fulfillmentMessages = [
                            {
                              "platform": "ACTIONS_ON_GOOGLE",
                              "simpleResponses": {
                                "simpleResponses": [
                                  {
                                    "textToSpeech": "Choose between time and date."
                                  }
                                ]
                              }
                            },
                            {
                              "quickReplies": {
                                "title": "Choose one",
                                "quickReplies": [
                                  "Time",
                                  "Date"
                                ]
                              },
                              "platform": "FACEBOOK"
                            },
                            {
                              "platform": "ACTIONS_ON_GOOGLE",
                              "suggestions": {
                                "suggestions": [
                                  {
                                    "title": "Time"
                                  },
                                  {
                                    "title": "Date"
                                  }
                                ]
                              }
                            },
                            {
                              "text": {
                                "text": [
                                  "Choose between time and date."
                                ]
                              }
                            }
                          ]
                      }
                      else if(language==='hi'){
                        fulfillmentText = 'तारीख और समय के बीच चुनें\n'
                        fulfillmentMessages = [
                            {
                              "platform": "ACTIONS_ON_GOOGLE",
                              "simpleResponses": {
                                "simpleResponses": [
                                  {
                                    "textToSpeech": "तारीख और समय के बीच चुनें"
                                  }
                                ]
                              }
                            },
                            {
                              "quickReplies": {
                                "title": "एक चुनो",
                                "quickReplies": [
                                  "समय",
                                  "तारीख"
                                ]
                              },
                              "platform": "FACEBOOK"
                            },
                            {
                              "platform": "ACTIONS_ON_GOOGLE",
                              "suggestions": {
                                "suggestions": [
                                  {
                                    "title": "समय"
                                  },
                                  {
                                    "title": "तारीख"
                                  }
                                ]
                              }
                            },
                            {
                              "text": {
                                "text": [
                                  "तारीख और समय के बीच चुनें"
                                ]
                              }
                            }
                          ]
                      }
                        
                    }
                    response.send({
                        fulfillmentText: fulfillmentText,
                        fulfillmentMessages : fulfillmentMessages
                    })
                    return null;
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
            break;

        case 'selectedTimeDate':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            range = ['00:00:00',  currentdatetime()[1]]
            if(params['date']===nxtday(currentdatetime()[0]) && isInRange(timerange, range)){
              if(language==='en'){
                fulfillmentText = 'You cannot book appointment for less than 24hours. Enter valid date\nYou can change the time by entering new time\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते। मान्य दिनांक दर्ज करें\nमान्य दिनांक दर्ज करें'
              }
                response.send({
                    fulfillmentText: fulfillmentText
                })
            }
            else{
            date = time[0]
            count = 0
            while(count<7){
                date = nxtday(date);
                availdates.push(date);
                count++;
                }
            if(availdates.includes(params['date'])){
                db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).where('specialization', '==', params['specialization']).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("no appointments")
                
                }  
                else{
                snapshot.forEach((doc) => { appointments.push(doc.data()) });
                appointments.forEach((appointment) => { bookeddoctors.push(appointment['doctor']) });
                console.log("bookeddoctors: ",bookeddoctors)
                }
                db.collection('doctors').where('specialization', '==', params['specialization']).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                          if(language==='en'){
                            fulfillmentText = 'No doctors available in this field\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = 'इस क्षेत्र में कोई डॉक्टर उपलब्ध नहीं हैं\n'
                          }
                        }
                        else{
                        snapshot.forEach((doc) => { doctors.push(doc.data()) });
                        doctors.forEach((doctor) => { alldoctors.push(doctor['name']) });
                        console.log("alldoctors: ",alldoctors)
                        availdoctors = alldoctors.slice();
                        bookeddoctors.forEach((doctor, index)=>{
                            availdoctors = arrayRemove(availdoctors, doctor)
                            console.log("availdoctors: ",availdoctors)
                        })
                        console.log("availdoctors: ",availdoctors)
                        availdoctors.forEach((doctor, index)=>{
                          if(language==='en'){
                            fulfillmentText += doctor +'\n';
                            timelist.push({
                                "title": doctor
                              })
                          }
                          else if(language==='hi'){
                            availdoctorshin.push(getHindi[doctor])
                            fulfillmentText += getHindi[doctor] +'\n';
                            timelist.push({
                                "title": getHindi[doctor]
                              })
                          } 
                        })
                        if(fulfillmentText === ''){
                          if(language==='en'){
                            fulfillmentText = 'No doctor available on '+ params['date']+' at '+params['time']+'\nEnter different date\n';
                          }
                          else if(language==='hi'){
                            fulfillmentText = 'कोई भी डॉक्टर '+ params['date']+' को '+getHindi[params['time']]+' उपलब्ध नहीं है\nअलग तारीख डालें\n';
                          }
                            success = false
                        }
                        else{
                          if(language==='en'){
                            fulfillmentText += 'Enter doctor name of your choice from above\n';
                          }
                          else if(language==='hi'){
                            fulfillmentText += 'ऊपर से अपनी पसंद का डॉक्टर नाम दर्ज करें\n';
                          }
                            success = true
                        }

                        if(success){
                          if(language==='en'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "Choose your doctor"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "Choose your doctor",
                                  "quickReplies": availdoctors
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                          else if(language==='hi'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "अपने डॉक्टर को चुनें"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "अपने डॉक्टर को चुनें",
                                  "quickReplies": availdoctorshin
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                        }
                        
                        console.log("fulfillmentText: ",fulfillmentText)
                        }
                        response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        })
                        
                        return null;
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                    return null;
                })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            }
            else{
              if(language==='en'){
                fulfillmentText = 'You can book appointments only for next 7 days\nEnter valid date\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'आप केवल अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nमान्य दिनांक दर्ज करें\n'
              }
                response.send({
                    fulfillmentText : fulfillmentText
                })
                
            }
            
        }
            break;

        case 'selectedDoctorDate':
            date = reformatDate(params['date']);
            params['date'] = date[0];
            date = currentdatetime();
            date = date[0]
            console.log("date",date)
                        db.collection('appointments').where('date', '==', params['date']).where('doctor', '==', params['doctor']).get()
                        .then(snapshot => {
                            console.log('database')
                            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm'];
                            console.log(time_slots)
                            date = currentdatetime();
                            date = date[0]
                            time = date[1]
                            var availtimes = time_slots.slice()
                            if(params['date']===nxtday(date)){
                                time_slots.forEach((time, index) => {
                                    range = ['00:00:00',  currentdatetime()[1]]
                                    if(isInRange(convertTime12to24(time), range)){
                                        availtimes = arrayRemove(availtimes, time)
                                    }
                                })
                            }
                            time_slots = availtimes.slice()
                            console.log('time_slots',time_slots)
                        if (snapshot.empty) {
                            time_slots.forEach((time, index) => {
                                fulfillmentText += time + '\n';
                                timelist.push({
                                    "title": time
                                  })
                                
                            })
                            if(language==='en'){
                              fulfillmentText += 'Choose time from available time above:\n'
                            }
                            else if(language==='hi'){
                              fulfillmentText += 'ऊपर उपलब्ध समय से समय चुनें:\n'
                            }
                            success = true
                            
                        }  
                        else{
                            snapshot.forEach((doc) => { appointments.push(doc.data()) });
                            appointments.forEach((appointment) => { bookedtime.push(appointment['time']) });
                            console.log("bookedtime: ",bookedtime)
                        
                        bookedtime.forEach((time) => {
                            time_slots = arrayRemove(time_slots, time); 
                        })
                        
                        time_slots.forEach((time, index) => {
                          if(language==='en'){
                            fulfillmentText += time + '\n';
                            timelist.push({
                                "title": time
                              })
                          }
                          else if(language==='hi'){
                            time_slotshin.push(getHindi[time])
                            fulfillmentText += getHindi[time] + '\n';
                            timelist.push({
                                "title": getHindi[time]
                              })
                          }
                            
                        })
                        
                        if(fulfillmentText === ''){
                          if(language==='hi'){
                            fulfillmentText = getHindi[params['doctor']]+' के पास '+params['date']+' का कोई समय उपलब्ध नहीं है अलग तारीख चुनें:\n';
                          }
                          else if(language==='en'){
                            fulfillmentText = params['doctor']+' has no time slot available on '+params['date']+'Choose different date:\n';
                          }
                            success = false
                        }
                        else{
                          if(language==='en'){
                            fulfillmentText += 'Choose time from available time above:\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText += 'ऊपर उपलब्ध समय से समय चुनें:\n'
                          }
                            console.log('choose')
                            success = true
                        }
                    }
                    
                    date = currentdatetime();
                    date = date[0]
                    while(count<7){
                    date = nxtday(date);
                    availdates.push(date);
                    count++;
                    }
                    if(!availdates.includes(params['date'])){
                      if(language==='en'){
                        fulfillmentText = 'You can book appointments only for next 7 days\nEnter valid date\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = 'आप केवल अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nमान्य दिनांक दर्ज करें\n'
                      }
                        success = false
                    }
                    date = currentdatetime();
                    date = date[0]
                    if(date===params['date']){
                      if(language==='en'){
                        fulfillmentText = 'You cannot book appointment for less than 24 hours\nEnter valid date\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते\nमान्य दिनांक दर्ज करें\n'
                      }  
                      success = false
                }
                if(success){
                  if(language==='en'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "Choose your time"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "Choose one",
                          "quickReplies": time_slots
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                  else if(language==='hi'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "अपना समय चुनें"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "एक चुनो",
                          "quickReplies": time_slotshin
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                }
                    response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        
                        })
                        
                        return null;
                        })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
            break;

        case 'selectedTimeDoctor':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            time = reformatDate(params['time']);
            params['time'] = time[1];
            date = time[0];
            db.collection('appointments').where('doctor', '==', params['doctor']).where('time', '==', params['time']).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("no appointments")
                
                }  
                else{
                snapshot.forEach((doc) => { appointments.push(doc.data()) });
                appointments.forEach((appointment) => { bookeddates.push(appointment['date']) });
                console.log("bookeddates: ",bookeddates)
                }
                date = nxtday(date)
                count = 0
                while(count<7){
                    if(bookeddates.includes(date)){
                        date = nxtday(date)
                        count++
                    }
                    else{
                        console.log(date)
                        availdates.push(date)
                        date = nxtday(date)
                        count++
                    }
                }
                db.collection('doctors').where('name', '==', params['doctor']).where('specialization', '==', params['specialization']).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                          if(language==='en'){
                            fulfillmentText = params['doctor']+' is not a '+params['specialization']+'. Enter a valid doctor name\n';
                          }
                          else if(language==='hi'){
                            fulfillmentText = getHindi[params['doctor']]+' '+getHindi[params['specialization']]+' नहीं हैं।. उपयुक्त चिकित्सक नाम दर्ज करें\n';
                          }
                            
                        }
                        else{
                          if(language==='en'){
                            fulfillmentText = params['doctor']+' at '+params['time']+' is available on:\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = getHindi[params['time']]+' '+getHindi[params['doctor']]+'निम्नलिखित तारीखों में उपलब्ध हैं\n'
                          } 
                            availdates.forEach((date)=>{
                                fulfillmentText += date+"\n"
                                timelist.push({
                                    "title": date
                                  })
                            })
                            success = true
                        }
                        if(success){
                          if(language==='en'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "Choose your date"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "Choose your date",
                                  "quickReplies": availdates
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                          else if(language==='hi'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "अपनी दिनांक चुनें।"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "अपनी दिनांक चुनें।",
                                  "quickReplies": availdates
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                            }
                        response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        });
                        return null;
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                
                return null;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            break;

        case 'selectedDateDoctor':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            date = reformatDate(params['date']);
            params['date'] = date[0];
            db.collection('appointments').where('date', '==', params['date']).where('doctor', '==', params['doctor']).get()
            .then(snapshot => {
                time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm'];
                console.log(time_slots)
                date = currentdatetime();
                date = date[0]
                time = date[1]
                var currenttime = currentdatetime()[1]
                var availtimes = time_slots.slice()
                if(params['date']===nxtday(date)){
                    time_slots.forEach((time, index) => {
                        range = ['00:00:00',  currenttime]
                        if(isInRange(convertTime12to24(time), range)){
                            availtimes = arrayRemove(availtimes, time)
                        }
                    })
                }
                time_slots = availtimes.slice()
                console.log('time_slots',time_slots)
                if (snapshot.empty) {
                  console.log('snapshot empty')
                    db.collection('doctors').where('name', '==', params['doctor']).where('specialization', '==', params['specialization']).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                          if(language==='en'){
                            fulfillmentText = params['doctor']+' is not a '+params['specialization']+'. Enter a valid doctor name\n';
                          }
                          else if(language==='hi'){
                            fulfillmentText = getHindi[params['doctor']]+' '+getHindi[params['specialization']]+' नहीं हैं।. उपयुक्त चिकित्सक नाम दर्ज करें\n';
                          }
                        }
                        else{
                          if(language==='en'){
                            fulfillmentText = params['doctor']+' on '+params['date']+' is available at:\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = params['date']+' को '+getHindi[params['doctor']]+' निम्नलिखित समय पर उपलब्ध हैं\n'
                          }
                              
                            time_slots.forEach((time)=>{
                              if(language==='en'){
                                fulfillmentText += time+"\n"
                                timelist.push({
                                  "title": time
                                })
                              }
                              else if(language==='hi'){
                                time_slotshin.push(getHindi[time])
                                fulfillmentText += getHindi[time]+"\n"
                                timelist.push({
                                  "title": getHindi[time]
                                })
                              }
                                
                            })
                            if(language==='en'){
                              fulfillmentText += 'Choose time from available time above:\n'
                            }
                            else if(language==='hi'){
                              fulfillmentText += 'ऊपर उपलब्ध समय से समय चुनें'
                            }
                            success = true
                        }
                        if(success){
                          if(language==='en'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "Choose your time"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "Choose your time",
                                  "quickReplies": time_slots
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                          else if(language==='hi'){
                            fulfillmentMessages = [
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "simpleResponses": {
                                  "simpleResponses": [
                                    {
                                      "textToSpeech": "अपना समय चुनें"
                                    }
                                  ]
                                }
                              },
                              {
                                "quickReplies": {
                                  "title": "एक चुनो",
                                  "quickReplies": time_slotshin
                                },
                                "platform": "FACEBOOK"
                              },
                              {
                                "platform": "ACTIONS_ON_GOOGLE",
                                "suggestions": {
                                  "suggestions": timelist
                                }
                              },
                              {
                                "text": {
                                  "text": [
                                    fulfillmentText
                                  ]
                                }
                              }
                            ]
                          }
                            
                            }
                        response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        });
                        return null;
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                }  
                else{
                    console.log('snapshot not empty')
                    snapshot.forEach((doc) => { appointments.push(doc.data()) });
                    appointments.forEach((appointment) => { bookedtime.push(appointment['time']) });
                    console.log("bookedtime: ",bookedtime)
                    console.log(appointments[0]['specialization'])
                    bookedtime.forEach((time) => {
                    time_slots = arrayRemove(time_slots, time);
                    console.log(time_slots) 
                })
                if(time_slots.length<1){
                  if(language==='en'){
                    fulfillmentText = params['doctor']+' has no time available on '+params['date']+'\nEnter other '+parmas['specialization']+'(you can change date by entering new date)\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText = getHindi[params['doctor']]+' के पास '+params['date']+' को कोई समय उपलब्ध नहीं है\nअन्य '+getHindi[params['specialization']]+' दर्ज करें (आप नई तारीख दर्ज करके तारीख बदल सकते हैं)\n'
                  }
                }
                else{
                  if(language==='en'){
                    fulfillmentText = params['doctor']+' on '+params['date']+' is available at:\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText =  getHindi[params['doctor']]+params['date']+' को निम्नलिखित समय पर उपलब्ध हैं\n'
                  }
                      
                    time_slots.forEach((time)=>{
                      if(language==='en'){
                        fulfillmentText += time+"\n"
                        timelist.push({
                            "title": time
                          })
                      }
                      else if(language==='hi'){
                        time_slotshin.push(getHindi[time])
                        fulfillmentText += getHindi[time]+"\n"
                        timelist.push({
                            "title": getHindi[time]
                          })
                      }
                        
                    })
                    if(language==='en'){
                      fulfillmentText += 'Choose time from available time above:\n'
                    }
                    else if(language==='hi'){
                      fulfillmentText += 'ऊपर उपलब्ध समय से समय चुनें:\n'
                    }
                    
                    success = true
                }
                console.log("params['specialization']",params['specialization'])
                console.log("appointments[0]['specialization']",appointments[0]['specialization'])
                if (params['specialization']!==appointments[0]['specialization']) {
                  if(language==='en'){
                    fulfillmentText = params['doctor']+' is not a '+params['specialization']+'.Enter appropriate doctor name\n';
                  }
                  else if(language==='hi'){
                    fulfillmentText = getHindi[params['doctor']]+' '+getHindi[params['specialization']]+' नहीं हैं उपयुक्त चिकित्सक नाम दर्ज करें\n'
                  }
                    
                    success = false
                }
                if(success){
                  if(language==='en'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "Choose your time"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "Choose your time",
                          "quickReplies": time_slots
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                  else if(language==='hi'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "अपना समय चुनें"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "एक चुनो",
                          "quickReplies": time_slotshin
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                    
                    }
                response.send({
                    fulfillmentText: fulfillmentText,
                    fulfillmentMessages : fulfillmentMessages
                });
            }
                return null;
                })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            break;
        
        case 'selectedDateTime':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            console.log("params['specialization']",params['specialization'])
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            range = ['10:00:00', '19:00:00']
            console.log(currentdatetime()[0])
            console.log(time[0])
            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm']; 
            if(isInRange(timerange, range)){
                range = ['00:00:00',  currentdatetime()[1]]
                if(!(params['date']===nxtday(currentdatetime()[0]) && isInRange(timerange, range))){
                    if(time_slots.includes(params['time'])){
                        db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).where('specialization', '==', params['specialization']).get()
                        .then(snapshot => {
                            if (snapshot.empty) {
                                console.log("no appointments")
                            
                            }  
                            else{
                            snapshot.forEach((doc) => { appointments.push(doc.data()) });
                            appointments.forEach((appointment) => { bookeddoctors.push(appointment['doctor']) });
                            console.log("bookeddoctors: ",bookeddoctors)
                            }
                            db.collection('doctors').where('specialization', '==', params['specialization']).get()
                                .then(snapshot => {
                                    if (snapshot.empty) {
                                      if(language==='en'){
                                        fulfillmentText = 'No doctors available in this field\n'
                                      }
                                      else if(language==='hi'){
                                        fulfillmentText = 'इस क्षेत्र में कोई डॉक्टर उपलब्ध नहीं हैं\n'
                                      }
                                       
                                        
                                    }
                                    else{
                                    snapshot.forEach((doc) => { doctors.push(doc.data()) });
                                    doctors.forEach((doctor) => { alldoctors.push(doctor['name']) });
                                    console.log("alldoctors: ",alldoctors)
                                    availdoctors = alldoctors.slice();
                                    bookeddoctors.forEach((doctor, index)=>{
                                        availdoctors = arrayRemove(availdoctors, doctor)
                                        console.log("availdoctors: ",availdoctors)
                                    })
                                    console.log("availdoctors: ",availdoctors)
                                    availdoctors.forEach((doctor, index)=>{
                                      if(language==='en'){
                                        fulfillmentText += doctor +'\n';
                                        timelist.push({
                                            "title": doctor
                                          })
                                      }
                                      else if(language==='hi'){
                                        availdoctorshin.push(getHindi[doctor])
                                        fulfillmentText += getHindi[doctor] +'\n'
                                        timelist.push({
                                            "title": getHindi[doctor]
                                          })
                                      }
                                    })
                                    if(fulfillmentText === ''){
                                      if(language==='en'){
                                        fulfillmentText = 'No doctor available on '+ params['date']+' at '+params['time']+'\nEnter different time\n';
                                      }
                                      else if(language==='hi'){
                                        fulfillmentText = getHindi[params['time']]+' '+params['date']+' पर कोई डॉक्टर उपलब्ध नहीं है\nअलग समय दर्ज करें'
                                      }
                                        
                                    }
                                    else{
                                      if(language==='en'){
                                        fulfillmentText += 'Enter doctor name of your choice from above\n';
                                      }
                                      else if(language==='hi'){
                                        fulfillmentText += 'ऊपर से अपनी पसंद का डॉक्टर नाम दर्ज करें\n';
                                      }
                                        
                                        success = true
                                    }
                                    
                                    console.log("fulfillmentText: ",fulfillmentText)
                                    }
                                    if(success){
                                      if(language==='en'){
                                        fulfillmentMessages = [
                                          {
                                            "platform": "ACTIONS_ON_GOOGLE",
                                            "simpleResponses": {
                                              "simpleResponses": [
                                                {
                                                  "textToSpeech": "Choose your doctor"
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "quickReplies": {
                                              "title": "Choose your doctor",
                                              "quickReplies": availdoctors
                                            },
                                            "platform": "FACEBOOK"
                                          },
                                          {
                                            "platform": "ACTIONS_ON_GOOGLE",
                                            "suggestions": {
                                              "suggestions": timelist
                                            }
                                          },
                                          {
                                            "text": {
                                              "text": [
                                                fulfillmentText
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                      else if(language==='hi'){
                                        fulfillmentMessages = [
                                          {
                                            "platform": "ACTIONS_ON_GOOGLE",
                                            "simpleResponses": {
                                              "simpleResponses": [
                                                {
                                                  "textToSpeech": "अपने डॉक्टर को चुनें"
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "quickReplies": {
                                              "title": "अपने डॉक्टर को चुनें",
                                              "quickReplies": availdoctorshin
                                            },
                                            "platform": "FACEBOOK"
                                          },
                                          {
                                            "platform": "ACTIONS_ON_GOOGLE",
                                            "suggestions": {
                                              "suggestions": timelist
                                            }
                                          },
                                          {
                                            "text": {
                                              "text": [
                                                fulfillmentText
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                        
                                        }
                                    response.send({
                                        fulfillmentText: fulfillmentText,
                                        fulfillmentMessages : fulfillmentMessages
                                    })
                                    return null;
                                })
                                .catch(err => {
                                    console.log('Error getting documents', err);
                                });
                                return null;
                            })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
                    }
                    else{
                      if(language==='en'){
                        fulfillmentText = 'Enter time in the interval of 30mins (Ex: 11:00 am, 11:30 am)\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = '30 मिनट के अंतराल में समय दर्ज करें (पूर्व: सुबह 11:00 बजे, 11:30 बजे)\n'
                      }
                        response.send({
                            fulfillmentText: fulfillmentText
                        })
                    }
                    }
                else{
                  if(language==='en'){
                    fulfillmentText = 'You cannot book appointment for less than 24hours.\n Enter appropriate time( You can also change your date by entering new date)\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते।\nउचित समय दर्ज करें (नई तारीख डालकर आप अपनी तारीख भी बदल सकते हैं)\n'
                  }
                    response.send({
                        fulfillmentText: fulfillmentText
                    })
                }
                }
            else{
              if(language==='en'){
                fulfillmentText = 'Selected time is not within 10:00 am and 7:00 pm. Enter valid time\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'चयनित समय सुबह 10:00 बजे और शाम 7:00 बजे तक नहीं है। मान्य समय दर्ज करें\n'
              }
                response.send({
                    fulfillmentText: fulfillmentText
                })
            }
            
            
            break;

        case 'selectedDoctorTime':
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            params['time'] = time[1];
            var nextdate = time[0];
            range = ['10:00:00', '19:00:00']
            console.log('date',date)
            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm']; 
            if(isInRange(timerange, range)){
                range = ['00:00:00',  currentdatetime()[1]]
                if(!(params['date']===nxtday(currentdatetime()[0]) && isInRange(timerange, range))){
                    if(time_slots.includes(params['time'])){
                        db.collection('appointments').where('doctor', '==', params['doctor']).where('time', '==', params['time']).get()
                            .then(snapshot => {
                                if (snapshot.empty) {
                                    console.log("no appointments")
                                
                                }  
                                else{
                                snapshot.forEach((doc) => { appointments.push(doc.data()) });
                                appointments.forEach((appointment) => { bookeddates.push(appointment['date']) });
                                console.log("bookeddates: ",bookeddates)
                                }
                                nextdate = nxtday(nextdate)
                                count = 0
                                while(count<7){
                                    if(bookeddates.includes(nextdate)){
                                        nextdate = nxtday(nextdate)
                                        count++
                                    }
                                    else{
                                        console.log(date)
                                        availdates.push(nextdate)
                                        nextdate = nxtday(nextdate)
                                        count++
                                    }
                                }
                                if(language==='en'){
                                  fulfillmentText = params['doctor']+' at '+params['time']+' is available on:\n'  
                                }
                                else if(language==='hi'){
                                  fulfillmentText = getHindi[params['time']]+' '+getHindi[params['doctor']]+' निम्नलिखित तिथियों पर उपलब्ध हैं\n'
                                }
                                
                                availdates.forEach((date)=>{
                                    fulfillmentText += date+"\n"
                                    timelist.push({
                                        "title": date
                                      })
                                })
                                success = true
                                if(success){
                                  if(language==='en'){
                                    fulfillmentMessages = [
                                      {
                                        "platform": "ACTIONS_ON_GOOGLE",
                                        "simpleResponses": {
                                          "simpleResponses": [
                                            {
                                              "textToSpeech": "Choose your date"
                                            }
                                          ]
                                        }
                                      },
                                      {
                                        "quickReplies": {
                                          "title": "Choose your date",
                                          "quickReplies": availdates
                                        },
                                        "platform": "FACEBOOK"
                                      },
                                      {
                                        "platform": "ACTIONS_ON_GOOGLE",
                                        "suggestions": {
                                          "suggestions": timelist
                                        }
                                      },
                                      {
                                        "text": {
                                          "text": [
                                            fulfillmentText
                                          ]
                                        }
                                      }
                                    ]
                                  }
                                  else if(language==='hi'){
                                    fulfillmentMessages = [
                                      {
                                        "platform": "ACTIONS_ON_GOOGLE",
                                        "simpleResponses": {
                                          "simpleResponses": [
                                            {
                                              "textToSpeech": "अपनी दिनांक चुनें।"
                                            }
                                          ]
                                        }
                                      },
                                      {
                                        "quickReplies": {
                                          "title": "अपनी दिनांक चुनें।",
                                          "quickReplies": availdates
                                        },
                                        "platform": "FACEBOOK"
                                      },
                                      {
                                        "platform": "ACTIONS_ON_GOOGLE",
                                        "suggestions": {
                                          "suggestions": timelist
                                        }
                                      },
                                      {
                                        "text": {
                                          "text": [
                                            fulfillmentText
                                          ]
                                        }
                                      }
                                    ]
                                  }
                                    
                                    }
                                response.send({
                                    fulfillmentText: fulfillmentText,
                                    fulfillmentMessages : fulfillmentMessages
                                });
                                return null;
                            })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                    }
                    else{
                      if(language==='en'){
                        fulfillmentText = 'Enter time in the interval of 30mins (Ex: 11:00 am, 11:30 am)\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = '30 मिनट के अंतराल में समय दर्ज करें (पूर्व: सुबह 11:00 बजे, 11:30 बजे)\n'
                      }
                        response.send({
                            fulfillmentText: fulfillmentText
                        })
                    }
                }
                else{
                  if(language==='en'){
                    fulfillmentText = 'You cannot book appointment for less than 24hours.\n Enter appropriate time( You can also change your date by entering new date)\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते।\nउचित समय दर्ज करें (नई तारीख डालकर आप अपनी तारीख भी बदल सकते हैं)\n'
                  }
                    response.send({
                        fulfillmentText: fulfillmentText
                    })
                }
            }
            else{
              if(language==='en'){
                fulfillmentText = 'Selected time is not within 10:00 am and 7:00 pm. Enter valid time\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'चयनित समय सुबह 10:00 बजे और शाम 7:00 बजे तक नहीं है। मान्य समय दर्ज करें\n'
              }
                response.send({
                    fulfillmentText: fulfillmentText
                })
            }
            break;

        case 'selectedDateTimeDoctor':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).where('specialization', '==', params['specialization']).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("no appointments")
                
                }  
                else{
                snapshot.forEach((doc) => { appointments.push(doc.data()) });
                appointments.forEach((appointment) => { bookeddoctors.push(appointment['doctor']) });
                console.log("bookeddoctors: ",bookeddoctors)
                }
                db.collection('doctors').where('specialization', '==', params['specialization']).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                          if(language==='en'){
                            fulfillmentText = 'No doctors available in this field\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = 'इस क्षेत्र में कोई डॉक्टर उपलब्ध नहीं हैं\n'
                          }
                            
                        
                        }
                        else{
                        snapshot.forEach((doc) => { doctors.push(doc.data()) });
                        doctors.forEach((doctor) => { alldoctors.push(doctor['name']) });
                        console.log("alldoctors: ",alldoctors)
                        availdoctors = alldoctors.slice();
                        bookeddoctors.forEach((doctor, index)=>{
                            availdoctors = arrayRemove(availdoctors, doctor)
                            console.log("availdoctors: ",availdoctors)
                        })
                        console.log("availdoctors: ",availdoctors)
                        if(availdoctors.includes(params['doctor'])){
                          if(language==='en'){
                            fulfillmentText = 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\nEnter yes to confirm else enter no\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\nहाँ या नहीं दर्ज करें\n'
                          }
                            
                            success = true
                            if(success){
                              if(language==='en'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n',
                                      "quickReplies": ['Yes', 'No']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'Yes'
                                      },
                                      {
                                          'title':'No'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                              else if(language==='hi'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n',
                                      "quickReplies": ['हाँ', 'नहीं']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'हाँ'
                                      },
                                      {
                                          'title':'नहीं'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                                
                                }
                        }
                        else{
                            if(alldoctors.includes(params['doctor'])){
                              if(language==='en'){
                                fulfillmentText = params['doctor']+' is not available on '+params['date']+' at '+params['time']+'\n'
                              }
                              else if(language==='hi'){
                                fulfillmentText = getHindi[params['doctor']]+' '+params['date']+' को '+getHindi[params['time']]+' उपलब्ध नहीं हैं\n'
                              }
                                
                            }
                            else{
                              if(language==='en'){
                                fulfillmentText = params['doctor']+' is not a '+params['specialization']+'\n'
                              }
                              else if(language==='hi'){
                                fulfillmentText = getHindi[params['doctor']]+' '+getHindi[params['specialization']]+' नहीं हैं\n'
                              }
                                
                            }
                            if(availdoctors.length<1){
                              if(language==='en'){
                                fulfillmentText = 'No doctor available on '+ params['date']+' at '+params['time']+'\nEnter different time\n';
                              }
                              else if(language==='hi'){
                                fulfillmentText = params['date']+' को '+getHindi[params['time']]+' कोई डॉक्टर उपलब्ध नहीं है\nअलग समय दर्ज करें\n'
                              }
                                
                            }
                            else{
                                availdoctors.forEach((doctor, index)=>{
                                  if(language==='en'){
                                    fulfillmentText += doctor +'\n';
                                    timelist.push({
                                        "title": doctor
                                      })
                                  }
                                  else if(language==='hi'){
                                    availdoctorshin.push(getHindi[doctor])
                                    fulfillmentText += getHindi[doctor] +'\n';
                                    timelist.push({
                                        "title": getHindi[doctor]
                                      })
                                  }
                                    
                                })
                                if(language==='en'){
                                  fulfillmentText += 'Choose from given list:\n'
                                }
                                else if(language==='hi'){
                                  fulfillmentText += 'दी गई सूची में से चुनें:\n'
                                }
                                 
                                success = true
                            }
                            if(success){
                              if(language==='en'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": "Choose your doctor"
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": "Choose your doctor",
                                      "quickReplies": availdoctors
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": timelist
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                              else if(language==='hi'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": "अपने डॉक्टर को चुनें"
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": "अपने डॉक्टर को चुनें",
                                      "quickReplies": availdoctorshin
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": timelist
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                                
                                }
                            
                        }
                        
                        
                        console.log("fulfillmentText: ",fulfillmentText)
                        }
                        response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        })
                        return null;
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                    return null;
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
            break;

        case 'selectedDateDoctorTime':
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            range = ['10:00:00', '19:00:00']
            console.log('currentdate',currentdatetime()[0])
            console.log('24date',time[0])
            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm']; 
            if(isInRange(timerange, range)){
                range = ['00:00:00',  currentdatetime()[1]]
                if(!(params['date']===nxtday(currentdatetime()[0]) && isInRange(timerange, range))){
                    if(time_slots.includes(params['time'])){
                        db.collection('appointments').where('date', '==', params['date']).where('doctor', '==', params['doctor']).get()
                        .then(snapshot => {
                            time_slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm'];
                            console.log(time_slots)
                            date = currentdatetime();
                            date = date[0]
                            time = date[1]
                            var availtimes = time_slots.slice()
                            if(params['date']===nxtday(date)){
                                time_slots.forEach((time, index) => {
                                    range = ['00:00:00',  currentdatetime()[1]]
                                    if(isInRange(convertTime12to24(time), range)){
                                        availtimes = arrayRemove(availtimes, time)
                                    }
                                })
                            }
                            time_slots = availtimes.slice()
                            console.log('time_slots',time_slots)
                        if (snapshot.empty) {
                            console.log('no appointments')
                        }  
                        else{
                            snapshot.forEach((doc) => { appointments.push(doc.data()) });
                            appointments.forEach((appointment) => { bookedtime.push(appointment['time']) });
                            console.log("bookedtime: ",bookedtime)
                        
                        bookedtime.forEach((time) => {
                            time_slots = arrayRemove(time_slots, time); 
                        })
                    }
                        if(time_slots.includes(params['time'])){
                          if(language==='en'){
                            fulfillmentText = 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\nEnter yes to confirm else enter no\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\nहाँ या नहीं दर्ज करें\n'
                          }
                            
                            success = true
                            if(success){
                              if(language==='en'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n',
                                      "quickReplies": ['Yes', 'No']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'Yes'
                                      },
                                      {
                                          'title':'No'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                              else if(language==='hi'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n',
                                      "quickReplies": ['हाँ', 'नहीं']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'हाँ'
                                      },
                                      {
                                          'title':'नहीं'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                                
                                }
                        }
                        else{
                          if(language==='en'){
                            fulfillmentText = params['time']+' is already booked. Choose from available time\n'
                          }
                          else if(language==='hi'){
                            fulfillmentText = getHindi[params['time']]+' से बुकिंग है। उपलब्ध समय से चुनें\n'
                          }
                            
                            time_slots.forEach((time, index) => {
                              if(language==='en'){
                                fulfillmentText += time + '\n';
                                timelist.push({
                                    "title": time
                                  })
                              }
                              else if(language==='hi'){
                                time_slotshin.push(getHindi[time])
                                fulfillmentText += getHindi[time] + '\n';
                                timelist.push({
                                    "title": getHindi[time]
                                  })
                              }
                              })
                            success = true
                            if(success){
                              if(language==='en'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": "Choose your time"
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": "Choose your time",
                                      "quickReplies": time_slots
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": timelist
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                              else if(language==='hi'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": "अपना समय चुनें"
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": "अपना समय चुनें",
                                      "quickReplies": time_slotshin
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": timelist
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                                
                                }
                        }
                    
                    response.send({
                            fulfillmentText: fulfillmentText,
                            fulfillmentMessages : fulfillmentMessages
                        })
                        
                        return null;
                        })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                    }
                    else{
                      if(language==='en'){
                        fulfillmentText = 'Enter time in the interval of 30mins (Ex: 11:00 am, 11:30 am)\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = '30 मिनट के अंतराल में समय दर्ज करें (पूर्व: सुबह 11:00 बजे, 11:30 बजे)\n'
                      }
                        response.send({
                            fulfillmentText: fulfillmentText
                        })
                    }
                    }
                else{
                  if(language==='en'){
                    fulfillmentText = 'You cannot book appointment for less than 24hours.\n Enter appropriate time( You can also change your date by entering new date)\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते।\nउचित समय दर्ज करें (नई तारीख डालकर आप अपनी तारीख भी बदल सकते हैं)\n'
                  }
                    response.send({
                        fulfillmentText: fulfillmentText
                    })
                }
                }
            else{
              if(language==='en'){
                fulfillmentText = 'Selected time is not within 10:00 am and 7:00 pm. Enter valid time\n'
              }
              else if(language==='hi'){
                fulfillmentText = 'चयनित समय सुबह 10:00 बजे और शाम 7:00 बजे तक नहीं है। मान्य समय दर्ज करें\n'
              }
                response.send({
                    fulfillmentText: fulfillmentText
                })
            }
            break;

        case 'selectedDoctorTimeDate':
            timerange = params['time'].split('T')[1].split('+')[0]
            time = reformatDate(params['time']);
            params['time'] = time[1];
            date = reformatDate(params['date']);
            params['date'] = date[0];
            
            range = ['00:00:00',  currentdatetime()[1]]
            if(!(params['date']===nxtday(currentdatetime()[0]) && isInRange(timerange, range))){
            db.collection('appointments').where('doctor', '==', params['doctor']).where('time', '==', params['time']).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("no appointments")
                
                }  
                else{
                snapshot.forEach((doc) => { appointments.push(doc.data()) });
                appointments.forEach((appointment) => { bookeddates.push(appointment['date']) });
                console.log("bookeddates: ",bookeddates)
                }
                date = time[0];
                date = nxtday(date)
                var count = 0
                while(count<7){
                    if(bookeddates.includes(date)){
                        date = nxtday(date)
                        count++
                    }
                    else{
                        console.log(date)
                        availdates.push(date)
                        date = nxtday(date)
                        count++
                    }
                }
                if(availdates.includes(params['date'])){
                  if(language==='en'){
                    fulfillmentText = 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\nEnter yes to confirm else enter no\n'
                  }
                  else if(language==='hi'){
                    fulfillmentText = 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\nहाँ या नहीं दर्ज करें\n'
                  }
                    success = true
                            if(success){
                              if(language==='en'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'You want to book appointment with '+params['doctor']+' on '+params['date']+' at '+params['time']+'\n',
                                      "quickReplies": ['Yes', 'No']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'Yes'
                                      },
                                      {
                                          'title':'No'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                              else if(language==='hi'){
                                fulfillmentMessages = [
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "simpleResponses": {
                                      "simpleResponses": [
                                        {
                                          "textToSpeech": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n'
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "quickReplies": {
                                      "title": 'आप '+getHindi[params['doctor']]+' के साथ '+params['date']+' को '+getHindi[params['time']]+' अपॉइंटमेंट बुक करना चाहते हैं\n',
                                      "quickReplies": ['हाँ', 'नहीं']
                                    },
                                    "platform": "FACEBOOK"
                                  },
                                  {
                                    "platform": "ACTIONS_ON_GOOGLE",
                                    "suggestions": {
                                      "suggestions": [{
                                          'title':'हाँ'
                                      },
                                      {
                                          'title':'नहीं'
                                      }]
                                    }
                                  },
                                  {
                                    "text": {
                                      "text": [
                                        fulfillmentText
                                      ]
                                    }
                                  }
                                ]
                              }
                                }
                }
                else{
                    if(bookeddates.includes(params['date'])){
                      if(language==='en'){
                        fulfillmentText = params['date']+' is already is booked choose from available dates below:\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = params['date']+' पहले से ही बुक किया गया है नीचे उपलब्ध दिनांक में से चुनें:\n'
                      }
                        
                        success = true
                    }
                    else{
                      if(language==='en'){
                        fulfillmentText = 'You can book appointments only for next 7 days\nEnter valid date from below:\n'
                      }
                      else if(language==='hi'){
                        fulfillmentText = 'आप केवल अगले 7 दिनों के लिए अपॉइंटमेंट बुक कर सकते हैं\nनीचे से मान्य दिनांक दर्ज करें:\n'
                      }
                        
                    }
                    availdates.forEach((date)=>{
                    fulfillmentText += date+"\n"
                    timelist.push({
                        "title": date
                      })
                })
                if(success){
                  if(language==='en'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "Choose your date"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "Choose your date",
                          "quickReplies": availdates
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                  else if(language==='hi'){
                    fulfillmentMessages = [
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "अपनी दिनांक चुनें।"
                            }
                          ]
                        }
                      },
                      {
                        "quickReplies": {
                          "title": "अपनी दिनांक चुनें।",
                          "quickReplies": availdates
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": timelist
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                    
                    }
            
                }
                
                response.send({
                    fulfillmentText: fulfillmentText,
                    fulfillmentMessages : fulfillmentMessages
                });
                return null;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }
        else{
          if(language==='en'){
            fulfillmentText = 'You cannot book appointment for less than 24hours.\n Enter appropriate date\n'
          }
          else if(language==='hi'){
            fulfillmentText = 'आप 24 घंटे से कम समय के लिए नियुक्ति नहीं कर सकते।\nउचित दिनांक दर्ज करें'
          }
            response.send({
                fulfillmentText: fulfillmentText
            })
        }
            break;

        case 'bookAppointment':
            if(params['symptoms'].length>0){
                params['specialization'] = assign_specialization(params['symptoms'])
            }
            time = reformatDate(params['time']);
            date = reformatDate(params['date']);
            params['time'] = time[1];
            params['date'] = date[0];
            db.collection('appointments').where('doctor', '==', params['doctor']).where('time', '==', params['time']).where('date', '==', params['date']).where('specialization', '==', params['specialization']).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    db.collection('appointments').add(params)
                    if(language === 'en'){
                      fulfillmentText = 'Your appointment is successful!\n'
                    }
                    else if(language === 'hi'){
                      fulfillmentText = 'आपकी नियुक्ति सफल है!\n'
                    }
                    success = true
                }  
                else{
                  if(language === 'en'){
                    fulfillmentText = 'Error in booking appointment\n'
                  }
                  else if(language === 'hi'){
                    fulfillmentText = 'नियुक्ति असफल\n'
                  }
                    
                }
                if(success){
                  if(language === 'en'){
                    fulfillmentMessages = [
                      
                      {
                        "quickReplies": {
                          "title": fulfillmentText+"Do you like to continue",
                          "quickReplies": [
                            "Yes",
                            "No"
                          ]
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": fulfillmentText
                            }
                          ]
                        }
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "Do you like to continue"
                            }
                          ]
                        }
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": [
                            {
                              "title": "Yes"
                            },
                            {
                              "title": "No"
                            }
                          ]
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                  else if(language === 'hi'){
                    fulfillmentMessages = [
                      
                      {
                        "quickReplies": {
                          "title": fulfillmentText+"क्या आप जारी रखना पसंद करते हैं",
                          "quickReplies": [
                            "हाँ",
                            "नहीं"
                          ]
                        },
                        "platform": "FACEBOOK"
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": fulfillmentText
                            }
                          ]
                        }
                      },
                      
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                          "simpleResponses": [
                            {
                              "textToSpeech": "क्या आप जारी रखना पसंद करते हैं"
                            }
                          ]
                        }
                      },
                      {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                          "suggestions": [
                            {
                              "title": "हाँ"
                            },
                            {
                              "title": "नहीं"
                            }
                          ]
                        }
                      },
                      {
                        "text": {
                          "text": [
                            fulfillmentText
                          ]
                        }
                      }
                    ]
                  }
                
                  
            }  
                response.send({
                    fulfillmentText: fulfillmentText,
                    fulfillmentMessages : fulfillmentMessages
                });
                return null;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            break;

            case 'showSchedule':
                
                db.collection('appointments').where('number', '==', params['number']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                      if(language === 'en'){
                        fulfillmentText = 'You have not booked any appointments\n'
                      }
                      else if(language === 'hi'){
                        fulfillmentText = 'आपने कोई अपॉइंटमेंट बुक नहीं किया है\n'
                      }
                        
                    }  
                    else{
                        snapshot.forEach((doc) => { appointments.push(doc.data()) });
                        console.log(appointments)
                        if(language === 'en'){
                          fulfillmentText = 'You have taken following appointments:\n'
                        }
                        else if(language === 'hi'){
                          fulfillmentText = 'आपकी नियुक्तियाँ\n'
                        }
                        
                        appointments.forEach((appointment)=>{
                          if(language === 'en'){
                            fulfillmentText += 'Appointment with '+appointment['doctor']+' on '+appointment['date']+' at '+appointment['time']+'\n'
                          }
                          else if(language === 'hi'){
                            fulfillmentText += getHindi[appointment['doctor']]+' के साथ '+appointment['date']+' को '+getHindi[appointment['time']]+'\n'
                          }
                            
                        })
                    }
                    success = true
                    if(success){
                      if(language === 'en'){
                        fulfillmentMessages = [
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "quickReplies": {
                              "title": "Do you like to continue",
                              "quickReplies": [
                                "Yes",
                                "No"
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": fulfillmentText
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": "Do you like to continue"
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "suggestions": {
                              "suggestions": [
                                {
                                  "title": "Yes"
                                },
                                {
                                  "title": "No"
                                }
                              ]
                            }
                          },
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            }
                          }
                        ]
                      }
                      else if(language === 'hi'){
                        fulfillmentMessages = [
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "quickReplies": {
                              "title": "क्या आप जारी रखना पसंद करते हैं",
                              "quickReplies": [
                                "हाँ",
                                "नहीं"
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": fulfillmentText
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": "क्या आप जारी रखना पसंद करते हैं"
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "suggestions": {
                              "suggestions": [
                                {
                                  "title": "हाँ"
                                },
                                {
                                  "title": "नहीं"
                                }
                              ]
                            }
                          },
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            }
                          }
                        ]
                      }
                    }  
                    response.send({
                        fulfillmentText: fulfillmentText,
                        fulfillmentMessages : fulfillmentMessages
                    });
                    return null;
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    
                break;

            case 'cancelAppointment':
                time = reformatDate(params['time']);
                date = reformatDate(params['date']);
                params['time'] = time[1];
                params['date'] = date[0];
                console.log(params);
                
                db.collection('appointments').where('date', '==', params['date']).where('time', '==', params['time']).where('number', '==', params['number']).get()
                .then(snapshot => {
                    var fulfillmentText = ''
                    if (snapshot.empty) {
                        console.log('No data found')
                        if(language === 'en'){
                          fulfillmentText = 'There is no appointment set on '+params['date']+' at '+params['time']+'\n';
                        }
                        else if(language === 'hi'){
                          fulfillmentText = params['date']+' '+getHindi[params['time']]+' तक कोई नियुक्ति नहीं है\n';
                        }
                        
                    
                    }  
                    else{
                    snapshot.forEach(doc => {
                        db.collection('appointments').doc(doc.id).delete();
                        if(language === 'en'){
                          fulfillmentText =  'Your appointment on '+params['date']+' at '+params['time']+' has been cancelled successfully\nPlease re-schedule a new appointment if you wish!\n';
                        }
                        else if(language === 'hi'){
                          fulfillmentText = getHindi[params['time']]+' '+params['date']+' पर आपकी नियुक्ति सफलतापूर्वक रद्द कर दी गई है\nयदि आप चाहें तो एक नई नियुक्ति का पुनर्निर्धारण करें\n'
                        }
                        
                    });
                  }
                    success = true
                    if(success){
                      if(language === 'en'){
                        fulfillmentMessages = [
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "quickReplies": {
                              "title": "Do you like to continue",
                              "quickReplies": [
                                "Yes",
                                "No"
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": fulfillmentText
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": "Do you like to continue"
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "suggestions": {
                              "suggestions": [
                                {
                                  "title": "Yes"
                                },
                                {
                                  "title": "No"
                                }
                              ]
                            }
                          },
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            }
                          }
                        ]
                      }
                      if(language === 'hi'){
                        fulfillmentMessages = [
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "quickReplies": {
                              "title": "क्या आप जारी रखना पसंद करते हैं",
                              "quickReplies": [
                                "हाँ",
                                "नहीं"
                              ]
                            },
                            "platform": "FACEBOOK"
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": fulfillmentText
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "simpleResponses": {
                              "simpleResponses": [
                                {
                                  "textToSpeech": "क्या आप जारी रखना पसंद करते हैं"
                                }
                              ]
                            }
                          },
                          {
                            "platform": "ACTIONS_ON_GOOGLE",
                            "suggestions": {
                              "suggestions": [
                                {
                                  "title": "हाँ"
                                },
                                {
                                  "title": "नहीं"
                                }
                              ]
                            }
                          },
                          {
                            "text": {
                              "text": [
                                fulfillmentText
                              ]
                            }
                          }
                        ]
                      }
                      
                              }  
                    response.send({
                        fulfillmentText: fulfillmentText,
                        fulfillmentMessages : fulfillmentMessages
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