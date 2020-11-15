Nightingale API Version 0.007
1) Get All Playlists

HTTP Methods - GET | POST 

Request Parameters - None

Return Result - An array of playlist data

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/getAllPlaylist


2) Get Playlist for a User
HTTP Methods - GET | POST 

Prerequisites - Make sure the user playlist from youtube has already been added to firebase
In others words, make sure the addPlaylistMusicsToFirebase() is called before this

Request Parameters 
1) userId 
The spotify user id that the user logged in e.g. izzkhairable

Return Result- An array of playlist data

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/getUserPlaylist?userId=enterUserId


3) Add Playlist Musics To Firebase
HTTP Methods - GET | POST 

Request Parameters 
1)youtubePlaylistId 
The youtube playlist id e.g PLhTbKxfpzJ8kxnI2qYtBqHenn8Q549G4Q
2)userId 
The spotify user id that the user logged with previously in e.g. izzkhairable
3)spotifyToken 
The very long string of spotify token
4) playlistName
This is base on user input like what they would would like to name the playlist


Return Result - An html of the entire process with data, parameter not important. Just to show you that it is working. As long HTTP Status 200, good to go!

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/addPlaylistMusicsToFirebase?youtubePlaylistId=EnterYoutubePlaylistId&userId=EnterUserId&spotifyToken=EnterSpotifyToken&playlistName=EnterPlaylistName


4) Export Playlist Musics To Spotify
HTTP Methods - GET | POST 

Prerequisites - Make sure the user playlist from youtube has already been added to firebase
In others words, make sure the addPlaylistMusicsToFirebase() is called before this

Request Parameters 
1) playlistId
Ok this is a bit confusing, the playlistId is a combination of playlistName from the addMusicToFirebase function and the spotify user id e.g. Cool Music-izzkhairable
2) playlistName
The will be the name of the newly created playlist in spotify, so can be anything but we should try to make it based on the user input e.g. ThisIsMyNewSpotifyPlaylist
3) userId
The spotify user id that the user logged with previously in e.g. izzkhairable
4) token
The very long string of spotify token

Return Result - This would return just a string of text. Just to show you that it is working. As long HTTP Status 200, good to go! That means the playlist had successfully been added to spotify.

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/addPlaylistMusicsToSpotify?playlistId=EnterPlaylistId&playlistName=EnterPlaylistName&userId=EnterUserId&token=EnterSpotifyToken


5) Get Most Popular Artist (Event Finda)
HTTP Methods - GET | POST 

Prerequisites - Make sure at least one playlist from youtube has already been added to firebase for the user. In other words, make sure the addPlaylistMusicsToFirebase() is called before this for this user.

Request Parameters - 
1) userId
The spotify user id that the user logged with previously in e.g. izzkhairable

Return Result - Returning an event object containing array of events based on the user most favourite artist from Event Finda API

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/GetMostPopularArtist?userId=EnterUserId


6) Get Most Popular Artist 2 (Song Kick)
HTTP Methods - GET | POST 

Prerequisites - Make sure at least one playlist from youtube has already been added to firebase for the user. In other words, make sure the addPlaylistMusicsToFirebase() is called before this for this user.

Request Parameters - 
1) userId
The spotify user id that the user logged with previously in e.g. izzkhair

Return Result - Returning an event object containing array of events for the user most favourite artist from Song Kick API

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/GetMostPopularArtist2?userId=EnterUserId





7) Get The Color for the Image
HTTP Methods - GET | POST 

Request Parameters- 
1) imgUrl 
The url of any image on the internet e.g. https://picsum.photos/200

Return Result - Returning an Object containing the RGB and HEX color of the image

URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/tryColor?imgUrl=enterImageUrl


8) Sign Up

HTTP Methods - POST 

RequestOptions- 
{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',                
    body: JSON.stringify({'token':`toke`, 'returnSecureToken':true}) 
	}
            


URL
https://us-central1-nightingale-1d29b.cloudfunctions.net/signUp
