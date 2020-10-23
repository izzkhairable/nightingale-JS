
const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

//Say hello function call
// const button=document.querySelector('.call');
// button.addEventListener('click',function(){p
//     const sayHello=firebase.functions().httpsCallable('sayHello')
//     sayHello({name:'izzat'}).then(result=>{
//         console.log(result)
//     });
// })


requestForm.addEventListener('submit',function(e){
  e.preventDefault();
  const addRequest =firebase.functions().httpsCallable('addRequest');
  addRequest({
    text: requestForm.request.value,
  })
  .then(()=>{
    requestForm.reset();
    requestModal.classList.remove('open');
    requestForm.querySelector('.error').textContent='';
  })
  .catch(error=>{
    console.log('Error')
    requestForm.querySelector('.error').textContent=error.message;
  })
})