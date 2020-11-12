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


function cleanTitles (playListTitles){
  return new Promise(function(resolve, reject){
    var cleanedTitles = [];
    const http = require('https')
    var baseUrl = "https://musicbrainz.org/ws/2/recording?limit=1&fmt=json&query=";
      let counter=0
      for(var title of playListTitles){
        var url = encodeURI(baseUrl + title);
          counter+=1

          http.get(url,{  headers: {
            'User-Agent': 'Nightingale/1.1.0 (mohamedik.2019@sis.smu.edu.sg)'
          }}, resp => {
                let rawdata = ''
                resp.on('data', chunk => {
                    rawdata += chunk
                })
                resp.on('end', () => {
                    let data = JSON.parse(rawdata)
                    var recordings = data.recordings;
                    var songTitle = recordings[0].title;
                    var songArtist = recordings[0]["artist-credit"][0].name;
                    var record = {
                        "songName": songTitle,
                        "songArtist": songArtist
                    };
                    resolve(cleanedTitles)
                    cleanedTitles.push(record);
                    console.log("[cleanedTitles]"+record+'<br>[count ]'+counter)
                }).on('error', err => {
                  console.log("Error: ", err.message)
                  reject(err)
                })

              })
       
      }
  })
}

const SamplePlaylistData={
  //This is dynamic
  youtubePlaylistUrl: `${youtubePlaylistUrl}`,
  nightingalePlaylistId:`${nightingalePlaylistId}`,
  //Only this two above

  playlistTitle: 'Motivation Mix',
  nightingaleUserId:'izzkhair',
  youtubePlaylistId: '',
  youtubePlaylistImg:'https://i.scdn.co/image/ab67706c0000bebb433890f63ce150ee66c0e6e9',
  youtubePlaylistDescription:'Uplifting Energetic Music To Blast Your Day!',
  youtubePlaylistItems: [
    {
      trackTitle: 'Rude',
      trackId: '0DxeaLnv6SyYk2DOqkLO8c',
      artists: [ 'MAGIC!', 'Bruno Mars'],
      albumImg: 'https://i.scdn.co/image/ab67616d0000b2730ee3a8b1f9762f0a1e69385d',
      youTubeUrl: 'https://www.youtube.com/watch?v=4JipHEz53sU&list=PL7Q2ZklqtR8B_EAUfXt5tAZkxhCApfFkL&index=4',
      spotifyUrl: 'https://open.spotify.com/track/3tCwjWLicbjsMCvXhN0WOE',
      youtubeUrl: 'https://www.youtube.com/watch?v=PIh2xe4jnpk'
    },
    {
      trackTitle: 'Pray',
      trackId: '0DxeaLnv6SyYk2DOqkLO8c',
      artists: ['Logic', 'Sam Smith', 'MAGIC!'],
      albumImg: 'https://i.scdn.co/image/ab67616d0000b2730ee3a8b1f9762f0a1e69385d',
      youTubeUrl: 'https://www.youtube.com/watch?v=4JipHEz53sU&list=PL7Q2ZklqtR8B_EAUfXt5tAZkxhCApfFkL&index=4',
      spotifyUrl: 'https://open.spotify.com/track/3tCwjWLicbjsMCvXhN0WOE',
      youtubeUrl: 'https://www.youtube.com/watch?v=PIh2xe4jnpk'
    }
  ]
}

///###########################################################//
///BEFORE MAKING MAJOR CHANGES//
const functions = require('firebase-functions');
const admin =require('firebase-admin');
const { rejects } = require('assert');
const { database } = require('firebase-functions/lib/providers/firestore');
const { title } = require('process');
const cors = require('cors')({origin: true});
admin.initializeApp();

exports.signUp = functions.https.onCall((data, context) => {
    var account=admin.firestore().collection('userAccounts').doc(data.user_id);
    account.set({
      emailAddress: `${data.email}`,
      spotifyUrl: `${data.spotifyUrl}`
    })
    return admin.auth().createCustomToken(data.user_id)
    .then(customToken => { return { 'token': customToken } })
  }
);


function getYoutubePlaylist (playListId){
  return new Promise(function(resolve, reject){
      var part = "snippet";
      var maxResults = 50;
      var youTubeAPIKey = "AIzaSyCtCW6au_ln9xsgBuUGU45-DBGbuzHhwWs";
      var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=${part}&maxResults=${maxResults}&playlistId=${playListId}&key=${youTubeAPIKey}`;
      var playListTitles = []
      var numSongs = 0;
      var nextPageToken;
      // var http = require('https');
    const http = require('https')
    do{
      http.get(url, resp => {
          let rawdata = ''
          resp.on('data', chunk => {
              rawdata+= chunk
          })
          resp.on('end', () => {
              let data= JSON.parse(rawdata)
              console.log(data)
              numSongs = data.pageInfo.totalResults;
              // numSongs = 2;
              
              if (data.hasOwnProperty('nextPageToken')) {
                  url += `&pageToken=${data.nextPageToken}`;
              }

              var playListItems = data.items;
              for (var item of playListItems){
                  playListTitles.push(item.snippet.title);
              }
              resolve(playListTitles)
          })
      }) .on('error', err => {
        console.log("Error: ", err.message)
        reject(err)
      })
    } while (playListTitles.length < numSongs)

  })

}

const callCleanTitles=async (title)=>{
  return new Promise((resolve, reject) => {
    const http = require('https')
    var baseUrl = "https://musicbrainz.org/ws/2/recording?limit=1&fmt=json&query=";
    var url = encodeURI(baseUrl + title);
  
    http.get(url,{  headers: {
      'User-Agent': 'Nightingale/1.1.0 (mohamedik.2019@sis.smu.edu.sg)'
    }}, resp => {
          let rawdata = ''
          resp.on('data', chunk => {
              rawdata += chunk
          })
          resp.on('end', () => {
              let data = JSON.parse(rawdata)
              var recordings = data.recordings;
              var songTitle = recordings[0].title;
              var songArtist = recordings[0]["artist-credit"][0].name;
              var record = {
                  "songName": songTitle,
                  "songArtist": songArtist
              };
              resolve(record)
          }).on('error', err => {
            console.log("Error: ", err.message)
            reject(err)
          })
        })
  },title)
}



async function cleanTitles (playListTitles){
  const promises=[]
  playListTitles.map((title) => {
    promises.push(callCleanTitles(title)) 
  })

  return Promise.all(promises)
  .then(response=>response)
  .catch(error=>console.log(`Error in executing ${error}`))
}


const callSpotifyData=async (song,artist, token)=>{

  return new Promise((resolve, reject) => {
    console.log('Spotify'+token)
    const http = require('https')
    const url=encodeURI(`https://api.spotify.com/v1/search?q=${song} ${artist}&type=track&limit=1`)

    http.get(url,{  headers: {
      'Authorization': `Bearer ${token}`
    }}, resp => {
          let rawdata = ''
          resp.on('data', chunk => {
              rawdata += chunk
          })
          resp.on('end', () => {
              let data = JSON.parse(rawdata)
              console.log('THIS IS SONG NAME->'+data.tracks.items[0].name)
              data.tracks.items[0].artists.map((val,id)=>{
                console.log(`THIS IS ARTIST ${id} NAME->`+val.name)
              })
              console.log('THIS IS THE SONG ID->'+data.tracks.items[0].id)
              console.log('THIS IS THE ALBUM IMG URL->'+data.tracks.items[0].album.images[0].url)
              console.log('THIS IS THE SPOTIFY URL-> https://open.spotify.com/track/'+data.tracks.items[0].id)
              console.log('')
              console.log('----------------------------------------')
              console.log('')
              resolve(data)
          }).on('error', err => {
            console.log("Error: ", err.message)
            reject(err)
          })
        })
  },song)
}

async function spotifyData(data,token){
  console.log('Spotify2'+token)
  const promises=[]
  data.map((song) => {
    promises.push(callSpotifyData(song.songName, song.songArtist, token)) 
  })

  return Promise.all(promises)
  .then(response=>response)
  .catch(error=>console.log(`Error in executing ${error}`))
}





exports.addPlaylistMusicsToFirebase = functions.https.onRequest(async (req, res) => {
  cors(req, res, async() => {
      //Must pass in 2 parameter in req which is => youtubePlaylistUrl 
  const youtubePlaylistId = req.query.youtubePlaylistId;
  const userId=req.query.userId;
  const spotifyToken= req.query.spotifyToken;
  const playlistName=req.query.playlistName;

  //Byran's Youtube Code
  //*Get the whole Youtube Playlist and Items*
  var playlistTitles=await getYoutubePlaylist(youtubePlaylistId);
  // console.log('[playlistTitles]'+playlistTitles)


  //Byran's MusicBrainz Code
  //*Clean Each of the Youtube Video Title from the Playlist.Return Music Title & Artist Name*
  var cleanedTitles= await cleanTitles(playlistTitles);
  // console.log('[cleanedTitles]'+cleanedTitles)


  //Jing Jie's Spotify Code
  //*Find the data for each of the track from MusicBrainz*
  var spotifyDatas=await spotifyData(cleanedTitles,spotifyToken)
  // console.log('[spotifyData]'+spotifyDatas)
  

  //Here an example of the final data 
  const finalData={
    youtubePlaylistId: `${youtubePlaylistId}`,
    playlistId: `${playlistName}-${userId}`,
    playlistName: `${playlistName}`,
    songs: [
      {},
    
    ]

  }

    //Push Data to Firebase Firestore. Izzat's Firebase Code
    // admin.firestore().collection('playlists').doc(nightingalePlaylistId).set(SamplePlaylistData);
    // res.send('The following data is added to Firebase Firestore Playlists Collection<br><br>'+JSON.stringify(SamplePlaylistData));
    res.send('<h2>Playlist Titles</h2><br>'+JSON.stringify(playlistTitles)+'<br><br><h2>Cleaned Titles</h2> <br>'+JSON.stringify(cleanedTitles)+'<br><br><h2>Spotify Data</h2><br>'+JSON.stringify(spotifyDatas));
  })

});



exports.addPlaylistMusicsToSpotify = functions.https.onRequest(async (req, res) => {
 var doc= req.query.nightingalePlaylistId
    var data=admin.firestore().collection('playlists').doc(doc);
    data.get().then(
      function(doc){
        if(doc.exists){
          res.send("Here are the playlist details<br><br>"+JSON.stringify(doc.data()))
        }else{
          res.send('No such Playlist id!')
        }
        return null
      })
      .catch(function(error) {
        res.send("Error getting document:", error);
      });

      //Jing Jie's Spotify Code 
      //*Use the returned Firebase playlist data to create new playlist and add item to the playlist*
});



exports.GetMostPopularArtist = functions.https.onRequest(async (req, res) => {

  var userId= req.query.userId;
  var data=admin.firestore().collection('playlists');
  data.where('nightingaleUserId','==',userId).get()
    .then(function(querySnapshot) {
      var test=[]
        querySnapshot.forEach(function(doc) {
            test.push(doc.data())
        });
        return test
    }).then(function(playlists){
      allArtists=[];
      for(playlist of playlists){
        var playlistItems=playlist.youtubePlaylistItems
          for(artists of playlistItems){
           var  all=artists.artists
            for(artist of all){
                allArtists.push(artist)
                console.log('[I am an artise]'+artist)
            }
        }
        
      }
      console.log("[allArtists]"+allArtists)
      
      var store = allArtists;
      var frequency = {}; 
      var max = 0;  
      var result;   
      for(var v in store) {
              frequency[store[v]]=(frequency[store[v]] || 0)+1;
              if(frequency[store[v]] > max) { 
                      max = frequency[store[v]];  
                      result = store[v];          
              }
      }
      console.log(result)
      res.send(result)
      return null
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        res.send('Doesnt Work')
    });


    //Jing Jie's Eventbrite Code
    //*Use the data from above which provides the highest occurring artist from all the user playlist*
});


