const forgotButton=document.getElementById("forgotButton")
const email=document.getElementById("email")

forgotButton.addEventListener("click",forgotPassword)

async function forgotPassword(e){
    e.preventDefault()
    const data=await axios.post("http://localhost:5200/password/forgotpassword",{email:email})
    console.log(data)
}