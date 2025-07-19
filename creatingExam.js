/*##################################### */

// functions

function NoQuestions(){
    if(document.querySelector("div.questionsolder").children.length==0){
        document.querySelector(".youHaveNoQuestions").style.cssText="display:block;";
    }else{
        document.querySelector(".youHaveNoQuestions").style.cssText="display:none;";
    }
}


// end functions

/*##################################### */

// start the form




let myFormHolder  = document.querySelector("div.form");
let myForm = document.querySelector("div.form form.myForm");
let createExamImage = document.querySelector("div.form > img");


let examId = 0 ; 
myForm.addEventListener("submit" , (event)=>{
    event.preventDefault();

    const ExamPrincipalInfo = {
        name : myForm.title.value ,
        group: myForm.group.value ,
    };
    localStorage.setItem("ExamPrincipalInfo" , JSON.stringify(ExamPrincipalInfo));
    myFormHolder.style.cssText="display:none";
    document.querySelector("div.form2").style.cssText="display:flex;";
    document.querySelector(".hasQuestions").style.cssText="display:block;";
    const titleExam = JSON.parse(localStorage.getItem("ExamPrincipalInfo"));
    document.querySelector("span#title2").textContent = titleExam.name;
    examId++;
});


window.onload = ()=>{
    myForm.style.cssText = "transform:translateX(0px)";
    createExamImage.style.cssText = "transform:translateX(0px)";
};

let titleInput = document.querySelector("input[name='title']");

let title = document.getElementById("title");


titleInput.addEventListener("input" , ()=>{
    title.textContent = titleInput.value  ;
    if(titleInput.value.length == 0){
        title.textContent = "(enter a title)";
    }
});



let questionChoices = document.querySelector("select[name='response']");


for(let i = 0; i<4 ; i++){
    document.querySelector(`input[name='choix${i+1}']`).addEventListener("input", ()=>{
    questionChoices[i].value = document.querySelector(`input[name='choix${i+1}']`).value; 
    questionChoices[i].textContent = questionChoices[i].value;
    if(document.querySelector(`input[name='choix${i+1}']`).value==0){
        questionChoices[i].textContent = `choix${i+1}`;
    }
});
}


let i = 1 ; 

document.querySelector(".addQuestion").addEventListener("click"  , ()=> {
    const questionInfo = {
        questionName : document.querySelector("input[name='question']").value,
        choix1 : document.querySelector("input[name='choix1']").value,
        choix2 : document.querySelector("input[name='choix2']").value,
        choix3 : document.querySelector("input[name='choix3']").value,
        choix4 : document.querySelector("input[name='choix4']").value,
        response : document.querySelector("select[name='response']").value,
        mark : document.querySelector("input[name='mark']").value,
        duration : document.querySelector("input[name='duration']").value,
    };
    if (
    !questionInfo.questionName || !questionInfo.choix1 || !questionInfo.choix2 || !questionInfo.choix3 ||
    !questionInfo.response || !questionInfo.mark || !questionInfo.duration
    ) {
    alert("Please fill in all fields before adding the question.");
    return; // stop execution
    }
    localStorage.setItem( `question${i}` , JSON.stringify(questionInfo));
    let newDiv = document.createElement("div");
    newDiv.setAttribute("data-id", i );
    newDiv.innerHTML = `
        <p>${questionInfo.questionName}</p>
        <p>Choix 1: ${questionInfo.choix1}</p>
        <p>Choix 2: ${questionInfo.choix2}</p>
        <p>Choix 3: ${questionInfo.choix3}</p>
        <p>Choix 4: ${questionInfo.choix4}</p>
        <p>Response: ${questionInfo.response}</p>
        <p>Mark: ${questionInfo.mark}</p>
        <p>Duration: ${questionInfo.duration}</p>
        <button class="delete">Delete</button>
        <button class="modify">Modify</button>
    `;
    document.querySelector(".questionsolder").appendChild(newDiv);
    document.querySelector("div.form2 form").querySelectorAll("input , select").forEach(field => {
        if(field.type === "checkbox" || field.type === "radio"){
            field.checked = false ; 
        }else {
            field.value = "";
        }
    });
    i++ ;
    document.querySelector(".youHaveNoQuestions").style.cssText="display:none;";
}); 


let myForm2 = document.querySelector("div.form2 form.myForm2");


document.querySelector("div.questionsolder").addEventListener("click" , (event)=>{
    const target = event.target ; 
    const questionDiv = target.closest("div[data-id]");
    const questionId  = questionDiv?.getAttribute("data-id");

    if(target.classList.contains("delete")){
        if(confirm("are you sure you want to delete this question ?")){
            questionDiv.remove();
            localStorage.removeItem(`question${questionId}`);
            NoQuestions();
        }
    }
    if(target.classList.contains("modify")){
        const data = JSON.parse(localStorage.getItem(`question${questionId}`));
        if(!data){
            alert("question not found !");
        }
        myForm2.question.value = data.questionName ; 
        myForm2.choix1.value = data.choix1 ;
        myForm2.choix2.value = data.choix2 ;
        myForm2.choix3.value = data.choix3 ;
        myForm2.choix4.value = data.choix4 ;
        myForm2.response.value = data.response ; 
        myForm2.mark.value  = data.mark;
        myForm2.duration.value = data.duration ;

        questionDiv.remove();
        localStorage.removeItem(`question${questionId}`);
    }
});

// let examId = 1;

document.querySelector("form.myForm2 button.addExam").addEventListener("click" , (event)=>{
    questions = [] ;
    let totalMark = 0 ; 
    for(let key in localStorage){
        if(key.startsWith("question")){
            questions.push(JSON.parse(localStorage.getItem(key)));
            totalMark += parseInt(JSON.parse(localStorage.getItem(key)).mark) ;
        }
    }
    if(questions.length==0){
        alert("you have not created any questions yet !");
        return;
    }
    const exam = {
        title : JSON.parse(localStorage.getItem("ExamPrincipalInfo")).name ,
        group : JSON.parse(localStorage.getItem("ExamPrincipalInfo")).group,
        id : examId ,
        Questions : questions ,
        sumMarks : totalMark ,
    }



    localStorage.setItem(`exam${examId}` , JSON.stringify(exam));
    for(key in localStorage){
        if(key.startsWith("question")){
            localStorage.removeItem(key);
        }
    }

    [...document.querySelector("div.questionsolder").children].forEach(el=>el.remove());
    let newDiv = document.createElement("div");
    newDiv.setAttribute("exam-id" , examId);
    newDiv.className = "examBlock" ;
    newDiv.innerHTML = `
            <p style="font-weight:bold;text-align:center;margin-bottom:10px">title : ${exam.title}</p>
            <p>group : ${exam.group}</p>
            <p>questions : <p>
    `;

    for(let i = 0 ; i<exam.Questions.length ; i++){
        let parag = document.createElement("p");
        parag.textContent = exam.Questions[i].questionName;
        newDiv.appendChild(parag);
    }
    let buttonDeleteExam = document.createElement("button");
    buttonDeleteExam.className="deleteExam";
    buttonDeleteExam.textContent = "delete";
    newDiv.append(buttonDeleteExam);
    alert("Your exam has been saved successfully.");
    // examId++;
    document.querySelector(".youHaveNoQuestions").style.cssText="display:block;";
    document.querySelector("div.form2").style.cssText = "display:none;";
    document.querySelector(".hasQuestions").style.cssText = "display:none";
    document.querySelector("div.form").style.cssText = "display:flex";
});



document.querySelector("div.form2 form").addEventListener("submit" , (event)=>{
    event.preventDefault();
});



// end the form

