DO $$ BEGIN
 CREATE TYPE "public"."event_type" AS ENUM('online', 'presencial', 'híbrido');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_type" "event_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "name";