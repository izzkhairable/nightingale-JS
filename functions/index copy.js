const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've succesfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.Please dont keep spam! :)`});
  });


exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
.onCreate((snap, context) => {
// Grab the current value of what was written to Cloud Firestore.
const original = snap.data().original;

// Access the parameter `{documentId}` with `context.params`
functions.logger.log('Uppercasing', context.params.documentId, original);

const uppercase = original.toUpperCase();

// You must return a Promise when performing asynchronous tasks inside a Functions such as
// writing to Cloud Firestore.
// Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
return snap.ref.set({uppercase}, {merge: true});
});


exports.randomNumber=functions.https.onRequest((request,response)=>{
  const number= Math.round(Math.random()*100);
  console.log(number);
  response.send(number.toString())
})

exports.toTheDojo=functions.https.onRequest((request,response)=>{
  response.redirect('https://www.google.com')
})

exports.sayHello=functions.https.onCall((data,context)=>{
  const name=data.name;
  return `This is your name ${name}`
});


exports.newUserSignup=functions.auth.user().onCreate(function(user){
  // console.log('user created',user.email,user.uid)
  return admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      upvotedOn: []
  })
})

exports.userDeleted=functions.auth.user().onDelete(function(user){
  // console.log('user deleted',user.email,user.uid)
  const doc= admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
})

exports.addRequest = functions.https.onCall((data,context)=>{
  if(!context.auth){
      throw new functions.https.HttpsError(
          'unauthenticated',
          'only authenticated users can add requests'
      )
  }
  if(data.text.length>30){
      throw new functions.https.HttpsError(
          'invalid-argument',
          'request must be no more than 30 characters  long'
      )
  }

  return admin.firestore().collection('requests').add({
      text:data.text,
      upvotes:0
  })
})




exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've succesfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.Please dont keep spam! :)`});
  });

  // // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions