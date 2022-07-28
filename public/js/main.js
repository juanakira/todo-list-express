// Declaring variables at pageload
    // Makes a Nodelist of...
        //all the elements with the class 'fa-trash' (trash icons)
const deleteBtn = document.querySelectorAll('.fa-trash')
        //all the span elements inside of a parent with the class 'item'
const item = document.querySelectorAll('.item span')
        //all the span elements inside of a parent with the class 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Making an array to be able to iterate and adding an event listener to each el. in the array for clicks on it
    // for the delete buttons (span with the trash icons), call the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
    // for the empty items, on the span inside the li, call the markComplete function
Array.from(item).forEach((element)=>{
    console.log(item)
    element.addEventListener('click', markComplete)
})
    // for the completed item, on the span inside the li, call the markUncomplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Function called with on the elements to be completed (by the Ev.L)

async function markComplete(){
    // takes the text from the 2nd child node of parent item that you click on (trash can -> li -> span )
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send a put request with the parameters below and assign the response to a variable
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //turn the response into a JSON, log it, and reload the page
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Function called (by the Ev.L) on the elements to be uncompleted 

async function markUnComplete(){
    // takes the text from the 2nd child node of parent item that you click on (trash can -> li -> span )
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetches a response from the PUT request sent with properties below
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //turn the response into a JSON, log it, and reload the page
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


// // Function called with on the elements to be deleted (by the Ev.L)

async function deleteItem(){
    // takes the text from the 2nd child node of parent item that you click on (trash can -> li -> span )
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetches a response from the DELETE request with said properties
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //turn the response into a JSON, log it, and reload the page  
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

