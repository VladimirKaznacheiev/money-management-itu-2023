/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Goal` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "isIncome" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "categoryId", "date", "description", "id", "isIncome") SELECT "amount", "categoryId", "date", "description", "id", "isIncome" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "isSpend" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("amount", "categoryId", "date", "id", "isSpend", "name") SELECT "amount", "categoryId", "date", "id", "isSpend", "name" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
