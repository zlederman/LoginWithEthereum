
const  submit = (e,element,endpoint) =>{
  formElement =  document.querySelector(element)
  const data = new FormData(formElement)
  const payload = {user: data.get("user")}
  
   fetch(`http://d6ce8c2b53bc.ngrok.io/${endpoint}`,{
    method:"POST",
    body: JSON.stringify(payload),
    headers: {
       'Content-type' : 'application/json'
    }
  }).then((s)=> s.json()).then(json => {return handle(json)})
  
}



const init = () =>{
  const signUp = document.getElementById("signup").addEventListener("submit",(e)=>{
    submit(e,"#signup")
  })
  const auth = document.getElementById("auth").addEventListener("submit",(e)=>{
    submit(e,"#auth","test")
  })
  // const signUp = document.getElementById("#signUp").onsubmit = submit("#signUp",event);


}
if (window.ethereum) {
  ethereum.autoRefreshOnNetworkChange = false
  var web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  test()
 
  init()


}
else{
  alert("you")
}

const postSig =  (sig) =>{
    console.log(sig)
    fetch(`http://d6ce8c2b53bc.ngrok.io/sample`,{
      method: "POST",
      body: JSON.stringify({signature:sig}),
      headers: {
        'Content-type' : 'application/json'
     }
    }).then((res)=>{
      console.log(res)
    }).catch(console.log)
}
function handle(msg){
  const thing = msg
  ethSign(thing.message)
}
async function ethSign(msg) {
  console.log("hello?")
  const account = await web3.eth.getAccounts()
  const sig = await web3.eth.personal.sign(msg, account[0])
  postSig(sig)
  
  
}

 async function test(){
   let web3 = new Web3(window.ethereum);
   window.ethereum.enable();
   const account = await web3.eth.getAccounts()
   const sig = await web3.eth.personal.sign("yo sign this", account[0])
  //  postSig(sig)
   

 }