BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[visitor_passes] DROP CONSTRAINT [visitor_passes_status_id_df];
ALTER TABLE [dbo].[visitor_passes] ADD [remarks] VARCHAR(1024);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
