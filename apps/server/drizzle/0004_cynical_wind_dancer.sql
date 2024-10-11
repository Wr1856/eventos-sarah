DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('ativo', 'cancelado');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" "status" NOT NULL;