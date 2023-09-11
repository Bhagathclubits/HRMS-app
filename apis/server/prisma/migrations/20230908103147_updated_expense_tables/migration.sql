BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;
ALTER TABLE [dbo].[expense] ADD [remarks] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
