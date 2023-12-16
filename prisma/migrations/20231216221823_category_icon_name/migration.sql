/*
  Warnings:

  - You are about to drop the column `iconName` on the `Category` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isIncome" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Category" ("id", "isIncome", "name") SELECT "id", "isIncome", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
