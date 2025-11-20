--
-- PostgreSQL database dump
--

\restrict lhqsdKwn3C1o89IIes9czrSAHhKWaaAspRyJwohQ59gIg7mXieKmgbBPYgcfCAg

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 16:30:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 32991)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 36130)
-- Name: role_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_name character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.role_entity OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 36141)
-- Name: user_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_entity OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 36159)
-- Name: user_entity_roles_role_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_entity_roles_role_entity (
    "userEntityId" uuid NOT NULL,
    "roleEntityId" uuid NOT NULL
);


ALTER TABLE public.user_entity_roles_role_entity OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 36130)
-- Dependencies: 220
-- Data for Name: role_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_entity (id, role_name, description) FROM stdin;
364b2fcc-7cff-4f3f-ace9-2e37a3e051a2	admin	Administrator role
40b5a7f5-2eaf-4b3e-bf59-43714145d039	rolPrueba	Rol de prueba
\.


--
-- TOC entry 5038 (class 0 OID 36141)
-- Dependencies: 221
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_entity (id, email, password, name, phone, is_active, created_at) FROM stdin;
dc41d326-941e-4bdd-93f3-b91fd7879457	admin@example.com	$2b$10$8HoMneTVlwZk5LplNtI11e34WhNjG5EcbWOIEP8aYwy8huKHwVXI2	Administrator	\N	t	2025-11-20 16:11:05.993137
\.


--
-- TOC entry 5039 (class 0 OID 36159)
-- Dependencies: 222
-- Data for Name: user_entity_roles_role_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_entity_roles_role_entity ("userEntityId", "roleEntityId") FROM stdin;
dc41d326-941e-4bdd-93f3-b91fd7879457	364b2fcc-7cff-4f3f-ace9-2e37a3e051a2
\.


--
-- TOC entry 4879 (class 2606 OID 36140)
-- Name: role_entity PK_7bc1bd2364b6e9bf7c84b1e52e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_entity
    ADD CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 36165)
-- Name: user_entity_roles_role_entity PK_9426d726a48f9c5d9c83c6eb91f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity_roles_role_entity
    ADD CONSTRAINT "PK_9426d726a48f9c5d9c83c6eb91f" PRIMARY KEY ("userEntityId", "roleEntityId");


--
-- TOC entry 4881 (class 2606 OID 36156)
-- Name: user_entity PK_b54f8ea623b17094db7667d8206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY (id);


--
-- TOC entry 4883 (class 2606 OID 36158)
-- Name: user_entity UQ_415c35b9b3b6fe45a3b065030f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE (email);


--
-- TOC entry 4884 (class 1259 OID 36166)
-- Name: IDX_3277e83a0656736e30b901d9a3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3277e83a0656736e30b901d9a3" ON public.user_entity_roles_role_entity USING btree ("userEntityId");


--
-- TOC entry 4885 (class 1259 OID 36167)
-- Name: IDX_63f06698e4071b610eca2da812; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_63f06698e4071b610eca2da812" ON public.user_entity_roles_role_entity USING btree ("roleEntityId");


--
-- TOC entry 4888 (class 2606 OID 36168)
-- Name: user_entity_roles_role_entity FK_3277e83a0656736e30b901d9a30; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity_roles_role_entity
    ADD CONSTRAINT "FK_3277e83a0656736e30b901d9a30" FOREIGN KEY ("userEntityId") REFERENCES public.user_entity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4889 (class 2606 OID 36173)
-- Name: user_entity_roles_role_entity FK_63f06698e4071b610eca2da812c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity_roles_role_entity
    ADD CONSTRAINT "FK_63f06698e4071b610eca2da812c" FOREIGN KEY ("roleEntityId") REFERENCES public.role_entity(id);


-- Completed on 2025-11-20 16:30:33

--
-- PostgreSQL database dump complete
--

\unrestrict lhqsdKwn3C1o89IIes9czrSAHhKWaaAspRyJwohQ59gIg7mXieKmgbBPYgcfCAg

