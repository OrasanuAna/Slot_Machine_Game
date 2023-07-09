
const prompt = require("prompt-sync")(); //librarie

//variabile globale
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2, //cheie/proprietatea/atribut i se atribuie o valoare
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

function deposit () { //functie cane ne ajuta sa introducem o summa de bani

  while(true) {
   const depositAmount = prompt("Enter a deposit amount: ");
   const numberDepositAmount = parseFloat(depositAmount);
   //varificam daca valoarea nu este un numar valid
   if(isNaN(numberDepositAmount) || numberDepositAmount<=0){
     console.log("Invalid deposit amount, try again.");
   } else{
    return numberDepositAmount;
  }
 }
};

const getNumberOfLines = () => { //functie care ne ajuta sa introducem numarul de linii pe care vrem sa pariem
  while(true) {
    const lines = prompt("Enter a number of lines to bet on (1-3): ");
    const numeberOfLines = parseFloat(lines);
    //varificam daca valoarea nu este un numar
    if(isNaN(numeberOfLines) || numeberOfLines <= 0 || numeberOfLines > 3){
      console.log("Invalid numeber of lines, try again.");
    } else{
     return numeberOfLines;
   }
  }
};

const getBet = (balance, lines) => { //functie care ne ajuta sa introducem suma pariata pe fiecare linie
  while(true) {
    const bet = prompt("Enter a bet amount per line: ");
    const numberBet = parseFloat(bet);
    //varificam daca valoarea este valida
    if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
      console.log("Invalid bet amount, try again.");
    } else{
     return numberBet;
   }
  }
};

//genereaza simboluri aleatorii pentru fiecare coloana si le returneaza intr-un array/lista de array/liste (reels)
const spin = () => {

//array/lista goala care va contine simbolurile generate aleatoriu pentru fiecare coloana
   const symbols = [];

//pentru fiecare cheie/proprietate/atribut din SYMBOLS_COUNT (in cazul nostru A,B,C,D) si valoarea ei (in cazul nostru 2,4,6,8) ruleaza for-ul de mai jos
   for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)){

//ruleaza de la 0 pana la count (in cazul nostru 2,4,6,8) si adauga simbolul (in cazul nostru A,B,C,D) in array/lista
     for(let i=0; i<count; i++){

//adauga simbolul in array/lista de simboluri generate aleatoriu pentru fiecare coloana
       symbols.push(symbol);
     }
   }

//va contine simbolurile generate aleatoriu pentru fiecare coloana
   const reels = [];

//ruleaza de la 0 pana la 3 (numarul de coloane) si adauga un array/lista gol in array/lista reels
   for(let i=0; i<COLS; i++){
      reels.push([]);

//copiem simbolurile generate aleatoriu in reelSymbols pentru a nu se repeta simbolurile pe aceeasi coloana (in cazul nostru 0,1,2,3)
      const reelSymbols = [...symbols];

//ruleaza de la 0 pana la 3 (numarul de randuri)
      for(let j=0; j<ROWS; j++){

//genereaza un numar aleatoriu intre 0 si lungimea array/listei reelSymbols (in cazul nostru 4)
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);

//selecteaza simbolul de la indexul generat aleatoriu (in cazul nostru 0,1,2,3) din array/lista reelSymbols
        const selectedSymbol = reelSymbols[randomIndex];

//adauga simbolul in array/lista reels de pe coloana i (in cazul nostru 0,1,2)
        reels[i].push(selectedSymbol);

//sterge simbolul din array/lista reelSymbols pentru a nu se repeta simbolurile pe aceeasi coloana (in cazul nostru 0,1,2,3)
        reelSymbols.splice(randomIndex, 1);
      }
    }
    return reels; //returneaza array/lista reels care contine simbolurile generate aleatoriu pentru fiecare coloana
};

const transpose = (reels) => { //functie care ne ajuta sa transpunem matricea
    const rows = [];

    for(let i=0; i<ROWS; i++){
      rows.push([]);
      for(let j=0; j<COLS; j++){
        rows[i].push(reels[j][i]);
      }
    }
    return rows;
};

const printRows = (rows) => { //functie care ne ajuta sa afisam matricea
  for(const row of rows){
     let rowString = "";
     for(const [i,symbol] of row.entries()){
        rowString += symbol;
        if(i != row.length - 1){
          rowString += " | ";
        }
     }
     console.log(rowString);
 }
};

const getWinning = (rows, bet, lines) => { //functie care ne ajuta sa calculam castigul
  let winning = 0;

   for(let row = 0; row < lines; row++){
     const symbols = rows[row];
     let allSame = true; //presupunem ca toate simbolurile sunt la fel
 
      for(const symbol of symbols){
         if(symbol != symbols[0]){ //daca simbolul nu este la fel cu primul simbol
           allSame = false; //atunci toate simbolurile nu sunt la fel
           break;
         }
      }
      if(allSame){ //daca toate simbolurile sunt la fel
      //atunci castigul este egal cu valoarea simbolului inmultit cu suma pariata pe fiecare linie (in cazul nostru 5,4,3,2) 
        winning += SYMBOLS_VALUES[symbols[0]] * bet;
    }
  }
  return winning;
};
//apelarea functiilor

const game = () => {

let balance = deposit();

 while(true){
    console.log(`Your balance is $` + balance.toString() + `.`);
   const numberOfLines = getNumberOfLines();
   const bet = getBet(balance, numberOfLines);
   balance -= bet * numberOfLines;
   const reels = spin();
   const rows = transpose(reels);
   console.log(reels);
   console.log(rows);
   printRows(rows);
   const winning = getWinning(rows, bet, numberOfLines);
   balance += winning;
   console.log(`You won $` + winning.toString() + `!`);

   if(balance <= 0){
     console.log("You lost all your money!");
     break;
   }
    const playAgain = prompt("Do you want to play again? (y/n): ");
    if(playAgain != "y") break;
 }
};

game();