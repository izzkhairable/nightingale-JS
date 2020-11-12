var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer BQDalGs-UnIJUEru3l3bnrGBGs8_ggUWKS1mJXS3g5cSkfQqJgdIhMsyrCkbvP47Za2q-DmPg0PRQMgGvyFr5nGSp6wF_xRCM7YAAwyOLTG2X_BLcwaDh0Bt24A_VQu7m-hqqZ-5SYSVf4Btwb3Yd-ooczP_hGvLIL8g66V4p-YY-3MdQuzIZKujV2C_NXPwFNN8bY6aU8n0Yo1v6edOs8E3jvC2Tsrx4xg-5xQj1Um3DKUWAPnDQ0ImtXcMuGdSyxpk9s9ctvOn0EdSb-Yx");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow'
};
//spotify:track:songcode is the uri we pull when we activate my code to get the song
//we also need to provide the playlist id which is pulled 
//when we request for the playlist 
//"0CowjhEu1WehvnTdOKcYQz" this code is my playlist if you want live demo let me know i show u my spotify
fetch("https://api.spotify.com/v1/playlists/0CowjhEu1WehvnTdOKcYQz/tracks?position=0&uris=spotify:track:7MXVkk9YMctZqd1Srtv4MB", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

