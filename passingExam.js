
// start the exam list

let examList = document.querySelector(".examsList");

let noExamAvailable = document.querySelector(".noExamAvailable");



for(let key in localStorage){
    if(key.startsWith("exam")){
        noExamAvailable.style.cssText="display:none";
        // count the questions's number
        let exam = JSON.parse(localStorage.getItem(key));
        let questionsNumber = 0 ; 
        for(let i = 0 ; i < exam.Questions.length ; i++){
            questionsNumber++;
        }
        // end counting 
        let examHolder = document.createElement("div");
        // examHolder.setAttribute("exam-id" , exam.id);
        examHolder.innerHTML = `           
             <div class="info">
                <p><b>Exam : ${exam.title}</b></p>
                <p><b>number of questions : </b>${questionsNumber}</p> 
                <p><b>description :</b> this exam is designed to let you gain a good knowledge about ${exam.title} .</p> 
                <p><b>Group Destination : </b> ${exam.group}</p>
            </div>
            <div class="button"><button exam-id="${exam.id}" class="startExam">start the exam</button></div>
        `;
        examList.appendChild(examHolder);
    }
}

// end the exam list


// start clicking to pass exam part

examList.addEventListener("click" , (event)=>{
    const target = event.target ; 
    const buttonStart = target.closest("button[exam-id]");
    const examId = buttonStart?.getAttribute("exam-id");


    if(buttonStart){
        window.open(`passingArea.html?examId=${examId}` , '_blank');
    }
        
})

// end clicking to pass exam part