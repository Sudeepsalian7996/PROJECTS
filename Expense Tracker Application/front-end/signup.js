const userName=document.getElementById("name")
const email=document.getElementById('email')
const password=document.getElementById("password")
const signup=document.getElementById("signup")

signup.addEventListener("click",submitSignup)

async function submitSignup(e){
    e.preventDefault()
    let my_obj={
        name:userName.value,
        email:email.value,
        password:password.value
    }
    const data=await axios.post("http://localhost:5200/signup",my_obj)
    console.log(data)
}

