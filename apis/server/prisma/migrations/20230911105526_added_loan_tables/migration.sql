BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[loan_types] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(64) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [loan_types_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [loan_types_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [loan_types_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[loan_status] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(64) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [loan_status_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [loan_status_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [loan_status_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[loan] (
    [id] INT NOT NULL IDENTITY(1,1),
    [amount] DECIMAL NOT NULL,
    [user_id] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [remarks] NVARCHAR(1000),
    [type_id] INT NOT NULL,
    [status_id] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [loan_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [loan_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [loan_user_id_type_id_date_key] UNIQUE NONCLUSTERED ([user_id],[type_id],[date])
);

-- AddForeignKey
ALTER TABLE [dbo].[loan_types] ADD CONSTRAINT [loan_types_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan_types] ADD CONSTRAINT [loan_types_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan_status] ADD CONSTRAINT [loan_status_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan_status] ADD CONSTRAINT [loan_status_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan] ADD CONSTRAINT [loan_type_id_fkey] FOREIGN KEY ([type_id]) REFERENCES [dbo].[loan_types]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan] ADD CONSTRAINT [loan_status_id_fkey] FOREIGN KEY ([status_id]) REFERENCES [dbo].[loan_status]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan] ADD CONSTRAINT [loan_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan] ADD CONSTRAINT [loan_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loan] ADD CONSTRAINT [loan_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
