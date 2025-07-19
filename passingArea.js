
function getExamIdFromURL(){
    const params = new URLSearchParams(window.location.search);
    return params.get('examId');
}

const examTakenId = getExamIdFromURL();

// start checking here where is the exam the student will pass 

for(let key in localStorage){
    if(key.startsWith("exam")){
        var exam = JSON.parse(localStorage.getItem(key));
        if(exam.id == examTakenId){
            console.log(exam);
            var questions = [] ;
            for(let i = 0 ; i<exam.Questions.length ; i++){
                let questionInfo = {
                    questionTitle : exam.Questions[i].questionName,
                    choices : [
                        exam.Questions[i].choix1 ,
                        exam.Questions[i].choix2,
                        exam.Questions[i].choix3,
                        exam.Questions[i].choix4 
                    ] ,
                    duration : exam.Questions[i].duration,
                    mark : exam.Questions[i].mark ,
                    response : exam.Questions[i].response
                }
                questions.push(questionInfo);
            }
        }
    }
}

// end checking here where is the exam the student will pass 



// add the elements
let questionText = document.querySelector(".questionText p");
let choice1 = document.querySelector(".choice1");
let choice2 = document.querySelector(".choice2");
let choice3 = document.querySelector(".choice3");
let choice4 = document.querySelector(".choice4");
let questionTimerHtml = document.querySelector(".questionTimer");
let buttonNext = document.querySelector(".buttonNext button");

// apply the background color each click on the answers 
let choices = [choice1, choice2, choice3, choice4];

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        choices.forEach((c) => {
            c.classList.remove("click");
        });
        choice.classList.add("click");
    });
});

// and this is the array of questions (we already created it earlier, watch the lines above)
console.log(questions);

// function to pass to every question after every duration that is set to the question
let examMark = 0;



function continueTheLoop(i) {
    let questionTimer = questions[i - 1].duration;
    questionTimerHtml.innerHTML = questionTimer ;

    questionText.innerHTML = `${i}-${questions[i - 1].questionTitle}`;
    choice1.innerHTML = `A) ${questions[i - 1].choices[0]}`;
    choice2.innerHTML = `B) ${questions[i - 1].choices[1]}`;
    choice3.innerHTML = `C) ${questions[i - 1].choices[2]}`;
    choice4.innerHTML = `D) ${questions[i - 1].choices[3]}`;

    // now we will set an attribute to each value so that we can
    // compare them later to see if the answer is correct or not
    questionText.setAttribute("question", questions[i - 1].questionTitle);

    choice1.setAttribute("answer", questions[i - 1].choices[0]);
    choice2.setAttribute("answer", questions[i - 1].choices[1]);
    choice3.setAttribute("answer", questions[i - 1].choices[2]);
    choice4.setAttribute("answer", questions[i - 1].choices[3]);

    let timer = setInterval(() => {
        questionTimer--;
        questionTimerHtml.innerHTML = questionTimer;
        if (questionTimer < 0) {
            handleNextClick();
        }
    }, 1000); // Changed to 1000ms (1 second) for accurate timing

    let choices2 = [choice1, choice2, choice3, choice4];
    
    function handleNextClick() {
        buttonNext.removeEventListener("click", handleNextClick);
        clearInterval(timer);

        choices2.forEach((choice) => {
            if (choice.classList.contains("click")) {
                console.log("yes it contains !");
                console.log(`choice answer : ${choice.getAttribute("answer")}`);
                console.log(`correct answer : ${questions[i - 1].response}`);
                console.log(choice.getAttribute("answer") === questions[i - 1].response);
                if (choice.getAttribute("answer") === questions[i - 1].response) {
                    examMark += parseInt(questions[i - 1].mark);
                    console.log(examMark);
                }
            }
            choice.classList.remove("click"); // Clear click class for all choices
        });

        if (questions[i]) {
            continueTheLoop(i + 1);
        } else {
            let exam = JSON.parse(localStorage.getItem(`exam${examTakenId}`));
            let totalScore = (examMark * 100) / exam.sumMarks;
            console.log("######################");
            console.log(totalScore);
            console.log(examMark*100);
            console.log(exam.sumMarks);
            document.querySelector(".questionsAndChoicesHandler").style.cssText = 'display: none;';
            document.querySelector(".result").style.cssText = "opacity: 1;";
            document.querySelector(".score").innerHTML = `${Math.trunc(totalScore)}%`;
            if (totalScore < 50) {
                document.querySelector(".lordIcon").style.cssText = "display: none;";
                document.querySelector(".quizFinished").style.cssText = "color: red;";
                document.querySelector(".endMessage").innerHTML = "You have Failed !, Good luck next time 🙌";
                document.querySelector("img.failing").style.cssText = "opacity: 1; margin-left: 20px;";
            } else if (totalScore == 50) {
                document.querySelector(".quizFinished").style.cssText = "color: orangered;";
                document.querySelector(".endMessage").innerHTML = "Come On ! You can do more than this 😎";
                document.querySelector("img").style.cssText = "opacity: 1;";
            }
        }
    }

    // Remove previous event listeners to prevent stacking
    buttonNext.addEventListener("click", handleNextClick);
}

let i = 1;
continueTheLoop(i);


console.log(document.querySelector(".returnToList"));

document.querySelector(".returnToList").addEventListener("click",()=>{
    if (window.opener) {
        window.opener.location.href = window.opener.location.href;
        window.location.href='passingExam.html';
        window.close(); // optionally close the popup
    }
})