const amount=document.getElementById("amount")
const description=document.getElementById("description")
const category=document.getElementById("category")
const addExpense=document.getElementById("expense")
const allExpenses=document.getElementById("allExpenses")

//Fetching the expense from database
window.addEventListener("DOMContentLoaded",async()=>{
   try{
        const tokenId=localStorage.getItem("token")
        const data=await axios.get("http://localhost:5200/expense/get-expense",{headers:{"Authorization":tokenId}})
        console.log(data)
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

//Addin a expense to the database
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
        if(data.data.success){
            document.getElementById("razorpay").remove()
            const addTexts=document.getElementById("addText")
            const text=document.createTextNode("successfully purchased premium")
            addTexts.appendChild(text)
        }
        alert("payment successfully done")
    },
   }
const raz1=new Razorpay(option)
raz1.open()
e.preventDefault()
 raz1.on("payment.failed",async function(){  
    const key=resource.data.order.id
    
    const response=await axios.post("http://localhost:5200/purchase/updatePremium",{
        "order_id":key,
        "payment_id":null
    },{headers:{"Authorization":token} })
    
    alert(response.data.message)
})
}
