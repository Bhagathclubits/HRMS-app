/*
  Warnings:

  - You are about to drop the column `expense_type_id` on the `expense` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,type_id,created_at]` on the table `expense` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type_id` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[expense] DROP CONSTRAINT [expense_expense_type_id_fkey];

-- DropIndex
ALTER TABLE [dbo].[expense] DROP CONSTRAINT [expense_user_id_expense_type_id_amount_key];

-- AlterTable
ALTER TABLE [dbo].[expense] ALTER COLUMN [amount] DECIMAL NOT NULL;
ALTER TABLE [dbo].[expense] DROP COLUMN [expense_type_id];
ALTER TABLE [dbo].[expense] ADD [type_id] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[import_pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[pay_slip_components] ALTER COLUMN [amount] DECIMAL NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[travel_status] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(64) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [travel_status_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [travel_status_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [travel_status_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[travel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [place] VARCHAR(64) NOT NULL,
    [from_date] DATETIME2 NOT NULL,
    [to_date] DATETIME2 NOT NULL,
    [status_id] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [travel_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by_id] INT NOT NULL,
    [updated_at] DATETIME2 NOT NULL,
    [updated_by_id] INT NOT NULL,
    CONSTRAINT [travel_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[expense] ADD CONSTRAINT [expense_user_id_type_id_created_at_key] UNIQUE NONCLUSTERED ([user_id], [type_id], [created_at]);

-- AddForeignKey
ALTER TABLE [dbo].[expense] ADD CONSTRAINT [expense_type_id_fkey] FOREIGN KEY ([type_id]) REFERENCES [dbo].[expense_types]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel_status] ADD CONSTRAINT [travel_status_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel_status] ADD CONSTRAINT [travel_status_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel] ADD CONSTRAINT [travel_created_by_id_fkey] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel] ADD CONSTRAINT [travel_status_id_fkey] FOREIGN KEY ([status_id]) REFERENCES [dbo].[travel_status]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel] ADD CONSTRAINT [travel_updated_by_id_fkey] FOREIGN KEY ([updated_by_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[travel] ADD CONSTRAINT [travel_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
