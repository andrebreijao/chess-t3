import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const writeFileData = (data: string) => {
    fs.writeFile("src/pages/api/boardState.txt", data, function (err) {
      if (err) {
        console.log(err);
        return false;
      }
      console.log("Hello World > colors.txt");
      return true;
    });
  };

  if (req.method === "POST") {
    writeFileData(initialFen);
    return res.status(200).send(initialFen);
  }
};

export default saveBoardState;
