
const mainForm = document.querySelector('#mainForm');


// editBtn.addEventListener('click',function () {
//     console.log("EDIT CLICKED")
//     editForm.classList.toggle('hide')
//     mainForm.classList.toggle('hide')
//     reviewContent.classList.toggle('hide')
// })

function toggle(id) {
    console.log("ID IS : " , id)
    const review = document.querySelector(`#reviewContent${id}`);
    const editForm = document.querySelector(`#editForm${id}`);
    review.classList.toggle('hide')
    editForm.classList.toggle('hide')
    
}

