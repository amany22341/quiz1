let QuestionsCount=document.querySelector(".count span")
let answerri=document.querySelector(".result span")


let bulletspanscontainer=document.querySelector(".bullets .spans")
let bullets=document.querySelector(".bullets")

let quizarea=document.querySelector(".quiz-area")
let answersarea=document.querySelector(".answers-area")
let submit=document.querySelector(".submit-button")
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");



let currentindex=0;
let rightanswer=0;
let countdownInterval;





function getQuestions(){
    let myRequest= new XMLHttpRequest();
    myRequest.onreadystatechange=function(){
        if( this.readyState === 4 && this.status == 200 ){
            let questionobject=JSON.parse(this.responseText)
            let questioncount=questionobject.length
            createbullets(questioncount);
            adddata(questionobject[currentindex] ,questioncount);

            submit.onclick=() =>{
               let answeright=questionobject[currentindex]['right_answer']
                check_answer(answeright, questioncount )
                currentindex++;
                quizarea.innerHTML='';
                answersarea.innerHTML='';
                adddata(questionobject[currentindex] ,questioncount);

                hundlebullets()

                clearInterval(countdownInterval);
                countdown(10, questioncount);  
                
                showresults(questioncount)

                          }


        }
    }
    myRequest.open("GET","html.questions.json", true)
    myRequest.send()

}
getQuestions()

function createbullets(num){
    QuestionsCount.innerHTML=num;


    for(let i=0 ; i< num ; i++){
            let thebullet=document.createElement("span");
            bulletspanscontainer.appendChild(thebullet);
            if(i === 0){
                thebullet.className="on";
            }
    }
}
function adddata(qobj, qcount){
   if(currentindex < qcount){
    let titlequest=document.createElement("h1");
    let questext=document.createTextNode(qobj.title);
    titlequest.appendChild(questext);
    quizarea.appendChild(titlequest);
    for(let i =1 ; i <=4 ; i++){
        let mymain=document.createElement("div");
        mymain.className="answer";

        let inputradio =document.createElement("input");
        inputradio.type="radio";
        inputradio.name="questions";
        inputradio.id=`answer_${i}`;
        inputradio.dataset.answer=qobj[`answer_${i}`];
        if(i === 1){
            inputradio.checked=true
        }

        let labelradio =document.createElement("label");
        labelradio.htmlFor=`answer_${i}`;
        let labeltext =document.createTextNode(qobj[`answer_${i}`]);

        answersarea.appendChild(mymain)
        mymain.appendChild(inputradio)
        mymain.appendChild(labelradio)
        labelradio.appendChild(labeltext)
   }

    }
    
}

function check_answer(ranswer , qcount){
    let answers=document.getElementsByName("questions");
    let chooseanswer
    for(let i =0 ; i< answers.length ;i++ ){
        if(answers[i].checked){
            chooseanswer = answers[i].dataset.answer;
            
        }
       
    }
    if(ranswer === chooseanswer ){
        // console.log("good");
        rightanswer++
    }
    
}
function hundlebullets(){
    let bullets=document.querySelectorAll(".bullets .spans span");
    let arraybullets =Array.from(bullets);
    arraybullets.forEach((span ,index) =>{
        if(currentindex === index){
            span.className='on'
        }
    } )
}
function showresults(count){
    answerri.innerHTML=rightanswer;

    let theResults;
    if( currentindex === count ){
        quizarea.remove();
        answersarea.remove();
        submit.remove();
        bullets.remove();


    

    if (rightanswer > count / 2 && rightanswer < count) {
        theResults = `<span class="good">Good</span>, ${rightanswer} From ${count}`;
      } else if (rightanswer === count) {
        theResults = `<span class="perfect"> Perfect </span>, All Answers Is Good`;
      } else {
        theResults = `<span class="bad">Bad</span>, ${rightanswer} From ${count}`;
        
    }
    resultsContainer.innerHTML =theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
}

}
function countdown(duration, count) {
    if (currentindex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submit.click();
        }
      }, 1000);
    }
  }
