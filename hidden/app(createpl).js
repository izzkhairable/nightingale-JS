var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer BQB_OAFXS2OB-9uNl5mX-NB9L2R5xcA_j3sIBmGYumCg7IXk37-nkW30JAqh3_FgLDaml1S7Tt8SpIUrUEFy8yg1i531s7oybVxlamjyJJHivuHZDSxuz7nEy389ALvGFuGLgqSK9pznUdBQ1nhgG2KfIG8N52gqU46eDtQfAUKiOeQ9taJ57k38_yv1ExSRtyQtAUqwWxN7P1PbAylKh6QMn4U4d7XYSBglOvNHr1TJ_VJIFnUf3BxI6z99Yk-AU_KpGEIFw9E30xhqcuNy");


//the name and the desc can come from user input
var raw = JSON.stringify({"name":"New Playlist","description":"New playlist description","public":false});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

//the alot of number one is the userid we pull when the user log in
fetch("https://api.spotify.com/v1/users/11143498304/playlists", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));