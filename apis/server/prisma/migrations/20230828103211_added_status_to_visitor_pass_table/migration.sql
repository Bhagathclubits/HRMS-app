BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[visitor_passes] ADD [status_id] INT NOT NULL CONSTRAINT [visitor_passes_status_id_df] DEFAULT 1;

-- CreateTable
CREATE TABLE [dbo].[visitor_pass_status] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(64) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [visitor_pass_status_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [visitor_pass_status_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [visitor_pass_status_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[visitor_pass_status] ADD CONSTRAINT [visitor_pass_status_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[visitor_pass_status] ADD CONSTRAINT [visitor_pass_status_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[visitor_passes] ADD CONSTRAINT [visitor_passes_status_id_fkey] FOREIGN KEY ([status_id]) REFERENCES [dbo].[visitor_pass_status]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
