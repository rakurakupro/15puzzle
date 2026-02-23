let moveCount = 0;
let timeCount =0;
let timerId = null;
let isPlaying = false;
let card = [];

window.onload = function (){
    initGame();
    document.getElementById('reset-btn').onclick = resetGame;
}

function initGame(){

  const array = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',''];

  const board = document.getElementById('board');
  board.innerHTML = '';
  card = [];
    for(let i =0; i<16; i++){
        const div = document.createElement('div');
        div.className ='card';
        div.index = i;
        div.textContent = array[i];
        div.onclick = click;
        board.appendChild(div)
        card.push(div);
        
        }
        shuffleSolvable();
}

function startTimer(){
    if(isPlaying)return;
    isPlaying = true;
    timerId = setInterval(() => {
        timeCount++;
        document.getElementById('timer').textContent = timeCount;
    }, 1000);
}
function stopTimer(){
    clearInterval(timerId);
    isPlaying = false;
}
function resetGame(){
    stopTimer();
    timeCount = 0;
    moveCount = 0;
    document.getElementById('timer').textContent = '0';
    document.getElementById('moves').textContent = "0";
    initGame();
}
async function shuffleSolvable(){
    let steps = 100;
    for (let s =0; s< steps; s++){
        let emptyIdx = card.findIndex(c => c.textContent === '');

        let neighbors = [];
        if(emptyIdx <= 5)neighbors.push(emptyIdx + 3);
        if(emptyIdx >= 3)neighbors.push(emptyIdx - 3);
        if(emptyIdx % 3 !==2)neighbors.push(emptyIdx + 1);
        if(emptyIdx %3 !==0)neighbors.push(emptyIdx -1);
        let targetIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
        swap(emptyIdx,targetIdx);

        await new Promise(resolve => setTimeout(resolve,10));
    }
}

function swap(i,k){
 let temp = card[i].textContent;
 card[i].textContent = card[k].textContent;
 card[k].textContent = temp;

 card[i].classList.add('moved');
 card[k].classList.add('moved');
 setTimeout(() => {
    card[i].classList.remove('moved');
    card[k].classList.remove('moved');
 },200)
 updateEmptyStyle(i);
 updateEmptyStyle(k);
}
function updateEmptyStyle(index){
    if(card[index].textContent === ''){
        card[index].setAttribute('data-empty','true')
    }else{
        card[index].removeAttribute('data-empty');
    }
}


function click(e){
    let i = e.target.index;
    let moved = false;

    if(!isPlaying)startTimer();

    if(i <=11 && card[i + 4].textContent === ''){
        swap(i,i + 4);
        moved = true;
    }else if (i >= 4 && card[i -4].textContent === ''){
        swap(i,i-4);
        moved = true;
    }else if(i % 4 !== 3 && card[i + 1].textContent ===''){
        swap(i,i+1);
        moved = true;
    }else if(i % 4 !== 0 && card[i - 1].textContent ===''){
        swap(i, i - 1);
       moved = true;
    }
    if(moved){
        moveCount++;
        document.getElementById('moves').textContent = moveCount;
        checkWin();
    }
}

function checkWin(){
    const answer = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',''];
   const current = card.map(c => c.textContent);
   if(current.join(',') === answer.join(',')){
    stopTimer();
    card.forEach((c,index) => {
        setTimeout(() => {
            if(c.textContent !== '')c.classList.add('win-animation');
         },index * 50);
        });
        setTimeout(() =>{
            alert(`クリア!\nタイム: ${timeCount}秒\n手数:${moveCount}回`);
        },500);
        } 
   }
   