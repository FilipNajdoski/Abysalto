-- 003_Basket: user baskets and basket items
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'[dbo].[Baskets]', N'U') IS NULL
BEGIN
	CREATE TABLE [dbo].[Baskets] (
		[Id] uniqueidentifier NOT NULL,
		[UserId] uniqueidentifier NOT NULL,
		[CreatedAt] datetime2 NOT NULL,
		[UpdatedAt] datetime2 NOT NULL,
		CONSTRAINT [PK_Baskets] PRIMARY KEY ([Id]),
		CONSTRAINT [FK_Baskets_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
	);
END;

IF OBJECT_ID(N'[dbo].[BasketItems]', N'U') IS NULL
BEGIN
	CREATE TABLE [dbo].[BasketItems] (
		[Id] uniqueidentifier NOT NULL,
		[BasketId] uniqueidentifier NOT NULL,
		[ProductId] int NOT NULL,
		[Quantity] int NOT NULL,
		[AddedAt] datetime2 NOT NULL,
		CONSTRAINT [PK_BasketItems] PRIMARY KEY ([Id]),
		CONSTRAINT [FK_BasketItems_Baskets_BasketId] FOREIGN KEY ([BasketId]) REFERENCES [dbo].[Baskets] ([Id]) ON DELETE CASCADE,
		CONSTRAINT [CK_BasketItems_Quantity] CHECK ([Quantity] > 0)
	);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Baskets_UserId' AND object_id = OBJECT_ID(N'[dbo].[Baskets]'))
	CREATE UNIQUE INDEX [IX_Baskets_UserId] ON [dbo].[Baskets] ([UserId]);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_BasketItems_BasketId_ProductId' AND object_id = OBJECT_ID(N'[dbo].[BasketItems]'))
	CREATE UNIQUE INDEX [IX_BasketItems_BasketId_ProductId] ON [dbo].[BasketItems] ([BasketId], [ProductId]);

COMMIT TRANSACTION;
GO
