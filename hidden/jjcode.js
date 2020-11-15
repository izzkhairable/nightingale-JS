i = 1;
var userquery = []
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer BQBzMjS7qtmxA2ZmJrbLknBnmHyph3hJrOK0AVuyopx-Nxe25apvSP9hK_qz0ZsIEuzjre1WQr-bmaFrW9jOh-7606YNwGuEnskLhYIqOmb7uFfP9UoPbTF3WNFa_t8jcPVUcyFSBL6zuiwAYOHELgwPiTx4JNXMFsgioaLv0OBhWoWNIYJSuIqtaloVK2Mt8NwK3rM9800jO6DpwdzNJGFwhQbXwhuvLfz85R-ZwNgxndhYZZu6XC9EfnSKEfnUNgpCekp1m6uCUTNn77p0");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var songname = {
    
    1: {name:"starboy", artist:"weeknd"},
    2: {name:"Rap God", artist: "eminem"}


}


for(songs in songname){
fetch(`https://api.spotify.com/v1/search?q=${songname[songs]["name"]}%20${songname[songs]["artist"]}&type=track&limit=1`, requestOptions)
  .then(response => response.json())
  .then(result => {
     userquery.push(result)
     console.log(userquery)
  })
  .catch(error => console.log('error', error));
  i += 1
}