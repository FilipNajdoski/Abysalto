-- 002_Favorites: user favorite products
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'[dbo].[Favorites]', N'U') IS NULL
BEGIN
	CREATE TABLE [dbo].[Favorites] (
		[Id] uniqueidentifier NOT NULL,
		[UserId] uniqueidentifier NOT NULL,
		[ProductId] int NOT NULL,
		[CreatedAt] datetime2 NOT NULL,
		CONSTRAINT [PK_Favorites] PRIMARY KEY ([Id]),
		CONSTRAINT [FK_Favorites_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
	);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Favorites_UserId_ProductId' AND object_id = OBJECT_ID(N'[dbo].[Favorites]'))
	CREATE UNIQUE INDEX [IX_Favorites_UserId_ProductId] ON [dbo].[Favorites] ([UserId], [ProductId]);

COMMIT TRANSACTION;
GO
