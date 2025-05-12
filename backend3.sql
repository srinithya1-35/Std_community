-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: college_portal
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Academic_Calendar`
--

DROP TABLE IF EXISTS `Academic_Calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Academic_Calendar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Academic_Calendar`
--

LOCK TABLES `Academic_Calendar` WRITE;
/*!40000 ALTER TABLE `Academic_Calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `Academic_Calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `admin_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `password` varchar(225) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `Email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (1,'Dr.Anjali Rao','anjali.rao@college.edu','9876543210','anj_rao23'),(2,'Prof.Rajesh Nair','rajesh.nair@college.edu','9123456789','raj_nair96'),(3,'Dr.Meena Iyer','meena.iyer@college.edu','9988776655','mee_iyer42'),(4,'Prof.Kiran Desai','kiran.desai@college.edu','8899001122','kir_desai77'),(5,'Prof.Shalini Verma','shalini.verma@college.edu',' 9011223344','shali_verma82'),(6,'Dr.Ravi Kumar','ravi.kumar@college.edu','9345678901','ravi_kumar55'),(7,'Prof.Neha Joshi','neha.joshi@college.edu','9786012345','neha_josh13'),(8,'Prof.Akash Bhat','akash.bhat@college.edu','9654321789','akash_bhat64'),(9,'Dr.Priya Shah','priya.shah@college.edu','9922334455','pri_shah09'),(10,'Prof.Manish Gupta','manish.gupta@college.edu','9867543201','man_gupta24');
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendance`
--

DROP TABLE IF EXISTS `Attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `subjects_id` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent') NOT NULL,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `uniq_studentID_Subjectsid_Date` (`student_id`,`subjects_id`,`date`),
  KEY `fk-StudentID_idx` (`student_id`),
  KEY `fk_Attendance_1_idx` (`subjects_id`),
  CONSTRAINT `fk_Attendance_1` FOREIGN KEY (`subjects_id`) REFERENCES `Subjects` (`subjects_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_StudentID_1` FOREIGN KEY (`student_id`) REFERENCES `Student` (`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendance`
--

LOCK TABLES `Attendance` WRITE;
/*!40000 ALTER TABLE `Attendance` DISABLE KEYS */;
INSERT INTO `Attendance` VALUES (1,1,2,'2025-05-09','Present'),(2,2,2,'2025-05-09','Present'),(3,3,2,'2025-05-09','Present'),(4,4,2,'2025-05-09','Present'),(5,5,2,'2025-05-09','Present'),(6,6,2,'2025-05-09','Present'),(7,7,2,'2025-05-09','Present'),(8,8,2,'2025-05-09','Present'),(9,9,2,'2025-05-09','Present'),(10,10,2,'2025-05-09','Present'),(11,11,2,'2025-05-09','Present'),(12,12,2,'2025-05-09','Present'),(13,13,2,'2025-05-09','Present'),(14,14,2,'2025-05-09','Present'),(15,15,2,'2025-05-09','Present'),(16,16,2,'2025-05-09','Present'),(17,17,2,'2025-05-09','Present'),(18,18,2,'2025-05-09','Present'),(19,19,2,'2025-05-09','Present'),(20,20,2,'2025-05-09','Present'),(21,21,2,'2025-05-09','Present'),(22,22,2,'2025-05-09','Present'),(23,23,2,'2025-05-09','Absent'),(24,24,2,'2025-05-09','Present'),(25,25,2,'2025-05-09','Absent'),(26,26,2,'2025-05-09','Present'),(27,27,2,'2025-05-09','Absent'),(28,28,2,'2025-05-09','Present'),(29,29,2,'2025-05-09','Absent'),(30,30,2,'2025-05-09','Present'),(31,31,2,'2025-05-09','Present'),(32,32,2,'2025-05-09','Present'),(33,33,2,'2025-05-09','Absent'),(34,34,2,'2025-05-09','Present'),(35,35,2,'2025-05-09','Present'),(36,36,2,'2025-05-09','Present'),(37,37,2,'2025-05-09','Present'),(38,38,2,'2025-05-09','Present'),(39,39,2,'2025-05-09','Present'),(40,40,2,'2025-05-09','Present'),(41,41,2,'2025-05-09','Present'),(42,1,4,'2025-05-11','Absent'),(43,2,4,'2025-05-11','Absent'),(44,3,4,'2025-05-11','Absent'),(45,4,4,'2025-05-11','Absent'),(46,5,4,'2025-05-11','Absent'),(47,6,4,'2025-05-11','Absent'),(48,7,4,'2025-05-11','Present'),(49,8,4,'2025-05-11','Absent'),(50,9,4,'2025-05-11','Absent'),(51,10,4,'2025-05-11','Absent'),(52,11,4,'2025-05-11','Absent'),(53,12,4,'2025-05-11','Absent'),(54,13,4,'2025-05-11','Absent'),(55,14,4,'2025-05-11','Absent'),(56,15,4,'2025-05-11','Absent'),(57,16,4,'2025-05-11','Absent'),(58,17,4,'2025-05-11','Absent'),(59,18,4,'2025-05-11','Absent'),(60,19,4,'2025-05-11','Absent'),(61,20,4,'2025-05-11','Absent'),(62,21,4,'2025-05-11','Absent'),(63,22,4,'2025-05-11','Absent'),(64,23,4,'2025-05-11','Absent'),(65,24,4,'2025-05-11','Absent'),(66,25,4,'2025-05-11','Absent'),(67,26,4,'2025-05-11','Absent'),(68,27,4,'2025-05-11','Absent'),(69,28,4,'2025-05-11','Absent'),(70,29,4,'2025-05-11','Absent'),(71,30,4,'2025-05-11','Absent'),(72,31,4,'2025-05-11','Absent'),(73,32,4,'2025-05-11','Absent'),(74,33,4,'2025-05-11','Absent'),(75,34,4,'2025-05-11','Absent'),(76,35,4,'2025-05-11','Absent'),(77,36,4,'2025-05-11','Absent'),(78,37,4,'2025-05-11','Absent'),(79,38,4,'2025-05-11','Absent'),(80,39,4,'2025-05-11','Absent'),(81,40,4,'2025-05-11','Absent'),(82,41,4,'2025-05-11','Absent'),(83,1,6,'2025-05-11','Present'),(84,2,6,'2025-05-11','Present'),(85,3,6,'2025-05-11','Present'),(86,4,6,'2025-05-11','Present'),(87,5,6,'2025-05-11','Present'),(88,6,6,'2025-05-11','Present'),(89,7,6,'2025-05-11','Present'),(90,8,6,'2025-05-11','Present'),(91,9,6,'2025-05-11','Present'),(92,10,6,'2025-05-11','Present'),(93,11,6,'2025-05-11','Present'),(94,12,6,'2025-05-11','Present'),(95,13,6,'2025-05-11','Present'),(96,14,6,'2025-05-11','Present'),(97,15,6,'2025-05-11','Present'),(98,16,6,'2025-05-11','Present'),(99,17,6,'2025-05-11','Present'),(100,18,6,'2025-05-11','Present'),(101,19,6,'2025-05-11','Present'),(102,20,6,'2025-05-11','Present'),(103,21,6,'2025-05-11','Present'),(104,22,6,'2025-05-11','Present'),(105,23,6,'2025-05-11','Present'),(106,24,6,'2025-05-11','Present'),(107,25,6,'2025-05-11','Present'),(108,26,6,'2025-05-11','Present'),(109,27,6,'2025-05-11','Present'),(110,28,6,'2025-05-11','Present'),(111,29,6,'2025-05-11','Present'),(112,30,6,'2025-05-11','Present'),(113,31,6,'2025-05-11','Present'),(114,32,6,'2025-05-11','Present'),(115,33,6,'2025-05-11','Present'),(116,34,6,'2025-05-11','Present'),(117,35,6,'2025-05-11','Present'),(118,36,6,'2025-05-11','Present'),(119,37,6,'2025-05-11','Present'),(120,38,6,'2025-05-11','Present'),(121,39,6,'2025-05-11','Present'),(122,40,6,'2025-05-11','Present'),(123,41,6,'2025-05-11','Present'),(124,1,2,'2025-05-12','Absent'),(125,2,2,'2025-05-12','Absent'),(126,3,2,'2025-05-12','Absent'),(127,4,2,'2025-05-12','Present'),(128,5,2,'2025-05-12','Absent'),(129,6,2,'2025-05-12','Absent'),(130,7,2,'2025-05-12','Present'),(131,8,2,'2025-05-12','Absent'),(132,9,2,'2025-05-12','Absent'),(133,10,2,'2025-05-12','Absent'),(134,11,2,'2025-05-12','Absent'),(135,12,2,'2025-05-12','Absent'),(136,13,2,'2025-05-12','Absent'),(137,14,2,'2025-05-12','Absent'),(138,15,2,'2025-05-12','Absent'),(139,16,2,'2025-05-12','Absent'),(140,17,2,'2025-05-12','Absent'),(141,18,2,'2025-05-12','Absent'),(142,19,2,'2025-05-12','Absent'),(143,20,2,'2025-05-12','Absent'),(144,21,2,'2025-05-12','Absent'),(145,22,2,'2025-05-12','Absent'),(146,23,2,'2025-05-12','Absent'),(147,24,2,'2025-05-12','Absent'),(148,25,2,'2025-05-12','Absent'),(149,26,2,'2025-05-12','Absent'),(150,27,2,'2025-05-12','Absent'),(151,28,2,'2025-05-12','Absent'),(152,29,2,'2025-05-12','Absent'),(153,30,2,'2025-05-12','Absent'),(154,31,2,'2025-05-12','Absent'),(155,32,2,'2025-05-12','Absent'),(156,33,2,'2025-05-12','Absent'),(157,34,2,'2025-05-12','Absent'),(158,35,2,'2025-05-12','Absent'),(159,36,2,'2025-05-12','Absent'),(160,37,2,'2025-05-12','Absent'),(161,38,2,'2025-05-12','Absent'),(162,39,2,'2025-05-12','Absent'),(163,40,2,'2025-05-12','Present'),(164,41,2,'2025-05-12','Absent');
/*!40000 ALTER TABLE `Attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Results`
--

DROP TABLE IF EXISTS `Results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_by` int NOT NULL,
  `student_id` int DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Results`
--

LOCK TABLES `Results` WRITE;
/*!40000 ALTER TABLE `Results` DISABLE KEYS */;
/*!40000 ALTER TABLE `Results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `student_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `uucms_id` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `uucms_id_UNIQUE` (`uucms_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
INSERT INTO `Student` VALUES (1,'Abhishek Raj','U18EZ22S0057','abhi_57'),(2,'Ajeeth P Rao','U18EZ22S0004','ajee_04'),(3,'Bheemashankar','U18EZ22S0030','bhee_30'),(4,'D Vijetha','U18EZ22S0154','dvij_154'),(5,'Danish Amin Bhat','U18EZ22S0125','dani_125'),(6,'Dhameliya Arjun Bharatbhai','U18EZ22S0031','arju_31'),(7,'G Sowparnika','U18EZ22S0096','gsow_96'),(8,'Haritaa Raju','U18EZ22S0068','hari_68'),(9,'Harsha Krishna Fattepur','U18EZ22S0140','hars_140'),(10,'Hridanshu Tagotra','U18EZ22S0097','hrid_97'),(11,'K Pavan','U18EZ22S0017','kpav_17'),(12,'Kanani Max Niteshbhai','U18EZ22S0028','kmax_28'),(13,'Karthikeyan R','U18EZ22S0053','kart_53'),(14,'Manish Kumar M','U18EZ22S0064','mani_64'),(15,'N Darshan','U18EZ22S0043','ndar_43'),(16,'NR Aravind','U18EZ22S0088','nrar_88'),(17,'Nagalakshmi D','U18EZ22S0066','naga_66'),(18,'Navaneetha S Bhatni','U18EZ22S0038','nava_38'),(19,'Nikki Rani','U18EZ22S0045','nikk_45'),(20,'Nithilan S','U18EZ22S0006','nith_06'),(21,'Prajwal S ','U18EZ22S0055','praj_55'),(22,'Preethi Sharma V','U18EZ22S0130','pree_130'),(23,'Rakshit R Kolur','U18EZ22S0092','raks_92'),(24,'Ramswaroop HR','U18EZ22S0107','rams_107'),(25,'Reehan Khan','U18EZ22S0133','reeh_133'),(26,'Ritesh Prajapati','U18EZ22S0144','rite_144'),(27,'Rohan R Doddamani','U18EZ22S0139','roha_139'),(28,'Sagar S','U18EZ22S0067','saga_67'),(29,'Sheik Shareef S','U18EZ22S0094','shei_94'),(30,'Shreya Pandey','U18EZ22S0082','shre_82'),(31,'Soniya Mamadapur','U18EZ22S0059','soni_59'),(32,'Sri Nithya Joshi','U18EZ22S0009','srin_09'),(33,'Srujan M','U18EZ22S0101','sruj_101'),(34,'Subrat Kumar Jena','U18EZ22S0087','subr_87'),(35,'Suhas Athreya Sai S','U18EZ22S0081','suha_81'),(36,'Sumith Kumar Biswas','U18EZ22S0029','sumi_29'),(37,'Syed Adnan','U18EZ22S0132','syad_132'),(38,'Syed Affan','U18EZ22S0131','syaf_131'),(39,'Syeda Bushra','U18EZ22S0104','sybu_104'),(40,'Taskeen Suaad','U18EZ22S0008','task_08'),(41,'Zameer Khan','U18EZ22S0025','zame_25');
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subjects`
--

DROP TABLE IF EXISTS `Subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subjects` (
  `subjects_id` int NOT NULL,
  `subjects_name` varchar(45) DEFAULT NULL,
  `subjects_code` varchar(45) NOT NULL,
  PRIMARY KEY (`subjects_id`),
  UNIQUE KEY `SubjectsCode_UNIQUE` (`subjects_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subjects`
--

LOCK TABLES `Subjects` WRITE;
/*!40000 ALTER TABLE `Subjects` DISABLE KEYS */;
INSERT INTO `Subjects` VALUES (1,'Electronic Content Design','ECD101'),(2,'Machine Learning','ML102'),(3,'Machine Learning Lab ','MLL102'),(4,'Mobile Application Development','MAD103'),(5,'Mobile Application Development Lab','MADL103'),(6,'Project Lab','PL104'),(7,'Software Tesing','ST105');
/*!40000 ALTER TABLE `Subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Timetable`
--

DROP TABLE IF EXISTS `Timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Timetable`
--

LOCK TABLES `Timetable` WRITE;
/*!40000 ALTER TABLE `Timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `Timetable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13  0:38:27
