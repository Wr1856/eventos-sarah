ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'ativo';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;