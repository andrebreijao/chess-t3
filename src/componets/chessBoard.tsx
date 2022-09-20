import { useEffect, useState } from "react";
import { Chess, Piece } from "chess.js";
import { Chessboard, Square } from "react-chessboard";
import axios from "axios";

export default function ChessBoard() {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const [name, setName] = useState<string | null>(null);
  const [input, setInput] = useState<string | undefined>(undefined);
  const [game, setGame] = useState<string>(initialFen);
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const sendFenToServer = async (fen: string) => {
    const response = await axios.post("/api/boardState", { state: fen });
    return response;
  };

  const onDrop = async (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ) => {
    const currentGame = new Chess(game);

    // Get the first letter of the piece
    const pieceLetter = piece.charAt(0);

    if (
      (color === "white" && pieceLetter === "b") ||
      (color === "black" && pieceLetter === "w")
    )
      return;

    let move;
    if (
      (piece === "wP" && targetSquare.slice(-1) === "8") ||
      (piece === "bP" && targetSquare.slice(-1) === "1")
    ) {
      move = currentGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } else {
      move = currentGame.move({
        from: sourceSquare,
        to: targetSquare,
      });
    }

    if (move === null) return false;

    try {
      setGame(currentGame.fen());
      await sendFenToServer(currentGame.fen());
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const refreshFenFromServer = async () => {
      const serverFen = await axios.get("/api/boardState");
      console.log("serverFen", serverFen);
      setGame(serverFen.data);
    };

    const poolling = async () => {
      console.log("poolling");
      const interval = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
      await refreshFenFromServer();

      poolling();
    };
    poolling();
  }, []);

  /*
  useEffect(() => {
    // disconnect if the user leaves the page
    const handleTabClose = (event) => {
      event.preventDefault();

      console.log("beforeunload event triggered");

      return axios.post("/api/disconnect", { name: name });
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      const disconnect = async () => {
        try {
          await axios.post("/api/disconnect", { name: name });
          setColor(null);
        } catch (error) {
          console.error("disconnect", error);
        }
      };
      disconnect();
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [name]);
  */

  // Create an error div if the user tries to join a game that is full
  const ErrorDiv = () => {
    return (
      <div className="text-white text-base bg-red-900 p-4 m-4">
        Game already full, please try again later
      </div>
    );
  };

  const handleSignIn = async (newName: string | undefined) => {
    if (!input) return;
    // const response = await axios.post("/api/connect", { name: newName });
    // const { color: newColor } = response.data;
    if (input === "white" || input === "black") {
      setColor(input);
      setName(input)
    }
    return

    // if (newColor === "full") {
    //   setName(null);
    // } else {
    //   setName(input);
    // }
  };

  const handleRestartGame = () => {
    console.log("restart game");
    axios.post("/api/newGame");
    setGame(initialFen);
    setShowModal(false);
  };

  // Create a modal using tailwindcss asking the user if they are that they want to restart the game
  const RestartGameModal = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Restart Game
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to restart the game?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleRestartGame}
              >
                Restart
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black flex-col">
      {showModal ? <RestartGameModal /> : null}
      {/*isGameFull && <ErrorDiv />*/}
      {!name && (
        <div className="flex justify-center items-center flex-col">
          {/* <input */}
          {/*   className="bg-white-800 p-2 rounded-md mb-2 text-black" */}
          {/*   type="text" */}
          {/*   value={input} */}
          {/*   onChange={(e) => { */}
          {/*     setInput(e.target.value); */}
          {/*   }} */}
          {/* /> */}
          {/* <button */}
          {/*   className="bg-gray-800 text-white p-2 rounded-md" */}
          {/*   onClick={() => { */}
          {/*     handleSignIn(input); */}
          {/*   }} */}
          {/* > */}
          {/*   Start Game */}
          {/* </button> */}
          {/* <div className="text-white text-xl">input value: {input}</div> */}
          <label className="text-white text-xl m-2">
            Select which color you want to play:
          </label>
          <select
            name="color"
            id="color"
            className="bg-white-800 p-2 rounded-md m-6 text-black"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          >
            <option value={undefined}>Color</option>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>

          <button
            className="bg-gray-800 text-white p-2 rounded-md"
            onClick={() => {
              handleSignIn(input);
            }}
          >
            {" "}
            Start Game{" "}
          </button>
        </div>
      )}
      {!!name && (
        <>
          <div className="text-white text-2xl m-6">Chess do Breijao</div>
          <Chessboard
            position={game}
            onPieceDrop={onDrop as any}
            boardOrientation={color ? color : "white"}
          />
          <button
            className="bg-gray-800 text-white p-2 rounded-md m-6"
            onClick={() => {
              console.log("clicked");
              setShowModal(true);
            }}
          >
            Restart Game
          </button>
        </>
      )}
    </div>
  );
}
