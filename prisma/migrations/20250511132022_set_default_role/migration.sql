-- AlterTable
ALTER TABLE "User" ADD COLUMN "roleId" INTEGER NOT NULL;

-- CreateTable: Role table
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique constraint on Role name
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey: Create a foreign key on User table for roleId
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add default value for roleId in User table
ALTER TABLE "User" ALTER COLUMN "roleId" SET DEFAULT 2;