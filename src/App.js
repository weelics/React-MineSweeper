import { useCallback, useEffect, useState } from "react";
import Block from "./components/block";
import createTable from "./module/createTable";

const nCOL = 9;
const length = 11;
const nMine = 10;
let cssFinishGame = "";

function App() {
  const [board, setBoard] = useState(createTable(nCOL, length, nMine));
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);
  const [mine, setMine] = useState(nMine);
  const [inClicks, setInClicks] = useState(true);
  const [timer, setTimer] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      !over ? setTimer((old) => old + 1) : setTimer(timer);
    }, 1000);
    return () => clearInterval(interval);
  }, [over, timer]);

  const reset = () => {
    setOver(false);
    setTimer(0);
    setShow(false);
    setMine(nMine);
    setBoard(createTable(nCOL, length, nMine));
  };

  const verify = useCallback(() => {
    let cont = 0;
    board.forEach((element) => {
      cont += element.filter((item) => item.isVisible === true).length;
    });
    if (cont >= nCOL * length - nMine) return true;
    else return false;
  }, [board]);

  const setVisible = useCallback(
    (row, col) => {
      board[row][col].isVisible = true;
    },
    [board]
  );

  const endGame = () => {
    setOver(true);
    setMine(nMine);
    setShow(true);
  };

  const gameOver = useCallback(() => {
    setAlert("HAI PERSO!");
    cssFinishGame = "bg-red-600 ";
    endGame();
  }, []);

  const gameWin = useCallback(() => {
    setAlert("HAI VINTO!");
    cssFinishGame = "bg-green-600 color-red-500";
    endGame();
  }, []);

  const check = useCallback(
    (row, col) => {
      if (row < 0 || row >= length || col < 0 || col >= nCOL) return;
      if (board[row][col].isBomb) return;
      if (
        board[row][col].value === 0 &&
        board[row][col].isVisible === false &&
        board[row][col].isFlagged === false
      ) {
        board[row][col].isVisible = true;
        check(row - 1, col - 1);
        check(row - 1, col);
        check(row, col - 1);
        check(row + 1, col + 1);
        check(row + 1, col);
        check(row, col + 1);
        check(row - 1, col + 1);
        check(row + 1, col - 1);
      } else if (
        board[row][col].value !== 0 &&
        board[row][col].isFlagged === false
      ) {
        board[row][col].isVisible = true;
      }
    },
    [board]
  );

  const checkBoard = useCallback(
    (key) => {
      const row = Math.floor(key / nCOL);
      const col = key % nCOL;

      if (!inClicks) {
        if (mine === 0 && !board[row][col].isFlagged) return;

        board[row][col].isFlagged = !board[row][col].isFlagged;
        setBoard([...board]);

        if (board[row][col].isFlagged && !board[row][col].isVisible) {
          setMine((old) => old - 1);
        } else if (!board[row][col].isFlagged && !board[row][col].isVisible) {
          setMine((old) => old + 1);
        }
        return;
      }

      if (board[row][col].isFlagged) return;

      if (board[row][col].isBomb) gameOver();

      check(row, col);
      setVisible(row, col);
      setBoard([...board]);
      if (verify()) gameWin();
    },
    [board, check, gameOver, gameWin, inClicks, mine, setVisible, verify]
  );

  return (
    <div className="mx-auto bg-[#C0C0C0] gap-4 md:max-w-min flex flex-col">
      <div
        className="bg-[#9f9f9f] p-2 border-t-4 border-l-4 
        border-b-4 border-r-4 rounded-xl
        border-t-gray-300 border-l-gray-300
        border-b-gray-600 border-r-gray-600"
      >
        <div className="flex justify-between p-1 items-center">
          <p className="text-4xl text-red-500 bg-gray-800 w-[33%] h-10 rounded-full text-center">
            {timer}
          </p>
          <span className="p-1 bg-yellow-400 hover:bg-red-500 rounded-full border-8 border-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16"
              onClick={() => {
                reset();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </span>

          <p className="text-4xl text-red-500 bg-gray-800 w-[33%] h-10 rounded-full text-center">
            {mine}
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
          className="relative flex flex-col md:items-center border-t-4 border-l-4 
        border-b-4 border-r-4
        border-b-gray-300 border-r-gray-300
        border-t-gray-600 border-l-gray-600"
        >
          {show && (
            <div
              className={`absolute ${cssFinishGame} opacity-80 top-0 w-full h-full flex justify-center items-center`}
            >
              <p className="text-6xl font-extrabold text-center">{alert}</p>
            </div>
          )}
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
        border-b-4 border-r-4 rounded-xl
        border-t-gray-300 border-l-gray-300
        border-b-gray-600 border-r-gray-600"
      >
        <div className="flex justify-around items-center ">
          <svg
            onClick={() => setInClicks(true)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${
              inClicks ? "border-green-600" : "border-gray-500"
            } w-20 h-20 border-8 rounded-full  bg-gray-800 fill-red-600 hover:fill-amber-500`}
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 
                011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 
                1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 
                01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601
                1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 
                0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 
                1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>

          <svg
            onClick={() => setInClicks(false)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="red"
            className={`${
              inClicks ? "border-gray-500" : "border-green-600"
            } w-20 h-20 p-2 border-8 rounded-full bg-gray-800 fill-red-600 hover:fill-amber-500`}
          >
            <path
              fillRule="evenodd"
              d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75
               0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25
               0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default App;
