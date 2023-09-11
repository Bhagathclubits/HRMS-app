/*
  Warnings:

  - A unique constraint covering the columns `[user_id,from_date,to_date]` on the table `travel` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[expense] DROP CONSTRAINT [expense_user_id_type_id_date_key];

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;
ALTER TABLE [dbo].[expense] ALTER COLUMN [date] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[expense] ADD CONSTRAINT [expense_user_id_type_id_date_key] UNIQUE NONCLUSTERED ([user_id], [type_id], [date]);

-- CreateIndex
ALTER TABLE [dbo].[travel] ADD CONSTRAINT [travel_user_id_from_date_to_date_key] UNIQUE NONCLUSTERED ([user_id], [from_date], [to_date]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
