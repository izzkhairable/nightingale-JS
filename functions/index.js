const functions = require('firebase-functions');

const admin =require('firebase-admin');
const { rejects } = require('assert');
const { database } = require('firebase-functions/lib/providers/firestore');
const { title } = require('process');
const { user } = require('firebase-functions/lib/providers/auth');
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
            try {
              let data= JSON.parse(rawdata)
              console.log(data)
              numSongs = data.pageInfo.totalResults;
              // numSongs = 2;
              
              if (data.hasOwnProperty('nextPageToken')) {
                  url += `&pageToken=${data.nextPageToken}`;
              }

              var playListItems = data.items;
              for (var item of playListItems){
                  playListTitles.push({
                    title:item.snippet.title,
                    id: item.snippet.resourceId.videoId
                  });
              }
              resolve(playListTitles)
            }catch(error){
              console.log('!!!!THIS IS AN ERROR!!!!!')
              console.log("Error: ", error.message)
              resolve({});
            }
    
          })
      }).on('error', err => {
        console.log("Error: ", err.message)
        reject(err)
      })
    } while (playListTitles.length < numSongs)

  })

}

const callCleanTitles=async (title, id)=>{
  return new Promise((resolve, reject) => {
    const http = require('https')
    var baseUrl = "https://musicbrainz.org/ws/2/release?limit=1&fmt=json&query=";
    var url = encodeURI(baseUrl + title);
  
    http.get(url,{  headers: {
      'User-Agent': 'Nightingale/1.1.0 (mohamedik.2019@sis.smu.edu.sg)'
    }}, resp => {
          let rawdata = ''
          resp.on('data', chunk => {
              rawdata += chunk
          })
          resp.on('end', () => {
            try {
              let data = JSON.parse(rawdata)
              var releases = data.releases;
              // console.log('!!!!THIS IS RELEASES!!!!'+JSON.stringify(releases))
              console.log('!!!!THIS IS TITLE!!!!'+JSON.stringify(title))
              var songTitle = releases[0].title;
              var songArtist = releases[0]["artist-credit"][0].name;
              var record = {
                  songName: songTitle,
                  songArtist: songArtist,
                  youtubeId: id
              };
              console.log('END LIAOO!!!!')
              resolve(record)
            } catch (error) {
              console.log('!!!!THIS IS AN ERROR!!!!!')
              console.log("Error: ", error.message)
              resolve({});
            }
         
          }).on('error', err => {
            console.log('!!!!THIS IS AN ERROR!!!!!')
            console.log("Error: ", err.message)
            reject(err)
          })
        })
  },title)
}



async function cleanTitles (playListTitles){
  const promises=[]
  playListTitles.map((title) => {
    promises.push(callCleanTitles(title.title, title.id)) 
  })

  return Promise.all(promises)
  .then(response=>response)
  .catch(error=>console.log(`Error in executing ${error}`))
}



const callSpotifyData=async (song,artist, token, id)=>{
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
                try {
                  let data = JSON.parse(rawdata)
                  var artists=[]
                  data.tracks.items[0].artists.map((val)=>{
                    artists.push(val.name)
                  })
                  let finalData={
                    songName:data.tracks.items[0].name,
                    artists: artists,
                    spotifyId:data.tracks.items[0].id,
                    youtubeId:id,
                    imgUrl:data.tracks.items[0].album.images[0].url,
                    spotifyUrl: 'https://open.spotify.com/track/'+data.tracks.items[0].id,
                    youtubeUrl: 'https://www.youtube.com/watch?v='+id
                  }
                  resolve(finalData)
                } catch (error) {
                  console.log('!!!!THIS IS AN ERROR!!!!!')
                  console.log("Error: ", error.message)
                  resolve({});
                }

              
          }).on('error', err => {
            console.log("Error: ", err.message)
            reject(err)
          })
        })
  },song)
}

exports.getPlaylist=functions.https.onRequest(async (req, res) => {
  cors(req, res, async() => {
    const playlistId=req.query.playlistId;
    admin.firestore().collection("playlists").doc(playlistId).get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          res.send(doc.data())
          return doc.data()
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          res.send("Error")
          return "Error"
      }
    }).catch(function(error) {
      res.send("Error getting document:", error);
         return error
    });
  })
})

function incrementPlaylistExportCount(playlistId){
   admin.firestore().collection("playlists").doc(playlistId).get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        // res.send(doc.data())
        return doc.data()
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        // res.send("Error")
        return "Error"
    }
}).then( 
    data=>{
      data.noOfExports=data.noOfExports+1
      admin.firestore().collection('playlists').doc(playlistId).set(data).then(function() {
        console.log("Document successfully written!");
        return "Document modified!Increment Number"
      }).catch(function(error) {
        return error
      });
      return null
    }
  ).catch(function(error) {

       return error
  });


}

async function spotifyData(data,token){
  console.log('Spotify2'+token)
  const promises=[]
  data = data.filter(value => Object.keys(value).length !== 0);
  data.map((song) => {
      promises.push(callSpotifyData(song.songName, song.songArtist, token,song.youtubeId)) 
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
   var newDatas = spotifyDatas.filter(function (myObj) { 
        return Object.keys(myObj).length !==0; 
    }); 
  // var cleanedIds = spotifyDatas.map(e => e.songName);
  // var missing = cleanedTitles.map(e => {
  //     if (cleanedIds.indexOf(e.songName) == -1) {
  //         console.log('THIS GUYS MISSING!!')
  //         console.log(e.songName)
  //     }
  // })
  

  //Here an example of the final data 
  const finalDatas={
    userId:userId,
    youtubePlaylistId: `${youtubePlaylistId}`,
    playlistId: `${playlistName}-${userId}`,
    playlistName: `${playlistName}`,
    noOfExports: 0,
    songs: newDatas
  }


    // Push Data to Firebase Firestore. Izzat's Firebase Code
  //   const validated = JSON.parse(JSON.stringify(finalDatas, function(k, v) {
  //     if (v === undefined) { return null; } return v; 
  //  }));
    let docid=`${playlistName}-${userId}`
    admin.firestore().collection('playlists').doc(docid).set(finalDatas).then(function() {
      console.log("Document successfully written!");
      return null
  }).catch(function(error) {
    res.send("Error getting document:", error);
       return null
  });

    // res.send('The following data is added to Firebase Firestore Playlists Collection<br><br>'+JSON.stringify(SamplePlaylistData));
    res.send('<h2 style="margin:0">Step 1) Get Youtube Playlist Titles</h2><br>'+JSON.stringify(playlistTitles)+'<br><br><br><h2 style="margin:0">Step 2) Get Cleaned Titles from MusicBrainz</h2> <br>'+JSON.stringify(cleanedTitles)
    +'<br><br><br><h2 style="margin:0">Step 3) Get Song Information from Spotify</h2><br>'+JSON.stringify(spotifyDatas)
    +'<br><br><br><h2 style="margin:0">Step 4) Successfully Added to Firebase! Job Done...</h2><br>Document Id:'+`${playlistName}-${userId}`
    +'<br><br><br><h2 style="margin:0">=====This is Final Data=====</h2><br>'+`${JSON.stringify(finalDatas)}`
    );
  })
});


exports.getAllPlaylist = functions.https.onRequest((req, res) => {
  cors(req, res,() => {
    admin.firestore().collection("playlists").get().then(function(querySnapshot) {
      var results=[]
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // res.send(doc.data())
          results.push(doc.data())
      })
      res.send(results.reverse())
      return null
  }).catch(function(error) {
    res.send("Error getting document:", error);
       return null
  });
  })
})

exports.getUserPlaylist = functions.https.onRequest((req, res) => {
  cors(req, res,() => {
    const userId = req.query.userId;
    console.log(userId)
    var data=admin.firestore().collection('playlists');
    data.where('userId','==',userId).get()
      .then(function(querySnapshot) {
        var test=[]
          querySnapshot.forEach(function(doc) {
              test.push(doc.data())
          });
          return test
      }).then(function(playlists){

        console.log(playlists)
        res.send(playlists)
        return null
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
          res.send('Doesnt Work')
      });
  })
})


function createSpotifyPlaylist(token, playlistName, userId){
  return new Promise(async function(resolve, reject){
    const http = require('https')
    var raw = JSON.stringify({
      "name": playlistName,
      "description": "",
      "public": false
    });
    var requestOptions = {
      hostname: `api.spotify.com`,
      port: '443',
      path:`/v1/users/${userId}/playlists`,
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    };

    var req=http.request(requestOptions, resp => {
      let rawdata=''
      resp.on('data', chunk => {
          rawdata += chunk
      })
      resp.on('end', () => {
         let data = JSON.parse(rawdata)
         return resolve(data)
      }).on('error', err => {
        // console.log("Error: ", err.message)
        return reject(err)
      })
    })
    req.write(raw)
    req.end()
  })
}

function AddTracksToSpotifyPlaylist(token,spotifyPlaylistId, trackIds){
  return new Promise(async function(resolve, reject){
    const http = require('https')
    var raw = JSON.stringify({
      "uris": trackIds
    });
    var requestOptions = {
      hostname: `api.spotify.com`,
      port: '443',
      path:`/v1/playlists/${spotifyPlaylistId}/tracks`,
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    };

    var req=http.request(requestOptions, resp => {
      let rawdata=''
      resp.on('data', chunk => {
          rawdata += chunk
      })
      resp.on('end', () => {
         let data = JSON.parse(rawdata)
         return resolve(data)
      }).on('error', err => {
        // console.log("Error: ", err.message)
        return reject(err)
      })
    })
    req.write(raw)
    req.end()
  })
}


exports.addPlaylistMusicsToSpotify = functions.https.onRequest(async (req, res) => {
  cors(req, res,() => {
    var token=req.query.token
    var playlistId= req.query.playlistId
    var playlistName= req.query.playlistName
    var userId=req.query.userId
    var data=admin.firestore().collection('playlists').doc(playlistId);
    firebaseData={}
    newSpotifyPlaylistData={}
    trackId=[]
    newSpotifyPlaylistId=''
    data.get().then(
      function(doc){
        if(doc.exists){
          firebaseData=doc.data()
          return null
        }else{
          return null
        }
      }).then(()=>{
        return createSpotifyPlaylist(token, playlistName, userId)
      }).then((result)=>{
        try{
          newSpotifyPlaylistData=result
          console.log(firebaseData,newSpotifyPlaylistData)
          firebaseData.songs.map(item=>{
            trackId.push("spotify:track:"+item.spotifyId)
          })
          newSpotifyPlaylistId=newSpotifyPlaylistData.id
          console.log(trackId)
          return null
        }catch(error){
          console.log(error)
          return null
        }
      }).then(()=>{
        try{
          return AddTracksToSpotifyPlaylist(token,newSpotifyPlaylistId, trackId)
        }catch(error){
          console.log(error)
          return null
        }
      }).then((data)=>{
          try{
        return incrementPlaylistExportCount(playlistId)
          }catch(error){
          console.log(error)
          return null
        }
      }).then((data)=>{
        console.log(data)
        res.send({spotifyPlaylistId: newSpotifyPlaylistId})
        return null
      }).catch(function(error) {
        res.send("Error getting document:", error);
      });
  })
});



exports.GetMostPopularArtist = functions.https.onRequest(async (req, res) => {
  cors(req, res,() => {
    var userId= req.query.userId;
    var data=admin.firestore().collection('playlists');
    data.where('userId','==',userId).get()
      .then(function(querySnapshot) {
        var test=[]
          querySnapshot.forEach(function(doc) {
              test.push(doc.data())
          });
          return test
      }).then(function(playlists){
        allArtists=[];
        for(playlist of playlists){
          var songs=playlist.songs
            for(song of songs){
             var  artists=song.artists
              for(artist of artists){
                  allArtists.push(artist)
              }
          }
        }
        
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
        
        return result
          
      //Jing Jie's Eventbrite Code
      //*Use the data from above which provides the highest occurring artist from all the user playlist*
      }).then(artist=>{
      const http = require('http')
      http.get(`http://api.eventfinda.sg/v2/events.json?row=10&q=${encodeURI(artist)}`,{  headers: {
        'User-Agent': 'Nightingale/1.1.0 (mohamedik.2019@sis.smu.edu.sg)',
        "Authorization": "Basic bmlnaHRpbmdhbGU6bnd6aGs2M2s5czNz"
      
      }}, resp => {
            let rawdata = ''
            resp.on('data', chunk => {
                rawdata += chunk
            })
            resp.on('end', () => {
              try {
                let data = JSON.parse(rawdata)
                res.send(data)
                return data
              } catch (error) {

                console.log("Error: ", error.message)
                return error
              }
           
            }).on('error', err => {
              console.log('!!!!THIS IS AN ERROR!!!!!')
              console.log("Error: ", err.message)
              return err
            })
          })
          return null
    }).catch(function(error) {
      res.send("Error getting document:", error);
    });
});
})

exports.deletePlaylistFromFirebase = functions.https.onRequest(async (req, res) => {
  cors(req, res,() => {
    var playlistId=req.query.playlistId;
    admin.firestore().collection('playlists').doc(playlistId).delete().then(function() {
      console.log("Playlist successfully deleted!");
      res.send("Playlist successfully deleted!")
      return null
  }).catch(function(error) {
      console.error("Error removing document: ", error);
      return null
  });
  })
})


exports.GetMostPopularArtist2 = functions.https.onRequest(async (req, res) => {
  cors(req, res,() => {
    var userId= req.query.userId;
    var data=admin.firestore().collection('playlists');
    data.where('userId','==',userId).get()
      .then(function(querySnapshot) {
        var test=[]
          querySnapshot.forEach(function(doc) {
              test.push(doc.data())
          });
          return test
      }).then(function(playlists){
        allArtists=[];
        for(playlist of playlists){
          var songs=playlist.songs
            for(song of songs){
             var  artists=song.artists
              for(artist of artists){
                  allArtists.push(artist)
              }
          }
        }
        
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
        
        return result
          
      //Songkick Code
      //*Use the data from above which provides the highest occurring artist from all the user playlist*
      }).then(artist=>{
      const http = require('https');
      const songkickAPIKey= 'io09K9l3ebJxmxe2';
      http.get(`https://api.songkick.com/api/3.0/events.json?apikey=${songkickAPIKey}&artist_name=${encodeURI(artist)}`,
      resp => {
            let rawdata = ''
            resp.on('data', chunk => {
                rawdata += chunk
            })
            resp.on('end', () => {
              try {
                let data = JSON.parse(rawdata)
                res.send(data)
                return data
              } catch (error) {

                console.log("Error: ", error.message)
                return error
              }
           
            }).on('error', err => {
              console.log('!!!!THIS IS AN ERROR!!!!!')
              console.log("Error: ", err.message)
              return err
            })
          })
          return null
    }).catch(function(error) {
      res.send("Error getting document:"+ error);
    });
});
})


exports.tryColor = functions.https.onRequest((req, res) => {
  cors(req, res,() => {
    var imgUrl= req.query.imgUrl;
    var sightengine = require('sightengine')('480606356','g82ynatpztyiuhHAqzcu');
    sightengine.check(['properties']).set_url(imgUrl).then(function(result) {
        return result
    }).then(result=>{
      res.send(result)
      return null
    }).catch(function(err) {
      res.send(err)
      return null
    });
  })
})

