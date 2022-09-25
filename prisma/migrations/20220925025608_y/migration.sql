-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "fen" TEXT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);
