// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { prisma } from "../../server/db/client";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // fs.readFile("src/pages/api/boardState.txt", "utf8", (err, data) => {
    //   if (err) {
    //     console.error(err);
    //     res.status(500).send("Error reading file!");
    //     return resolve(false);
    //   }
    //   res.send(data);
    //   return resolve(true);
    // });

    // By unique identifier
    const game = await prisma.games.findUnique({
      where: {
        id: "cl87vbxmf00077m4eobs8xfav",
      },
    });

    res.send(game?.fen);
  }

  if (req.method === "POST") {
    const { state } = req.body;
    if (state) {
      // fs.writeFile("src/pages/api/boardState.txt", state, function (err) {
      //   if (err) return console.log(err);
      //   console.log("board state updated! > boardState.txt");
      //   return resolve(false);
      // });
      // res.send(state);
      // return resolve(true);

      const updateGameState = await prisma.games.update({
        where: {
          id: "cl87vbxmf00077m4eobs8xfav",
        },
        data: {
          fen: state,
        },
      });

      res.send(updateGameState.fen);
    }
  }
};

export default saveBoardState;
