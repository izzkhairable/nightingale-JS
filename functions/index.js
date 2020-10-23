const functions = require('firebase-functions');
const admin =require('firebase-admin');
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



exports.addPlaylistMusicsToFirebase = functions.https.onRequest(async (req, res) => {
  //Must pass in 2 parameter in req which is => youtubePlaylistUrl 
  const youtubePlaylistUrl = req.query.youtubePlaylistUrl;
  const nightingalePlaylistId=req.query.nightingalePlaylistId;

  //Byran's Youtube Code
  //*Get the whole Youtube Playlist and Items*

  //Byran's MusicBrainz Code
  //*Clean Each of the Youtube Video Title from the Playlist.Return Music Title & Artist Name*

  //Jing Jie's Spotify Code
  //*Find the data for each of the track from MusicBrainz*

  //Here an example of the final data 
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

    //Push Data to Firebase Firestore. Izzat's Firebase Code
    admin.firestore().collection('playlists').doc(nightingalePlaylistId).set(SamplePlaylistData);
    res.send('The following data is added to Firebase Firestore Playlists Collection<br><br>'+JSON.stringify(SamplePlaylistData));
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

