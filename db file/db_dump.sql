--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    item_id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp with time zone DEFAULT now(),
    status character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT cart_items_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'delivered'::character varying, 'canceled'::character varying, 'returned'::character varying])::text[])))
);


--
-- Name: cart_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_item_id_seq OWNED BY public.cart_items.item_id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    customer_id integer,
    hybrid_id integer,
    session_id character varying(255),
    payment_status character varying(10) DEFAULT 'unpaid'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_paymentstatus CHECK (((payment_status)::text = ANY ((ARRAY['paid'::character varying, 'unpaid'::character varying])::text[]))),
    CONSTRAINT chk_userorsession CHECK (((customer_id IS NOT NULL) OR (hybrid_id IS NOT NULL) OR (session_id IS NOT NULL))),
    CONSTRAINT chk_userroleexclusivity CHECK ((((customer_id IS NULL) AND (hybrid_id IS NOT NULL)) OR ((customer_id IS NOT NULL) AND (hybrid_id IS NULL)) OR ((customer_id IS NULL) AND (hybrid_id IS NULL))))
);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_brands (
    category_id integer NOT NULL,
    brand_id integer NOT NULL
);


--
-- Name: category_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_features (
    category_id integer NOT NULL,
    feature_id integer NOT NULL
);


--
-- Name: category_manufacturers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_manufacturers (
    category_id integer NOT NULL,
    manufacturer_id integer NOT NULL
);


--
-- Name: conditions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conditions (
    id integer NOT NULL,
    value character varying(50) NOT NULL,
    label character varying(100) NOT NULL
);


--
-- Name: conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conditions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conditions_id_seq OWNED BY public.conditions.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.features_id_seq OWNED BY public.features.id;


--
-- Name: hybrids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hybrids (
    hybrid_id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_account_id character varying(255),
    status character varying(20) DEFAULT 'unverify'::character varying NOT NULL,
    CONSTRAINT hybrids_status_check CHECK (((status)::text = ANY ((ARRAY['verified'::character varying, 'unverify'::character varying])::text[])))
);


--
-- Name: hybrids_hybrid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hybrids_hybrid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hybrids_hybrid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hybrids_hybrid_id_seq OWNED BY public.hybrids.hybrid_id;


--
-- Name: manufacturers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manufacturers (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: manufacturers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.manufacturers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: manufacturers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.manufacturers_id_seq OWNED BY public.manufacturers.id;


--
-- Name: owners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.owners (
    owner_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: owners_owner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.owners_owner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: owners_owner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.owners_owner_id_seq OWNED BY public.owners.owner_id;


--
-- Name: product_brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_brands (
    product_id integer NOT NULL,
    brand_id integer NOT NULL
);


--
-- Name: product_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_features (
    product_id integer NOT NULL,
    feature_id integer NOT NULL
);


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer,
    image_url text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    public_id character varying(255)
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_manufacturers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_manufacturers (
    product_id integer NOT NULL,
    manufacturer_id integer NOT NULL
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer,
    user_id integer,
    rating numeric(2,1) NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    stock integer DEFAULT 0,
    category_id integer,
    seller_id integer,
    hybrid_id integer,
    condition_id integer,
    average_rating numeric(2,1) DEFAULT 0,
    rating_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tierone_price numeric(10,2) DEFAULT NULL::numeric,
    tiertwo_price numeric(10,2) DEFAULT NULL::numeric,
    tierthree_price numeric(10,2) DEFAULT NULL::numeric,
    stripe_product_id character varying(255) DEFAULT NULL::character varying,
    stripe_price_id character varying(255) DEFAULT NULL::character varying,
    CONSTRAINT products_average_rating_check CHECK (((average_rating >= (0)::numeric) AND (average_rating <= (5)::numeric))),
    CONSTRAINT products_check CHECK ((((seller_id IS NOT NULL) AND (hybrid_id IS NULL)) OR ((seller_id IS NULL) AND (hybrid_id IS NOT NULL)))),
    CONSTRAINT products_rating_count_check CHECK ((rating_count >= 0)),
    CONSTRAINT products_stock_check CHECK ((stock >= 0)),
    CONSTRAINT products_tierone_price_check CHECK ((tierone_price >= (0)::numeric)),
    CONSTRAINT products_tierthree_price_check CHECK ((tierthree_price >= (0)::numeric)),
    CONSTRAINT products_tiertwo_price_check CHECK ((tiertwo_price >= (0)::numeric))
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: save_for_later_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.save_for_later_items (
    item_id integer NOT NULL,
    list_id integer NOT NULL,
    product_id integer NOT NULL,
    added_at timestamp with time zone DEFAULT now()
);


--
-- Name: save_for_later_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.save_for_later_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: save_for_later_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.save_for_later_items_item_id_seq OWNED BY public.save_for_later_items.item_id;


--
-- Name: save_for_later_lists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.save_for_later_lists (
    list_id integer NOT NULL,
    customer_id integer,
    hybrid_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_userroleexclusivity CHECK ((((customer_id IS NOT NULL) AND (hybrid_id IS NULL)) OR ((customer_id IS NULL) AND (hybrid_id IS NOT NULL))))
);


--
-- Name: save_for_later_lists_list_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.save_for_later_lists_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: save_for_later_lists_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.save_for_later_lists_list_id_seq OWNED BY public.save_for_later_lists.list_id;


--
-- Name: sellers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sellers (
    seller_id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_account_id character varying(255),
    status character varying(20) DEFAULT 'unverify'::character varying NOT NULL,
    CONSTRAINT sellers_status_check CHECK (((status)::text = ANY ((ARRAY['verified'::character varying, 'unverify'::character varying])::text[])))
);


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sellers_seller_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sellers_seller_id_seq OWNED BY public.sellers.seller_id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    session_id integer NOT NULL,
    user_id integer NOT NULL,
    session_token character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


--
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    role_id integer NOT NULL,
    role_name character varying(255),
    CONSTRAINT chk_rolename CHECK (((role_name)::text = ANY ((ARRAY['admin'::character varying, 'seller'::character varying, 'customer'::character varying, 'hybrid'::character varying, 'owner'::character varying])::text[])))
);


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_roles_role_id_seq OWNED BY public.user_roles.role_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at timestamp without time zone,
    login_attempts integer DEFAULT 0 NOT NULL,
    failed_login_attempts integer DEFAULT 0 NOT NULL,
    login_count integer DEFAULT 0 NOT NULL,
    verification_code character varying(255),
    code_timestamp timestamp without time zone,
    code_expiration timestamp without time zone,
    reset_password_token character varying(255),
    reset_password_token_timestamp timestamp without time zone,
    reset_password_token_expiration timestamp without time zone
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: cart_items item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN item_id SET DEFAULT nextval('public.cart_items_item_id_seq'::regclass);


--
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: conditions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conditions ALTER COLUMN id SET DEFAULT nextval('public.conditions_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features ALTER COLUMN id SET DEFAULT nextval('public.features_id_seq'::regclass);


--
-- Name: hybrids hybrid_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hybrids ALTER COLUMN hybrid_id SET DEFAULT nextval('public.hybrids_hybrid_id_seq'::regclass);


--
-- Name: manufacturers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manufacturers ALTER COLUMN id SET DEFAULT nextval('public.manufacturers_id_seq'::regclass);


--
-- Name: owners owner_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owners ALTER COLUMN owner_id SET DEFAULT nextval('public.owners_owner_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: save_for_later_items item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_items ALTER COLUMN item_id SET DEFAULT nextval('public.save_for_later_items_item_id_seq'::regclass);


--
-- Name: save_for_later_lists list_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_lists ALTER COLUMN list_id SET DEFAULT nextval('public.save_for_later_lists_list_id_seq'::regclass);


--
-- Name: sellers seller_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers ALTER COLUMN seller_id SET DEFAULT nextval('public.sellers_seller_id_seq'::regclass);


--
-- Name: sessions session_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);


--
-- Name: user_roles role_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN role_id SET DEFAULT nextval('public.user_roles_role_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (admin_id, user_id) FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name) FROM stdin;
1	Sony
2	Samsung
3	Apple
4	Huawei
5	Pocco
6	Lenovo
7	LG
8	Panasonic
9	Dell
10	Xiaomi
11	Google
12	Microsoft
13	Amazon
14	Tesla
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (item_id, cart_id, product_id, quantity, added_at, status) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (cart_id, customer_id, hybrid_id, session_id, payment_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name) FROM stdin;
1	Electronics
2	Mobile Accessory
3	Smart Phones
4	Modern Tech
\.


--
-- Data for Name: category_brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category_brands (category_id, brand_id) FROM stdin;
1	1
2	2
2	3
2	4
2	5
2	6
1	2
1	7
1	8
1	9
3	2
3	3
3	4
3	5
3	10
3	11
4	3
4	11
4	12
4	13
4	14
\.


--
-- Data for Name: category_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category_features (category_id, feature_id) FROM stdin;
1	1
2	2
2	3
2	4
2	5
2	6
1	7
1	8
1	9
1	10
3	2
3	4
3	5
3	6
3	11
3	12
4	13
4	14
4	15
4	16
\.


--
-- Data for Name: category_manufacturers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category_manufacturers (category_id, manufacturer_id) FROM stdin;
1	1
2	2
2	3
2	4
2	5
1	6
1	7
1	8
1	9
3	2
3	5
3	10
3	11
3	12
4	13
4	14
4	15
4	16
\.


--
-- Data for Name: conditions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conditions (id, value, label) FROM stdin;
1	any	Any
2	refurbished	Refurbished
3	brandNew	Brand New
4	oldItems	Old Items
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (customer_id, user_id) FROM stdin;
4	11
5	19
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.features (id, name) FROM stdin;
1	Noise Cancellation
2	Metallic
3	Plastic cover
4	8GB Ram
5	Super power
6	Large Memory
7	Smart Connectivity
8	High Resolution
9	Energy Efficient
10	Portable
11	OLED Display
12	5G Ready
13	AI Powered
14	IoT Enabled
15	Quantum Computing
16	Augmented Reality
\.


--
-- Data for Name: hybrids; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hybrids (hybrid_id, user_id, stripe_account_id, status) FROM stdin;
3	13	\N	verified
\.


--
-- Data for Name: manufacturers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.manufacturers (id, name) FROM stdin;
1	Sony Corp
2	Foxconn
3	Luxshare Precision
4	Goertek
5	BYD Electronics
6	Samsung Electronics
7	LG Electronics
8	Sony Corporation
9	TSMC
10	Pegatron
11	Wistron
12	Wingtech
13	Intel
14	NVIDIA
15	AMD
16	Qualcomm
\.


--
-- Data for Name: owners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.owners (owner_id, user_id) FROM stdin;
\.


--
-- Data for Name: product_brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_brands (product_id, brand_id) FROM stdin;
61	2
\.


--
-- Data for Name: product_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_features (product_id, feature_id) FROM stdin;
61	5
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, uploaded_at, public_id) FROM stdin;
97	61	https://res.cloudinary.com/dhfnonqir/image/upload/v1754208823/products/azidv7eszh1pb7htcy3t.jpg	2025-08-03 13:13:43.486	products/azidv7eszh1pb7htcy3t
\.


--
-- Data for Name: product_manufacturers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_manufacturers (product_id, manufacturer_id) FROM stdin;
61	10
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_reviews (id, product_id, user_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, title, description, stock, category_id, seller_id, hybrid_id, condition_id, average_rating, rating_count, is_active, created_at, updated_at, tierone_price, tiertwo_price, tierthree_price, stripe_product_id, stripe_price_id) FROM stdin;
61	New Product	PPPP	1400	3	2	\N	3	0.0	0	t	2025-08-03 13:13:42.047587	2025-08-03 13:13:42.047587	150.00	100.00	150.00	prod_SnY9HyBxHJ0OdI	price_1Rrx37C8cDUrLzqNVK86twNp
\.


--
-- Data for Name: save_for_later_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.save_for_later_items (item_id, list_id, product_id, added_at) FROM stdin;
\.


--
-- Data for Name: save_for_later_lists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.save_for_later_lists (list_id, customer_id, hybrid_id, created_at, updated_at) FROM stdin;
1	5	\N	2025-08-02 16:51:05.844883+05	2025-08-02 16:51:05.844883+05
\.


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sellers (seller_id, user_id, stripe_account_id, status) FROM stdin;
2	10	acct_1RrH5OC8cDUrLzqN	verified
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (session_id, user_id, session_token, created_at, expires_at) FROM stdin;
112	19	9b7479a70489500bc148924b225396f3aa0f1d857854538465624977817e4153	2025-08-02 21:30:45.165	2025-08-02 22:30:45.165
113	10	8d3d445eb57b83ce228d2347b10b22aa7c0e3a68f0b4b89a4dc5d900214407a9	2025-08-03 17:57:36.776	2025-08-03 18:57:36.776
76	17	f5f78ce52bb7d6899bff02dde7d937f1661a3f2182cf6ba685836ff903b57dc4	2025-08-01 22:17:24.818	2025-08-01 23:17:24.818
96	13	026ed01d9f236968995375d44b9460461b7680266600670c48449bb819f94ff5	2025-08-02 07:03:17.947	2025-08-02 08:03:17.947
97	13	32b87d382e8a1d7c976e081bec3dbdfa78e01dab7a8807860a3e29c9c0e03b7a	2025-08-02 07:03:17.949	2025-08-02 08:03:17.949
103	11	faaecdd4b96af5b29c8dbd9d6e329faa46bf1c01040c6eb8a61ed65ec810d660	2025-08-02 17:49:43.663	2025-08-02 18:49:43.663
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (role_id, role_name) FROM stdin;
1	owner
2	admin
3	seller
4	customer
5	hybrid
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, email, password, role_id, created_at, last_login_at, login_attempts, failed_login_attempts, login_count, verification_code, code_timestamp, code_expiration, reset_password_token, reset_password_token_timestamp, reset_password_token_expiration) FROM stdin;
19	Customer 02	customer2@gmail.com	$2b$10$GreoNuS13Hjn6BYpLB2vfuF8f1CL.2IZzJlvBVPPEfE1yQuKqd6Te	4	2025-08-02 12:56:30.112	2025-08-02 16:30:45.181975	0	0	8	$2b$10$G.5Er0RoIeq0MZ5wJ4JvFOn6R4Ea5tvuCmxSek80Eh5HlGBTCdFPO	2025-08-02 12:56:30.112	2025-08-02 12:57:30.112	\N	\N	\N
13	Hybrid	hybrid@gmail.com	$2b$10$6SRddWwEEOXHivD5T4x0leFad/30TbGmwJJfFskYawh9H9j0g5lk6	5	2025-07-30 02:06:58.652	2025-08-02 02:03:17.955477	0	0	11	$2b$10$GnhqHQon8Z5T3OKl2JirYuu84/sHJe/6NWyJcfZs5sNw9FnQWcWkW	2025-07-30 02:06:58.652	2025-07-30 02:07:58.652	\N	\N	\N
10	Seller	seller@gmail.com	$2b$10$Jb84g0OOJdmamCyzhZSCqOopIM638oTGlN1HOt2saAgzbwUeswJJa	3	2025-07-30 02:04:46.468	2025-08-03 12:57:36.801053	0	0	54	$2b$10$bjQvH93Pg0j1ISb4KU4Oa.w16ajMfP4SAQGysWb7dkM3/eDSHDTKq	2025-07-30 02:04:46.468	2025-07-30 02:05:46.468	\N	\N	\N
15	Admin	admin@gmail.com	$2b$10$Jb84g0OOJdmamCyzhZSCqOopIM638oTGlN1HOt2saAgzbwUeswJJa	2	2025-07-30 02:08:41.17444	\N	0	0	0	\N	\N	\N	\N	\N	\N
16	Owner	owner@gmail.com	$2b$10$Jb84g0OOJdmamCyzhZSCqOopIM638oTGlN1HOt2saAgzbwUeswJJa	1	2025-07-30 02:08:47.572046	\N	0	0	0	\N	\N	\N	\N	\N	\N
17	Seller2	seller2@gmail.com	$2b$10$8SSS66sCp.pcxL3EPv8lnOFoTcaiWCkAYNOcsisxR.wgwKuXc98Ji	3	2025-08-01 17:13:34.587	2025-08-01 17:17:24.825572	0	0	3	$2b$10$Y5tTLNZYMGUCyqDCi8mU6uFRUgGH9CEfFPEgOg5JjMqeH3/uMx1Jy	2025-08-01 17:13:34.587	2025-08-01 17:14:34.587	\N	\N	\N
11	Customer	customer@gmail.com	$2b$10$0ZJVA.Yt6TB9wQiMdgYgueTrP3v2IRHLwH7f62OtP8I6thTwuNQAO	4	2025-07-30 02:05:14.358	2025-08-02 12:49:43.71611	0	0	13	$2b$10$RRv2KOxbfQ5c9c.b3Ua5Iey/5IzZE1uJCY4HklClce4vQQcz1lEKu	2025-07-30 02:05:14.358	2025-07-30 02:06:14.358	\N	\N	\N
\.


--
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 14, true);


--
-- Name: cart_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_item_id_seq', 14, true);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: conditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conditions_id_seq', 4, true);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 5, true);


--
-- Name: features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.features_id_seq', 16, true);


--
-- Name: hybrids_hybrid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hybrids_hybrid_id_seq', 3, true);


--
-- Name: manufacturers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.manufacturers_id_seq', 16, true);


--
-- Name: owners_owner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.owners_owner_id_seq', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 97, true);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 61, true);


--
-- Name: save_for_later_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.save_for_later_items_item_id_seq', 4, true);


--
-- Name: save_for_later_lists_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.save_for_later_lists_list_id_seq', 1, true);


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sellers_seller_id_seq', 3, true);


--
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 113, true);


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_roles_role_id_seq', 5, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 19, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: admins admins_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);


--
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (item_id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_brands category_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_brands
    ADD CONSTRAINT category_brands_pkey PRIMARY KEY (category_id, brand_id);


--
-- Name: category_features category_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_features
    ADD CONSTRAINT category_features_pkey PRIMARY KEY (category_id, feature_id);


--
-- Name: category_manufacturers category_manufacturers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_manufacturers
    ADD CONSTRAINT category_manufacturers_pkey PRIMARY KEY (category_id, manufacturer_id);


--
-- Name: conditions conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_pkey PRIMARY KEY (id);


--
-- Name: conditions conditions_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_value_key UNIQUE (value);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: customers customers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_key UNIQUE (user_id);


--
-- Name: features features_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_name_key UNIQUE (name);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: hybrids hybrids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hybrids
    ADD CONSTRAINT hybrids_pkey PRIMARY KEY (hybrid_id);


--
-- Name: hybrids hybrids_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hybrids
    ADD CONSTRAINT hybrids_user_id_key UNIQUE (user_id);


--
-- Name: manufacturers manufacturers_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_name_key UNIQUE (name);


--
-- Name: manufacturers manufacturers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_pkey PRIMARY KEY (id);


--
-- Name: owners owners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_pkey PRIMARY KEY (owner_id);


--
-- Name: owners owners_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_user_id_key UNIQUE (user_id);


--
-- Name: product_brands product_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_brands
    ADD CONSTRAINT product_brands_pkey PRIMARY KEY (product_id, brand_id);


--
-- Name: product_features product_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_features
    ADD CONSTRAINT product_features_pkey PRIMARY KEY (product_id, feature_id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_manufacturers product_manufacturers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_manufacturers
    ADD CONSTRAINT product_manufacturers_pkey PRIMARY KEY (product_id, manufacturer_id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_product_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_user_id_key UNIQUE (product_id, user_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: save_for_later_items save_for_later_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_items
    ADD CONSTRAINT save_for_later_items_pkey PRIMARY KEY (item_id);


--
-- Name: save_for_later_lists save_for_later_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_lists
    ADD CONSTRAINT save_for_later_lists_pkey PRIMARY KEY (list_id);


--
-- Name: sellers sellers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_pkey PRIMARY KEY (seller_id);


--
-- Name: sellers sellers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_user_id_key UNIQUE (user_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- Name: carts carts_hybrid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_hybrid_id_fkey FOREIGN KEY (hybrid_id) REFERENCES public.hybrids(hybrid_id);


--
-- Name: category_brands category_brands_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_brands
    ADD CONSTRAINT category_brands_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: category_brands category_brands_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_brands
    ADD CONSTRAINT category_brands_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_features category_features_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_features
    ADD CONSTRAINT category_features_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_features category_features_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_features
    ADD CONSTRAINT category_features_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: category_manufacturers category_manufacturers_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_manufacturers
    ADD CONSTRAINT category_manufacturers_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_manufacturers category_manufacturers_manufacturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_manufacturers
    ADD CONSTRAINT category_manufacturers_manufacturer_id_fkey FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(id) ON DELETE CASCADE;


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: hybrids hybrids_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hybrids
    ADD CONSTRAINT hybrids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: owners owners_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: product_brands product_brands_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_brands
    ADD CONSTRAINT product_brands_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: product_brands product_brands_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_brands
    ADD CONSTRAINT product_brands_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_features product_features_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_features
    ADD CONSTRAINT product_features_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: product_features product_features_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_features
    ADD CONSTRAINT product_features_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_manufacturers product_manufacturers_manufacturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_manufacturers
    ADD CONSTRAINT product_manufacturers_manufacturer_id_fkey FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(id) ON DELETE CASCADE;


--
-- Name: product_manufacturers product_manufacturers_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_manufacturers
    ADD CONSTRAINT product_manufacturers_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products products_condition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_condition_id_fkey FOREIGN KEY (condition_id) REFERENCES public.conditions(id);


--
-- Name: products products_hybrid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_hybrid_id_fkey FOREIGN KEY (hybrid_id) REFERENCES public.hybrids(hybrid_id) ON DELETE CASCADE;


--
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(seller_id) ON DELETE CASCADE;


--
-- Name: save_for_later_items save_for_later_items_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_items
    ADD CONSTRAINT save_for_later_items_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.save_for_later_lists(list_id) ON DELETE CASCADE;


--
-- Name: save_for_later_items save_for_later_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_items
    ADD CONSTRAINT save_for_later_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: save_for_later_lists save_for_later_lists_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_lists
    ADD CONSTRAINT save_for_later_lists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- Name: save_for_later_lists save_for_later_lists_hybrid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.save_for_later_lists
    ADD CONSTRAINT save_for_later_lists_hybrid_id_fkey FOREIGN KEY (hybrid_id) REFERENCES public.hybrids(hybrid_id);


--
-- Name: sellers sellers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_roles(role_id);


--
-- PostgreSQL database dump complete
--

