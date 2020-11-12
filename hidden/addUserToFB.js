async function postData( data) {
    var url="https://us-central1-nightingale-1d29b.cloudfunctions.net/signUp";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
    }
    postData( {
        "data": {
            "email":"Replace with  user email",
            "user_id": "replace with user_id",
            "spotifyUrl": "replace with user spotify url" 
        }
    })
    .then(data => {
        console.log(data.result.token); // JSON data parsed by `data.json()` call
    });