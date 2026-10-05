-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 10 sep. 2026 à 11:25
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `livraison_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `api_order`
--

CREATE TABLE `api_order` (
  `id` bigint(20) NOT NULL,
  `adresse_texte` longtext NOT NULL,
  `telephone` varchar(30) NOT NULL,
  `montant_total` decimal(12,2) NOT NULL,
  `statut` varchar(20) NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `client_id` bigint(20) NOT NULL,
  `livreur_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `api_order`
--

INSERT INTO `api_order` (`id`, `adresse_texte`, `telephone`, `montant_total`, `statut`, `date_creation`, `updated_at`, `client_id`, `livreur_id`) VALUES
(1, 'Analakely', '0344672333', 40800.00, 'IN_DELIVERY', '2026-09-10 09:21:39.362112', '2026-09-10 09:22:55.606918', 4, 2);

-- --------------------------------------------------------

--
-- Structure de la table `api_orderitem`
--

CREATE TABLE `api_orderitem` (
  `id` bigint(20) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL CHECK (`quantity` >= 0),
  `unit_price` decimal(10,2) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `api_orderitem`
--

INSERT INTO `api_orderitem` (`id`, `quantity`, `unit_price`, `order_id`, `product_id`) VALUES
(1, 1, 12500.00, 1, 3),
(2, 1, 9800.00, 1, 2),
(3, 1, 18500.00, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `api_product`
--

CREATE TABLE `api_product` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL CHECK (`stock` >= 0),
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `api_product`
--

INSERT INTO `api_product` (`id`, `name`, `description`, `price`, `stock`, `created_at`) VALUES
(1, 'Riz Basmati 5kg', 'Riz basmati de qualité premium, paquet de 5 kg.', 18500.00, 39, '2026-09-10 09:18:48.667551'),
(2, 'Huile de tournesol 2L', 'Huile végétale raffinée, bouteille 2 litres.', 9800.00, 59, '2026-09-10 09:18:48.671520'),
(3, 'Café torréfié 250g', 'Café arabica torréfié artisanalement, 250 g.', 12500.00, 24, '2026-09-10 09:18:48.676515');

-- --------------------------------------------------------

--
-- Structure de la table `api_user`
--

CREATE TABLE `api_user` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `api_user`
--

INSERT INTO `api_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `role`) VALUES
(1, 'pbkdf2_sha256$720000$NKifGmHw2Ar6TvIidQxQqO$1tNZOKOU9QwXmbnnkb/TQDaE9k5Oqam3f7bE2hfy3AE=', NULL, 1, 'admin', 'Admin', 'Dispatch', 'admin@livraison.local', 1, 1, '2026-09-10 09:18:48.681514', 'ADMIN_DISPATCH'),
(2, 'pbkdf2_sha256$720000$TcXc13oIPalsokc0ylyx1p$QDh/J/ldbq0diZKIrYfkBjDDOEPUon3r2iOUoAw8nv4=', NULL, 0, 'livreur1', 'Jean', 'Livreur', 'livreur1@livraison.local', 0, 1, '2026-09-10 09:18:49.628503', 'LIVREUR'),
(3, 'pbkdf2_sha256$720000$GGvvbfwKnYc9v9IsRSyoNW$iOZPqA+EAXcj/E7PLmBJaPG60StLmRzEZkBIrKaZ0Dw=', NULL, 0, 'client1', 'Marie', 'Client', 'client1@livraison.local', 0, 1, '2026-09-10 09:18:50.543491', 'CLIENT'),
(4, 'pbkdf2_sha256$720000$3bVSqECT4DPHLd6fbDYu0k$BDeVkiMBdU1BPK+tUHJdJCIUL2C0YPbqhuF5eUuSp+c=', NULL, 0, 'thinot', 'Thinot', 'RANDRIAMALALA', 'thinotrandria@gmail.com', 0, 1, '2026-09-10 09:21:01.025817', 'CLIENT');

-- --------------------------------------------------------

--
-- Structure de la table `api_user_groups`
--

CREATE TABLE `api_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `api_user_user_permissions`
--

CREATE TABLE `api_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_user'),
(22, 'Can change user', 6, 'change_user'),
(23, 'Can delete user', 6, 'delete_user'),
(24, 'Can view user', 6, 'view_user'),
(25, 'Can add product', 7, 'add_product'),
(26, 'Can change product', 7, 'change_product'),
(27, 'Can delete product', 7, 'delete_product'),
(28, 'Can view product', 7, 'view_product'),
(29, 'Can add order', 8, 'add_order'),
(30, 'Can change order', 8, 'change_order'),
(31, 'Can delete order', 8, 'delete_order'),
(32, 'Can view order', 8, 'view_order'),
(33, 'Can add order item', 9, 'add_orderitem'),
(34, 'Can change order item', 9, 'change_orderitem'),
(35, 'Can delete order item', 9, 'delete_orderitem'),
(36, 'Can view order item', 9, 'view_orderitem');

-- --------------------------------------------------------

--
-- Structure de la table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(8, 'api', 'order'),
(9, 'api', 'orderitem'),
(7, 'api', 'product'),
(6, 'api', 'user'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(5, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Structure de la table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-09-10 09:06:07.110504'),
(2, 'contenttypes', '0002_remove_content_type_name', '2026-09-10 09:06:07.207445'),
(3, 'auth', '0001_initial', '2026-09-10 09:06:07.419312'),
(4, 'auth', '0002_alter_permission_name_max_length', '2026-09-10 09:06:07.466284'),
(5, 'auth', '0003_alter_user_email_max_length', '2026-09-10 09:06:07.474277'),
(6, 'auth', '0004_alter_user_username_opts', '2026-09-10 09:06:07.485624'),
(7, 'auth', '0005_alter_user_last_login_null', '2026-09-10 09:06:07.494141'),
(8, 'auth', '0006_require_contenttypes_0002', '2026-09-10 09:06:07.495141'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2026-09-10 09:06:07.507133'),
(10, 'auth', '0008_alter_user_username_max_length', '2026-09-10 09:06:07.514130'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2026-09-10 09:06:07.524124'),
(12, 'auth', '0010_alter_group_name_max_length', '2026-09-10 09:06:07.539117'),
(13, 'auth', '0011_update_proxy_permissions', '2026-09-10 09:06:07.548110'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2026-09-10 09:06:07.556102'),
(15, 'api', '0001_initial', '2026-09-10 09:06:08.090205'),
(16, 'admin', '0001_initial', '2026-09-10 09:06:08.226120'),
(17, 'admin', '0002_logentry_remove_auto_add', '2026-09-10 09:06:08.238113'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2026-09-10 09:06:08.255103'),
(19, 'api', '0002_alter_user_groups', '2026-09-10 09:06:08.277092'),
(20, 'sessions', '0001_initial', '2026-09-10 09:06:08.320064');

-- --------------------------------------------------------

--
-- Structure de la table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `api_order`
--
ALTER TABLE `api_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_order_client_id_e102c509_fk_api_user_id` (`client_id`),
  ADD KEY `api_order_livreur_id_73d1c1db_fk_api_user_id` (`livreur_id`);

--
-- Index pour la table `api_orderitem`
--
ALTER TABLE `api_orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_orderitem_order_id_f9c0afc0_fk_api_order_id` (`order_id`),
  ADD KEY `api_orderitem_product_id_afd9cdd0_fk_api_product_id` (`product_id`);

--
-- Index pour la table `api_product`
--
ALTER TABLE `api_product`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `api_user`
--
ALTER TABLE `api_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_user_groups_user_id_group_id_9c7ddfb5_uniq` (`user_id`,`group_id`),
  ADD KEY `api_user_groups_group_id_3af85785_fk_auth_group_id` (`group_id`);

--
-- Index pour la table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_user_user_permissions_user_id_permission_id_a06dd704_uniq` (`user_id`,`permission_id`),
  ADD KEY `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` (`permission_id`);

--
-- Index pour la table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Index pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Index pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_api_user_id` (`user_id`);

--
-- Index pour la table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Index pour la table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `api_order`
--
ALTER TABLE `api_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `api_orderitem`
--
ALTER TABLE `api_orderitem`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `api_product`
--
ALTER TABLE `api_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `api_user`
--
ALTER TABLE `api_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `api_order`
--
ALTER TABLE `api_order`
  ADD CONSTRAINT `api_order_client_id_e102c509_fk_api_user_id` FOREIGN KEY (`client_id`) REFERENCES `api_user` (`id`),
  ADD CONSTRAINT `api_order_livreur_id_73d1c1db_fk_api_user_id` FOREIGN KEY (`livreur_id`) REFERENCES `api_user` (`id`);

--
-- Contraintes pour la table `api_orderitem`
--
ALTER TABLE `api_orderitem`
  ADD CONSTRAINT `api_orderitem_order_id_f9c0afc0_fk_api_order_id` FOREIGN KEY (`order_id`) REFERENCES `api_order` (`id`),
  ADD CONSTRAINT `api_orderitem_product_id_afd9cdd0_fk_api_product_id` FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`);

--
-- Contraintes pour la table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  ADD CONSTRAINT `api_user_groups_group_id_3af85785_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `api_user_groups_user_id_a5ff39fa_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);

--
-- Contraintes pour la table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  ADD CONSTRAINT `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `api_user_user_permissions_user_id_f3945d65_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);

--
-- Contraintes pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Contraintes pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Contraintes pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
