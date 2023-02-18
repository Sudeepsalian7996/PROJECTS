
const amount=document.getElementById("amount")
const description=document.getElementById("description")
const category=document.getElementById("category")
const addExpense=document.getElementById("expense")
const allExpenses=document.getElementById("allExpenses")

//used do decode jwt
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//Fetching the expense from database
window.addEventListener("DOMContentLoaded",async()=>{
   try{
        const tokenId=localStorage.getItem("token")
        const decodeToken=parseJwt(tokenId)
        console.log(decodeToken)
        if(decodeToken.isPremium){
            document.getElementById("razorpay").style.visibility="hidden"
            document.getElementById("addText").innerHTML="Premium purchased"
            showLeaderBoard()
        }
        const data=await axios.get("http://localhost:5200/expense/get-expense",{headers:{"Authorization":tokenId}})
        const allExpense=data.data.allExpenses
        for(let i=0;i<allExpense.length;i++){
            showOnScreen(allExpense[i])
        }
        
   }catch(err){
    console.log("windowOnload error",err)
   }
})
 
//showing the data on the screen
function showOnScreen(show){
    try{


        const newExpense=`<li id=${show.id}>${show.amount}&nbsp;&nbsp;${show.description}&nbsp;&nbsp;
        ${show.category}&nbsp;&nbsp;
        <button onclick="deleteExpense(${show.id})">deleteExpense</button></li>`
        allExpenses.innerHTML=allExpenses.innerHTML+newExpense
        
    }catch(err){
     console.log("error in showscreen",err)
    }
  
}

//deleting the expense
async function deleteExpense(key){
    try{
        const oneExpense=document.getElementById(key)
        allExpenses.removeChild(oneExpense)
        await axios.delete(`http://localhost:5200/expense/delete-expense/${key}`)
      
    }catch(err){
        console.log("delete expeses error-->",err)
    }
    
}

//Adding a expense to the database
addExpense.addEventListener("click",postExpense)
async function postExpense(e){
    try{
        e.preventDefault();
        const expense_obj={
            amount:amount.value,
            description:description.value,
            category:category.value
        }
        const data=await axios.post("http://localhost:5200/expense/add-expense",expense_obj)
            showOnScreen(data.data.newExpense)   
    }catch(err){
        console.log("addExpense Error->",err)
    }
   
}

//Buy premium button
document.getElementById("razorpay").onclick=async(e)=>{
    try{
        const token=localStorage.getItem("token")
        const resource=await axios.get("http://localhost:5200/purchase/premium-membership",{headers:{"Authorization":token}})
        
        let option={
        "key":resource.data.key_id,
        "order_id":resource.data.order.id,
        "handler":async function (res){
            const data=await axios.post("http://localhost:5200/purchase/updatePremium",{
                "order_id":option.order_id,
                "payment_id":res.razorpay_payment_id
            },{headers:{"Authorization":token} })
            alert("payment successfully done")
            document.getElementById("razorpay").style.visibility="hidden"
                document.getElementById("addText").innerHTML="Premium purchased"
                localStorage.setItem("token",data.data.token)         
         },
        
   }
const raz1=new Razorpay(option)
raz1.open()
e.preventDefault()
 raz1.on("payment.failed",async function(){  
    try{
        const key=resource.data.order.id
    
        const response=await axios.post("http://localhost:5200/purchase/updatePremium",{
            "order_id":key,
            "payment_id":null
        },{headers:{"Authorization":token} })
        
        alert(response.data.message)
    }catch(err){
        console.log("error in payment failed section",err)
    }
   
})
 }catch(err){
    console.log("error in razorpay frontEnd-->",err)
 }
}

//leaderBoard feature-->premium membership
async function showLeaderBoard(){
    try{
        const buttonLeaderBoard=document.createElement("input")
        buttonLeaderBoard.type="button"
        buttonLeaderBoard.value="Show LeaderBoard"
        
       document.getElementById("addText").appendChild(buttonLeaderBoard)
       
        buttonLeaderBoard.onclick=async function(e){
            e.preventDefault()
            document.getElementById("leaderboard").innerHTML=""
            const token=localStorage.getItem("token")
           const response= await axios.get("http://localhost:5200/premium/leaderBoard",{headers:{"Authorization":token}})
            let parent=document.getElementById("leaderboard")
           
            response.data.forEach(ele => {
                if(ele.total_amount===null){
                    ele.total_amount=0
                }
              const child=  `<li>Name-->${ele.name}&nbsp;---Total Amount-->${ele.totalAmount}</li>`
              parent.innerHTML=parent.innerHTML+child
            });
        }
    }catch(err){
        console.log("err in showLeaderBoard")
    }
}