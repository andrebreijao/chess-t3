import type { NextApiRequest, NextApiResponse } from "next";
import fs, { writeFile } from "fs";

const saveBoardState = async (req: NextApiRequest, res: NextApiResponse) => {
  const writeFileData = (data: string) => {
    fs.writeFile("src/pages/api/colors.txt", data, function (err) {
      if (err) {
        console.log(err);
        return false;
      }
      console.log("Hello World > colors.txt");
      return true;
    });
  };

  const readFileColors = () => {
    fs.readFile("src/pages/api/colors.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading file!");
      }
      JSON.parse(data);
    });
  };

  if (req.method === "GET") {
    res.send("cannot get to this endpoint");
  }

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("no name provided");
    }

    fs.readFile("src/pages/api/colors.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading file!");
      }

      const colors = JSON.parse(data);

      if (colors.white === name) {
        const newColors = { ...colors, white: null };
        writeFileData(JSON.stringify(newColors));
        return res.status(200).send({ disconnected: true });
      }

      if (colors.black === name) {
        const newColors = { ...colors, black: null };
        writeFileData(JSON.stringify(newColors));
        return res.status(200).send({ disconnected: true });
      }

      return res.status(400).send("player not found");
    });
  }
};

export default saveBoardState;
