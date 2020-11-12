var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic bmlnaHRpbmdhbGU6bnd6aGs2M2s5czNz");
myHeaders.append("User-Agent", "Nightingale/1.1.0 (mohamedik.2019@sis.smu.edu.sg)")



var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

fetch("https://cors-anywhere.herokuapp.com/http://api.eventfinda.sg/v2/events.json?row=10&q=TGIF", requestOptions)
 .then(response => response.json())
 .then(result => console.log(result))
 .catch(error => console.log('error', error));