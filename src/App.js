import { useCallback, useState } from "react";
import Block from "./components/block";
import createTable from "./module/createTable";

const length = 9;
const nMine = 10;
let mineInGame = nMine;
let winnerMine = 0;
let cssFinishGame = "";

const initBoard = () => createTable(length, nMine);


function App() {

  const [board, setBoard] = useState(initBoard);
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState(nMine);
  const [inClicks,setInClicks] = useState(true);

  const reset = () => {
    setShow(false);
    mineInGame = nMine;
    winnerMine = 0;
    setPoints(mineInGame);
    setBoard(initBoard);
  }

  const setVisible = useCallback((row,col) => {
    board[row][col].isVisible = true;
  },[board]);

  function gameOver() {
    setAlert("HAI PERSO!");
    cssFinishGame = "bg-red-600";
    setPoints(nMine);
    setShow(true);
  }

  const gameWin = () => {
    setAlert("HAI VINTO!");
    cssFinishGame = "bg-green-600";
    setPoints(nMine);
    setShow(true);
  }

  const check = useCallback ((row, col) => {
    if (row < 0 || row >= length || col < 0 || col >= length) return;
    if (board[row][col].isBomb) return;
    if (board[row][col].value === 0 && board[row][col].isVisible === false) {
      board[row][col].isVisible = true;
      check(row - 1, col - 1);
      check(row - 1, col);
      check(row, col - 1);
      check(row + 1, col + 1);
      check(row + 1, col);
      check(row, col + 1);
      check(row - 1, col + 1);
      check(row + 1, col - 1);
    } else if(board[row][col].value !== 0){
      board[row][col].isVisible = true;
    }

  },[board]);

  const checkBoard = useCallback((key) =>{

    const row = Math.floor(key / length);
    const col = (key % length);
    if(!inClicks) {
      if(mineInGame === 0 && !board[row][col].isFlagged) return;
      board[row][col].isFlagged = !board[row][col].isFlagged;
      setBoard([...board]);
      if(board[row][col].isFlagged && !board[row][col].isVisible) {
        if(board[row][col].isBomb) winnerMine++;
        mineInGame--;
      }
      else if(!board[row][col].isFlagged && !board[row][col].isVisible) {
        if(board[row][col].isBomb) winnerMine--;
        mineInGame++;
      }
      setPoints(mineInGame);
      if(winnerMine === nMine) gameWin();

      console.log("mineInGame: " + mineInGame + " winnerMine: " + winnerMine);
      return;
    }
    if(board[row][col].isFlagged) return;
    if(board[row][col].isBomb) gameOver();
    check(row,col);
    setVisible(row,col);
    setBoard([...board]);
  },[board, check, inClicks, setVisible]);

  return (
    <div className="mx-auto relative bg-[#C0C0C0] gap-4 md:max-w-min flex flex-col">
      {show && (
        <div className={`absolute ${cssFinishGame} opacity-60 top-[135px] w-full h-[357px] md:h-[394px] flex justify-center items-center`}><p className="text-8xl font-extrabold text-cyan-500 text-center">{alert}</p></div>
      )}
      <div
        className="bg-[#9f9f9f]  p-2 border-t-4 border-l-4 
        border-b-4 border-r-4
        border-t-gray-300 border-l-gray-300
        border-b-gray-600 border-r-gray-600"
      >
        <div className="flex justify-between p-5 items-center">
          <p className="text-4xl text-red-500 bg-gray-800 w-[33%] h-10 text-center">
            {"23:12"}
          </p>
          <svg
            onClick={() => {
              reset();
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="yellow"
            className="w-14 h-14 text-center border-1 rounded-full bg-gray-800 border-gray-800 hover:stroke-yellow-300"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
              clipRule="evenodd"
            />
          </svg>

          <p className="text-4xl text-red-500 bg-gray-800 w-[33%] h-10 text-center">
           {points}
          </p>
        </div>
      </div>
      <div
        className="bg-[#9f9f9f]  p-2 border-t-4 border-l-4 
        border-b-4 border-r-4
        border-t-gray-300 border-l-gray-300
        border-b-gray-600 border-r-gray-600"
      >
        <div
          className="flex flex-col md:items-center border-t-4 border-l-4 
        border-b-4 border-r-4
        border-b-gray-300 border-r-gray-300
        border-t-gray-600 border-l-gray-600"
        >
          {board.map((grid) => {
            return (
              <div className="flex">
                {grid.map((row) => {
                  return (
                    <Block
                    content={row}
                    checkBoard={() => checkBoard(row.key)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="bg-[#9f9f9f]  p-2 border-t-4 border-l-4 
        border-b-4 border-r-4
        border-t-gray-300 border-l-gray-300
        border-b-gray-600 border-r-gray-600"
      >
        <div className="flex justify-around items-center ">

          <svg 
          onClick={() => setInClicks(true)} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${inClicks ? 'border-green-600' : 'border-gray-500'} w-20 h-20 border-8 rounded-full  bg-gray-800 fill-red-600 hover:fill-amber-500`}>
            <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>

          <svg 
          onClick={() => setInClicks(false)} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className={`${inClicks ? 'border-gray-500' : 'border-green-600'} w-20 h-20 border-8 rounded-full bg-gray-800 fill-red-600 hover:fill-amber-500`}>
            <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
          </svg>

        </div>
      </div>
    </div>
  );
}

export default App;
