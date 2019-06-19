--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 9.6.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

-- CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

-- COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: _migrations; Type: TABLE; Schema: public; Owner: postgres
--

-- CREATE TABLE public._migrations (
--     name character varying(255) NOT NULL
-- );
--
--
-- ALTER TABLE public._migrations OWNER TO postgres;

--
-- Name: event_member_attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_member_attendance (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "gymId" integer,
    "eventId" integer,
    "memberId" integer,
    "createdBy" integer
);


ALTER TABLE public.event_member_attendance OWNER TO postgres;

--
-- Name: event_member_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_member_attendance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.event_member_attendance_id_seq OWNER TO postgres;

--
-- Name: event_member_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_member_attendance_id_seq OWNED BY public.event_member_attendance.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    timezone character varying(255) NOT NULL,
    "startDateTime" timestamp with time zone NOT NULL,
    "endDateTime" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "gymId" integer,
    "scheduledEventId" integer,
    "createdBy" integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: gyms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gyms (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "defaultTimezone" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "createdBy" integer
);


ALTER TABLE public.gyms OWNER TO postgres;

--
-- Name: gyms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gyms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gyms_id_seq OWNER TO postgres;

--
-- Name: gyms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gyms_id_seq OWNED BY public.gyms.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(255),
    "dateOfBirth" timestamp with time zone NOT NULL,
    "emergencyContacts" jsonb NOT NULL,
    "guardianContacts" jsonb NOT NULL,
    "waiverSignedDate" timestamp with time zone,
    "waiverUrl" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "gymId" integer,
    "createdBy" integer
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.members_id_seq OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: scheduled_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheduled_events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    timezone character varying(255) NOT NULL,
    rrules character varying(255) NOT NULL,
    "startTime" character varying(255) NOT NULL,
    "endTime" character varying(255) NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "gymId" integer,
    "createdBy" integer
);


ALTER TABLE public.scheduled_events OWNER TO postgres;

--
-- Name: scheduled_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scheduled_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scheduled_events_id_seq OWNER TO postgres;

--
-- Name: scheduled_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scheduled_events_id_seq OWNED BY public.scheduled_events.id;


--
-- Name: user_gym_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_gym_role (
    id integer NOT NULL,
    role character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "gymId" integer,
    "userId" integer NOT NULL
);


ALTER TABLE public.user_gym_role OWNER TO postgres;

--
-- Name: user_gym_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_gym_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_gym_role_id_seq OWNER TO postgres;

--
-- Name: user_gym_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_gym_role_id_seq OWNED BY public.user_gym_role.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "googleId" character varying(255),
    "facebookId" character varying(255),
    "isVerified" boolean,
    "verifyToken" character varying(255),
    "verifyExpires" timestamp with time zone,
    "verifyChanges" json,
    "resetToken" character varying(255),
    "resetExpires" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: event_member_attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance ALTER COLUMN id SET DEFAULT nextval('public.event_member_attendance_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: gyms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms ALTER COLUMN id SET DEFAULT nextval('public.gyms_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: scheduled_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_events ALTER COLUMN id SET DEFAULT nextval('public.scheduled_events_id_seq'::regclass);


--
-- Name: user_gym_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_gym_role ALTER COLUMN id SET DEFAULT nextval('public.user_gym_role_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


-- --
-- -- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --
--
-- ALTER TABLE ONLY public._migrations
--     ADD CONSTRAINT _migrations_pkey PRIMARY KEY (name);


--
-- Name: event_member_attendance event_member_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance
    ADD CONSTRAINT event_member_attendance_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: gyms gyms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms
    ADD CONSTRAINT gyms_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: scheduled_events scheduled_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_events
    ADD CONSTRAINT scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: user_gym_role user_gym_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_gym_role
    ADD CONSTRAINT user_gym_role_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: event_member_attendance_member_id_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX event_member_attendance_member_id_event_id ON public.event_member_attendance USING btree ("memberId", "eventId");


--
-- Name: events_scheduled_event_id_start_date_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX events_scheduled_event_id_start_date_time ON public.events USING btree ("scheduledEventId", "startDateTime");


--
-- Name: event_member_attendance event_member_attendance_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance
    ADD CONSTRAINT "event_member_attendance_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_member_attendance event_member_attendance_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance
    ADD CONSTRAINT "event_member_attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_member_attendance event_member_attendance_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance
    ADD CONSTRAINT "event_member_attendance_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public.gyms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_member_attendance event_member_attendance_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_member_attendance
    ADD CONSTRAINT "event_member_attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "events_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "events_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public.gyms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_scheduledEventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "events_scheduledEventId_fkey" FOREIGN KEY ("scheduledEventId") REFERENCES public.scheduled_events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: gyms gyms_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms
    ADD CONSTRAINT "gyms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: members members_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT "members_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: members members_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT "members_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public.gyms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: scheduled_events scheduled_events_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_events
    ADD CONSTRAINT "scheduled_events_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: scheduled_events scheduled_events_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_events
    ADD CONSTRAINT "scheduled_events_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public.gyms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_gym_role user_gym_role_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_gym_role
    ADD CONSTRAINT "user_gym_role_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public.gyms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_gym_role user_gym_role_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_gym_role
    ADD CONSTRAINT "user_gym_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

