/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type_id,date]` on the table `expense` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[expense] DROP CONSTRAINT [expense_user_id_type_id_created_at_key];

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;
ALTER TABLE [dbo].[expense] ADD [date] DATE NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[expense] ADD CONSTRAINT [expense_user_id_type_id_date_key] UNIQUE NONCLUSTERED ([user_id], [type_id], [date]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
