CREATE TYPE "public"."event_state" AS ENUM('draft', 'publised', 'cancelled');--> statement-breakpoint
CREATE TABLE "event_record" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdAt" timestamp with time zone NOT NULL,
	"deletedAt" timestamp with time zone,
	"updatedAt" timestamp with time zone NOT NULL,
	"title" text NOT NULL,
	"image" text,
	"tags" text[] NOT NULL,
	"description" text,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"isOffsite" boolean DEFAULT false NOT NULL,
	"offsiteLink" text,
	"eventState" "event_state" NOT NULL,
	"ownerId" text NOT NULL,
	"organizers" integer[] NOT NULL,
	"slug" text NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date,
	"signupDeadline" timestamp with time zone,
	"displayPrice" numeric(10, 2),
	"displayPriceCurrency" text DEFAULT 'HUF' NOT NULL,
	"locationSummary" text NOT NULL,
	"location" integer,
	"expectedParticipants" integer,
	"maximumParticipants" integer,
	"minimumParticipants" integer,
	"socials" text[] NOT NULL,
	"search_vector" "tsvector",
	CONSTRAINT "event_record_slug_unique" UNIQUE("slug"),
	CONSTRAINT "event_starts_at_least_tomorrow" CHECK ("event_record"."startDate" >= (CURRENT_DATE + INTERVAL '1 day')),
	CONSTRAINT "end_date_is_later_than_start_date" CHECK ("event_record"."endDate" > "event_record"."startDate" OR "event_record"."endDate" IS NULL),
	CONSTRAINT "min_participants_are_less_than_max" CHECK (
		"event_record"."minimumParticipants" IS NULL OR
		"event_record"."maximumParticipants" IS NULL OR
		"event_record"."minimumParticipants" < "event_record"."maximumParticipants"
	  ),
	CONSTRAINT "expected_within_bounds" CHECK (
		"event_record"."minimumParticipants" IS NULL OR
		"event_record"."maximumParticipants" IS NULL OR
		"event_record"."expectedParticipants" IS NULL OR
		"event_record"."expectedParticipants" >= "event_record"."minimumParticipants" AND
		"event_record"."expectedParticipants" <= "event_record"."maximumParticipants"
	  ),
	CONSTRAINT "expected_is_positive_number" CHECK ("event_record"."expectedParticipants" IS NULL OR "event_record"."expectedParticipants" > 0),
	CONSTRAINT "minimum_is_positive_number" CHECK ("event_record"."minimumParticipants" IS NULL OR "event_record"."minimumParticipants" > 0),
	CONSTRAINT "maximum_is_positive_number" CHECK ("event_record"."maximumParticipants" IS NULL OR "event_record"."maximumParticipants" > 0),
	CONSTRAINT "valid_slug" CHECK ("event_record"."slug" ~ '^[a-z0-9-]+$' AND LENGTH("event_record"."slug") BETWEEN 3 AND 50)
);
--> statement-breakpoint
CREATE TABLE "faction_info" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "faction_info_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"eventId" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"expectedParticipants" integer,
	CONSTRAINT "faction_info_name_eventId_unique" UNIQUE("name","eventId"),
	CONSTRAINT "expected_participants_should_be_positive" CHECK ("faction_info"."expectedParticipants" IS NULL OR "faction_info"."expectedParticipants" > 0)
);
--> statement-breakpoint
CREATE TABLE "service_fee" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "service_fee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"eventId" integer NOT NULL,
	"updatedAt" timestamp with time zone,
	"label" text NOT NULL,
	"ammount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	CONSTRAINT "ammount_must_be_positive_or_zero" CHECK ("service_fee"."ammount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "site_information" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "site_information_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdAt" timestamp with time zone NOT NULL,
	"name" text NOT NULL,
	"alias" text,
	"description" text,
	"image" text,
	"city" text NOT NULL,
	"zip" text NOT NULL,
	"address1" text NOT NULL,
	"address2" text,
	"state" text,
	"country" text NOT NULL,
	"longitude" double precision,
	"latitude" double precision
);
--> statement-breakpoint
CREATE TABLE "timeline" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "timeline_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"eventId" integer NOT NULL,
	"updatedAt" timestamp with time zone,
	"label" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"displayLongDateTime" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_at_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_at_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdAt" timestamp with time zone NOT NULL,
	"isRejected" boolean DEFAULT false,
	"isCancelled" boolean DEFAULT false,
	"cancellationReason" text,
	"userId" text NOT NULL,
	"eventId" integer NOT NULL,
	"faction_id" integer,
	CONSTRAINT "user_at_event_eventId_userId_unique" UNIQUE("eventId","userId")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"claims" text[],
	"callsign" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "event_record" ADD CONSTRAINT "event_record_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_record" ADD CONSTRAINT "event_record_location_site_information_id_fk" FOREIGN KEY ("location") REFERENCES "public"."site_information"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_info" ADD CONSTRAINT "faction_info_eventId_event_record_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_fee" ADD CONSTRAINT "service_fee_eventId_event_record_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_eventId_event_record_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_at_event" ADD CONSTRAINT "user_at_event_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_at_event" ADD CONSTRAINT "user_at_event_eventId_event_record_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_at_event" ADD CONSTRAINT "user_at_event_faction_id_faction_info_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."faction_info"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_event_search_vector" ON "event_record" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "idx_event_location" ON "event_record" USING btree ("location");--> statement-breakpoint
CREATE INDEX "idx_event_start_date" ON "event_record" USING btree ("startDate");