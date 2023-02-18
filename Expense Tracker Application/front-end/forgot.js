const forgotButton=document.getElementById("forgotButton")

forgotButton.addEventListener("click",forgotPassword)

async function forgotPassword(e){
    e.preventDefault()
    await axios.post("http://localhost:5200/password/forgotpassword")

}