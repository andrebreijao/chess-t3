import type { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
import { prisma } from "../../server/db/client";

const whatsapp = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message) {
      prisma.text.create({
        data: {
          text: message,
        },
      });
    }
    return res.status(200).send("Message sent!");
  }
};

export default whatsapp;
