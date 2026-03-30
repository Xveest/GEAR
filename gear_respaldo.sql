--
-- PostgreSQL database dump
--

\restrict TOhOAG9AyQ6c88JRDpm6vbv2iU42zT4Lt1IYNgTWSYKmwSPUOkkLu7Kgdqa4vG0

-- Dumped from database version 18.1 (Postgres.app)
-- Dumped by pg_dump version 18.1 (Postgres.app)

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

ALTER TABLE ONLY public.vacantes DROP CONSTRAINT vacantes_id_reclutador_fkey;
ALTER TABLE ONLY public.postulaciones DROP CONSTRAINT postulaciones_id_vacante_fkey;
ALTER TABLE ONLY public.postulaciones DROP CONSTRAINT postulaciones_id_candidato_fkey;
ALTER TABLE ONLY public.evaluaciones DROP CONSTRAINT evaluaciones_id_postulacion_fkey;
ALTER TABLE ONLY public.vacantes DROP CONSTRAINT vacantes_pkey;
ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
ALTER TABLE ONLY public.postulaciones DROP CONSTRAINT postulaciones_pkey;
ALTER TABLE ONLY public.evaluaciones DROP CONSTRAINT evaluaciones_pkey;
ALTER TABLE ONLY public.candidatos DROP CONSTRAINT candidatos_pkey;
ALTER TABLE ONLY public.candidatos DROP CONSTRAINT candidatos_email_key;
ALTER TABLE public.vacantes ALTER COLUMN id_vacante DROP DEFAULT;
ALTER TABLE public.usuarios ALTER COLUMN id_usuario DROP DEFAULT;
ALTER TABLE public.postulaciones ALTER COLUMN id_postulacion DROP DEFAULT;
ALTER TABLE public.evaluaciones ALTER COLUMN id_evaluacion DROP DEFAULT;
ALTER TABLE public.candidatos ALTER COLUMN id_candidato DROP DEFAULT;
DROP SEQUENCE public.vacantes_id_vacante_seq;
DROP TABLE public.vacantes;
DROP SEQUENCE public.usuarios_id_usuario_seq;
DROP TABLE public.usuarios;
DROP SEQUENCE public.postulaciones_id_postulacion_seq;
DROP TABLE public.postulaciones;
DROP SEQUENCE public.evaluaciones_id_evaluacion_seq;
DROP TABLE public.evaluaciones;
DROP SEQUENCE public.candidatos_id_candidato_seq;
DROP TABLE public.candidatos;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidatos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidatos (
    id_candidato integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    email character varying(150),
    telefono character varying(20),
    experiencia_anios integer,
    nivel_estudios character varying(100),
    cv_url text,
    estado character varying(50),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    es_interno boolean DEFAULT false
);


ALTER TABLE public.candidatos OWNER TO postgres;

--
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidatos_id_candidato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidatos_id_candidato_seq OWNER TO postgres;

--
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidatos_id_candidato_seq OWNED BY public.candidatos.id_candidato;


--
-- Name: evaluaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluaciones (
    id_evaluacion integer NOT NULL,
    id_postulacion integer,
    evaluacion_tecnica integer,
    evaluacion_psicometrica integer,
    evaluacion_rh integer,
    comentarios text,
    fecha_evaluacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.evaluaciones OWNER TO postgres;

--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluaciones_id_evaluacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNER TO postgres;

--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNED BY public.evaluaciones.id_evaluacion;


--
-- Name: postulaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulaciones (
    id_postulacion integer NOT NULL,
    id_candidato integer,
    id_vacante integer,
    fecha_postulacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado_postulacion character varying(50)
);


ALTER TABLE public.postulaciones OWNER TO postgres;

--
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulaciones_id_postulacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNER TO postgres;

--
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNED BY public.postulaciones.id_postulacion;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    email character varying(150),
    password character varying(255),
    rol character varying(20),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: vacantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacantes (
    id_vacante integer NOT NULL,
    titulo_puesto character varying(150),
    departamento character varying(100),
    descripcion text,
    salario numeric(10,2),
    estado character varying(50),
    fecha_publicacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_reclutador integer
);


ALTER TABLE public.vacantes OWNER TO postgres;

--
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacantes_id_vacante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vacantes_id_vacante_seq OWNER TO postgres;

--
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacantes_id_vacante_seq OWNED BY public.vacantes.id_vacante;


--
-- Name: candidatos id_candidato; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos ALTER COLUMN id_candidato SET DEFAULT nextval('public.candidatos_id_candidato_seq'::regclass);


--
-- Name: evaluaciones id_evaluacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones ALTER COLUMN id_evaluacion SET DEFAULT nextval('public.evaluaciones_id_evaluacion_seq'::regclass);


--
-- Name: postulaciones id_postulacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN id_postulacion SET DEFAULT nextval('public.postulaciones_id_postulacion_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Name: vacantes id_vacante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN id_vacante SET DEFAULT nextval('public.vacantes_id_vacante_seq'::regclass);


--
-- Data for Name: candidatos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidatos (id_candidato, nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado, fecha_registro, es_interno) FROM stdin;
3	Jaime	Gonzalez	jaime@gmail.com	4868686	1	gerente de ventas		activo	2026-03-28 15:49:01.937449	t
4	Leonardo		leoluna@gmail.com		0	No especificado	\N	activo	2026-03-28 16:21:26.822615	f
5	Prueba	Garcia	prueba@gmail.com	55386686464	5	gerente de prueba		activo	2026-03-30 11:51:32.121403	f
\.


--
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluaciones (id_evaluacion, id_postulacion, evaluacion_tecnica, evaluacion_psicometrica, evaluacion_rh, comentarios, fecha_evaluacion) FROM stdin;
5	4	79	90	80	buen perfil	2026-03-28 15:55:57.452378
6	9	91	76	67	perfil ideal	2026-03-28 23:02:19.830971
7	10	67	34	34	prueba	2026-03-30 12:05:34.173197
8	7	12	46	56	prueba	2026-03-30 12:05:53.152999
\.


--
-- Data for Name: postulaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulaciones (id_postulacion, id_candidato, id_vacante, fecha_postulacion, estado_postulacion) FROM stdin;
4	3	2	2026-03-28 15:49:20.694825	aceptado
7	4	3	2026-03-28 16:21:27.293604	pendiente
5	3	3	2026-03-28 16:17:25.043689	rechazado
9	4	2	2026-03-28 22:58:57.362808	aceptado
10	5	3	2026-03-30 11:52:03.947547	aceptado
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, apellido, email, password, rol, fecha_creacion) FROM stdin;
1	Carlos	Ramirez	carlos@gear.com	123456	reclutador	2026-03-07 19:35:59.823933
2	Diego 	Espindola	diego@admingear.com	$2b$10$6yQZYRp0Q8zwgvu08YWWwe.aatDL6fmNxqc2g74k5ZTHuWfaAb3i.	admin	2026-03-28 00:53:45.380954
3	Francisco 	Trejo	francisco@reclutadorgear.com	$2b$10$Yr56pLs1P0xkZvIT1ppZ5uQ2E7U1X8U3cmNmf66bh5vHbAHKQVVWy	postulante	2026-03-28 00:58:46.193559
4	Prueba	\N	prueba@correo.com	$2b$10$PMsMkPJoCK9oVQg5BJxA1O15FJ6b.Sv.lviuvGLaM577ePMG4Mzda	candidato	2026-03-28 12:01:09.67835
5	Leonardo	Garcia	leoluna@gmail.com	$2b$10$vrvZBuOkrkZaljqoAXwYMevnAwIwjeWxB8mFzKdXflZVsTHAhR8N2	candidato	2026-03-28 13:25:59.543202
6	Jaime	Gonzalez	jaime@gmail.com	$2b$10$zUJE0jfGxNx8E486eMqb2eC48B5PyMCQ5u4tfjnbe8c.w.0z3vF1C	candidato	2026-03-28 15:49:01.89356
7	Oswaldo	Rodriguez	oswaldo@gearrh.com	$2b$10$oU0C7hZFwp0NikETVkeIzuLi4lr683oK7e5Ze/rwrCBqUENyVduha	recursos_humanos	2026-03-30 07:13:19.21856
8	Oswaldo	Carrillo	oswaldo2@gearrh.com	$2b$10$nL4HMaJt97LMghxARg1IluNkz2VZqCvUrf.VoYJC0nGNUtFXqU8TS	recursos_humanos	2026-03-30 07:23:27.958588
9	Francisco	Trejo	francisco@gearreclutador.com	$2b$10$dZbprysTj3H2pezRBCNyBO62t3duYuncWqo.lQatmxzJw9etxmUnu	reclutador	2026-03-30 07:25:31.594226
10	Prueba	Garcia	prueba@gmail.com	$2b$10$DOiGDCEANp/ejFUNiFwRDuMVhiVy155qnsvfLu9CniinFaJ/.W0i6	candidato	2026-03-30 11:51:32.04393
\.


--
-- Data for Name: vacantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacantes (id_vacante, titulo_puesto, departamento, descripcion, salario, estado, fecha_publicacion, id_reclutador) FROM stdin;
2	Gerente de nuevos proyectos	producción	gerente de nuevos proyectos del sector automotriz	45000.00	cerrada	2026-03-28 13:12:30.278499	2
3	Vacante Test	IT	desc	\N	cerrada	2026-03-28 16:17:25.039122	\N
5	Gerente de producción	producción	gerente de producción en el desarrollo automotriz	34000.00	activa	2026-03-30 12:20:57.276106	2
\.


--
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidatos_id_candidato_seq', 5, true);


--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 8, true);


--
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulaciones_id_postulacion_seq', 10, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 10, true);


--
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacantes_id_vacante_seq', 5, true);


--
-- Name: candidatos candidatos_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_email_key UNIQUE (email);


--
-- Name: candidatos candidatos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_pkey PRIMARY KEY (id_candidato);


--
-- Name: evaluaciones evaluaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id_evaluacion);


--
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (id_postulacion);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (id_vacante);


--
-- Name: evaluaciones evaluaciones_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulaciones(id_postulacion) ON DELETE CASCADE;


--
-- Name: postulaciones postulaciones_id_candidato_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_candidato_fkey FOREIGN KEY (id_candidato) REFERENCES public.candidatos(id_candidato);


--
-- Name: postulaciones postulaciones_id_vacante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_vacante_fkey FOREIGN KEY (id_vacante) REFERENCES public.vacantes(id_vacante) ON DELETE CASCADE;


--
-- Name: vacantes vacantes_id_reclutador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_id_reclutador_fkey FOREIGN KEY (id_reclutador) REFERENCES public.usuarios(id_usuario);


--
-- PostgreSQL database dump complete
--

\unrestrict TOhOAG9AyQ6c88JRDpm6vbv2iU42zT4Lt1IYNgTWSYKmwSPUOkkLu7Kgdqa4vG0

