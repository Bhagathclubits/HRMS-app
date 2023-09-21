/*
  Warnings:

  - You are about to drop the `PowerBI` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[loan] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- DropTable
DROP TABLE [dbo].[PowerBI];

-- CreateTable
CREATE TABLE [dbo].[power_bi] (
    [id] INT NOT NULL IDENTITY(1,1),
    [access_token] VARCHAR(2048) NOT NULL,
    CONSTRAINT [power_bi_id_key] UNIQUE NONCLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
