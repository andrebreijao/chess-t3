import type { NextApiRequest, NextApiResponse } from "next";
import fs, { writeFile } from "fs";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve) => {
    const writeFileData = (data: string) => {
      fs.writeFile("src/pages/api/colors.txt", data, function (err) {
        if (err) {
          console.log(err);
          return resolve(false);
        }
        console.log("Hello World > colors.txt");
        return resolve(true);
      });
    };

    if (req.method === "POST") {
      const { name } = req.body;
      if (!name) {
        return res.status(400).send("no name provided");
      }

      fs.readFile("src/pages/api/colors.txt", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading file!");
          return resolve(false);
        }
        const players = JSON.parse(data);

        if (players.white === name) {
          res.status(200).send({ color: "white" });
          return resolve(true);
        }

        if (players.black === name) {
          res.status(200).send({ color: "black" });
          return resolve(true);
        }

        if (!players.white) {
          writeFileData(JSON.stringify({ ...players, white: name }));
          res.send({ color: "white" });
          return resolve(true);
        }

        if (!players.black) {
          writeFileData(JSON.stringify({ ...players, black: name }));
          res.send({ color: "black" });
          return resolve(true);
        }

        res.status(200).send({ color: "full" });
        return resolve(true);
      });
    }

    if (req.method === "GET") {
      res.send("cannot get to this endpoint");
      return resolve(true);
    }
  });
};

export default saveBoardState;
