
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `commentaire` varchar(1000) DEFAULT NULL,
  `date_creation` datetime(6) NOT NULL,
  `note` int(11) NOT NULL,
  `chauffeur_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_avis_course` (`course_id`),
  KEY `FKtboepahxksnynk7gs1wy6ahnt` (`chauffeur_id`),
  CONSTRAINT `FKqs99pr7iavl15c5yu3fcqtay3` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `FKtboepahxksnynk7gs1wy6ahnt` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `chauffeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chauffeur` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` bigint(20) DEFAULT NULL,
  `statut_validation` tinyint(4) DEFAULT 0,
  `note_moyenne` decimal(3,2) DEFAULT NULL,
  `solde_credit` decimal(10,2) DEFAULT NULL,
  `derniere_position_at` datetime(6) DEFAULT NULL,
  `disponible` bit(1) NOT NULL DEFAULT b'0',
  `latitude_actuelle` double DEFAULT NULL,
  `longitude_actuelle` double DEFAULT NULL,
  `version` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `chauffeur_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `passager_id` bigint(20) DEFAULT NULL,
  `chauffeur_id` bigint(20) DEFAULT NULL,
  `adresse_depart` varchar(255) DEFAULT NULL,
  `adresse_arrivee` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `statut` enum('EN_ATTENTE','PROPOSITION_RECUE','ACCEPTEE','CHAUFFEUR_EN_ROUTE','CHAUFFEUR_ARRIVE','EN_COURS','TERMINEE','ANNULEE') NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `prix_final` decimal(10,2) DEFAULT NULL,
  `prix_initial` decimal(10,2) DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `duree_estimee_minutes` int(11) DEFAULT NULL,
  `latitude_arrivee` double DEFAULT NULL,
  `latitude_depart` double DEFAULT NULL,
  `longitude_arrivee` double DEFAULT NULL,
  `longitude_depart` double DEFAULT NULL,
  `prix_estime` decimal(10,2) DEFAULT NULL,
  `version` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `passager_id` (`passager_id`),
  KEY `chauffeur_id` (`chauffeur_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`passager_id`) REFERENCES `passager` (`id`),
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `paiement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `methode` enum('CASH','CARTE','ONLINE') NOT NULL,
  `statut` enum('EN_ATTENTE','PAYE','REFUSE') NOT NULL,
  `date_paiement` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_id` (`course_id`),
  CONSTRAINT `paiement_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `passager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passager` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` bigint(20) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `passager_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `proposition_chauffeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proposition_chauffeur` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_creation` datetime(6) NOT NULL,
  `distance_chauffeur_depart` double DEFAULT NULL,
  `message` varchar(300) DEFAULT NULL,
  `prix_propose` decimal(10,2) NOT NULL,
  `statut_proposition` enum('EN_ATTENTE','ACCEPTEE','REFUSEE','ANNULEE') NOT NULL,
  `temps_estime_minutes` int(11) DEFAULT NULL,
  `chauffeur_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `version` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_course_chauffeur` (`course_id`,`chauffeur_id`),
  KEY `idx_proposition_course_statut` (`course_id`,`statut_proposition`),
  KEY `idx_proposition_chauffeur_date` (`chauffeur_id`,`date_creation`),
  CONSTRAINT `FK9x2c7smel0ewmx5xa3yi9y610` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeur` (`id`),
  CONSTRAINT `FKm8smp4aeaf7ujeri0t175cq24` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateur` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','CHAUFFEUR','PASSAGER') NOT NULL,
  `language` enum('FR','EN','AR') NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
