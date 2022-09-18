// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve) => {
    if (req.method === "GET") {
      fs.readFile("src/pages/api/boardState.txt", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading file!");
          return resolve(false);
        }
        res.send(data);
        return resolve(true);
      });
    }

    if (req.method === "POST") {
      const { state } = req.body;
      if (state) {
        fs.writeFile("src/pages/api/boardState.txt", state, function (err) {
          if (err) return console.log(err);
          console.log("board state updated! > boardState.txt");
          return resolve(false);
        });
        res.send(state);
        return resolve(true);
      }
    }
  });
};

export default saveBoardState;
