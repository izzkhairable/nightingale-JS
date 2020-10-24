// Global variables
function getSongData(){
    // var playListId = "PLPHxDHtGbK_RJZR3p4tgLNNDedtI4KTWQ";
    var playListId = document.getElementById("playListId").value;
    console.log(playListId);
    var playListTitles = getYoutubePlaylist(playListId);

    var cleanedTitles = cleanTitles(playListTitles);

    var output = document.getElementById("output");

    for (title of cleanedTitles){
        output.innerHTML += `<p>
            ${title.songName}, ${title.songArtist}
            </p>`;
    }
}

function getYoutubePlaylist (playListId){
    var part = "snippet";
    var maxResults = 50;
    var youTubeAPIKey =  "AIzaSyCtCW6au_ln9xsgBuUGU45-DBGbuzHhwWs";
    var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=${part}&maxResults=${maxResults}&playlistId=${playListId}&key=${youTubeAPIKey}`;
    
    var playListTitles = []
    var numSongs = 0;
    var nextPageToken;

    do {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function(){
            if (this.readyState == 4 & this.status == 200){
                var data = JSON.parse(this.responseText);
                numSongs = data.pageInfo.totalResults;

                if (data.hasOwnProperty('nextPageToken')) {
                    url += `&pageToken=${data.nextPageToken}`;
                }

                var playListItems = data.items;
                for (var item of playListItems){
                    playListTitles.push(item.snippet.title);
                }
            }
        };
        request.open("GET", url, false);
        request.send();

    } while (playListTitles.length < numSongs)

    return playListTitles;
}

function cleanTitles (playListTitles){
    var cleanedTitles = [];
    var baseUrl = "https://musicbrainz.org/ws/2/recording?fmt=json&query=";

    for(var title of playListTitles){
        var url = encodeURI(baseUrl + title);
        var request = new XMLHttpRequest();

        request.onreadystatechange = function(){
            if (this.readyState == 4 & this.status == 200){
                var data = JSON.parse(this.responseText);
                var recordings = data.recordings;
                var songTitle = recordings[0].title;
                var songArtist = recordings[0]["artist-credit"][0].name;

                var record = {
                    "songName": songTitle,
                    "songArtist": songArtist
                };
                
                cleanedTitles.push(record);
            }
        };
        request.open("GET", url, false);
        request.send();
    }

    return cleanedTitles;
}

