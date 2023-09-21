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

-- CreateTable
CREATE TABLE [dbo].[PowerBI] (
    [access_token] VARCHAR(2048) NOT NULL,
    CONSTRAINT [PowerBI_access_token_key] UNIQUE NONCLUSTERED ([access_token])
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
