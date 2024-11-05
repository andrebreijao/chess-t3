import type { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
import { prisma } from "../../server/db/client";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" as const;

  // const writeFileData = (data: string) => {
  //   fs.writeFile("src/pages/api/boardState.txt", data, function (err) {
  //     if (err) {
  //       console.log(err);
  //       return false;
  //     }
  //     console.log("Hello World > colors.txt");
  //     return true;
  //   });
  // };

  if (req.method === "POST") {
    // writeFileData(initialFen);
    const updateGameState = await prisma.games.update({
      where: {
        id: "cl87vbxmf00077m4eobs8xfav",
      },
      data: {
        fen: INITIAL_FEN,
      },
    });
    return res.status(200).send(updateGameState.fen);
  }
};

export default saveBoardState;
