-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: biolab
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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

--
-- Table structure for table `actividadequipo`
--

DROP TABLE IF EXISTS `actividadequipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividadequipo` (
  `Id_ActividadEquipo` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Actividad` int(11) NOT NULL,
  `Id_Equipo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`Id_ActividadEquipo`),
  KEY `Id_Actividad` (`Id_Actividad`),
  KEY `Id_Equipo` (`Id_Equipo`),
  CONSTRAINT `actividadequipo_ibfk_44` FOREIGN KEY (`Id_Actividad`) REFERENCES `actividades` (`Id_Actividad`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `actividadequipo_ibfk_45` FOREIGN KEY (`Id_Equipo`) REFERENCES `equipo` (`Id_Equipo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividadequipo`
--

LOCK TABLES `actividadequipo` WRITE;
/*!40000 ALTER TABLE `actividadequipo` DISABLE KEYS */;
INSERT INTO `actividadequipo` VALUES (6,4,2,'2026-04-11 19:51:59','2026-04-11 19:51:59','Activo'),(7,4,3,'2026-04-11 19:51:59','2026-04-11 19:51:59','Activo'),(11,4,70,'2026-05-19 16:42:13','2026-05-19 16:42:13','Activo'),(12,4,1,'2026-05-19 16:42:12','2026-05-19 16:42:12','Activo');
/*!40000 ALTER TABLE `actividadequipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividades` (
  `Id_Actividad` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Actividad` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`Id_Actividad`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades`
--

LOCK TABLES `actividades` WRITE;
/*!40000 ALTER TABLE `actividades` DISABLE KEYS */;
INSERT INTO `actividades` VALUES (4,'Alistamiento y desinfección de explantes','2026-03-02 12:27:54','2026-03-02 12:27:54','Activo'),(5,'Preparación de Medios de Cultivo','2026-03-02 12:27:54','2026-03-02 12:27:54','Activo'),(6,'Preparación de medios de cultivo','2026-03-02 12:27:54','2026-03-02 12:27:54','Activo'),(7,'Sometimiento de explantes en el área de crecimient','2026-03-02 12:27:54','2026-03-02 12:27:54','Activo'),(8,'Microbiología agrícola en apoyo a biotecnología ve','2026-03-02 12:27:54','2026-03-02 12:27:54','Activo');
/*!40000 ALTER TABLE `actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actividadmaterial`
--

DROP TABLE IF EXISTS `actividadmaterial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividadmaterial` (
  `Id_ActividadMaterial` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Actividad` int(11) NOT NULL,
  `Id_Material` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`Id_ActividadMaterial`),
  KEY `Id_Actividad` (`Id_Actividad`),
  KEY `Id_Material` (`Id_Material`),
  CONSTRAINT `actividadmaterial_ibfk_37` FOREIGN KEY (`Id_Actividad`) REFERENCES `actividades` (`Id_Actividad`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `actividadmaterial_ibfk_38` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividadmaterial`
--

LOCK TABLES `actividadmaterial` WRITE;
/*!40000 ALTER TABLE `actividadmaterial` DISABLE KEYS */;
INSERT INTO `actividadmaterial` VALUES (2,4,5,'2026-04-11 19:53:32','2026-04-11 19:53:32','Activo'),(3,4,6,'2026-04-11 19:53:32','2026-04-11 19:53:32','Activo'),(4,4,5,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(5,4,10,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(6,4,9,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(8,4,6,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(9,4,7,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(10,4,8,'2026-04-30 15:53:43','2026-04-30 15:53:43','Activo'),(11,4,4,'2026-04-30 15:58:16','2026-04-30 15:58:16','Activo');
/*!40000 ALTER TABLE `actividadmaterial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actividadreactivo`
--

DROP TABLE IF EXISTS `actividadreactivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividadreactivo` (
  `Id_ActividadReactivo` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Actividad` int(11) NOT NULL,
  `Id_Reactivo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`Id_ActividadReactivo`),
  KEY `Id_Actividad` (`Id_Actividad`),
  KEY `Id_Reactivo` (`Id_Reactivo`),
  CONSTRAINT `actividadreactivo_ibfk_37` FOREIGN KEY (`Id_Actividad`) REFERENCES `actividades` (`Id_Actividad`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `actividadreactivo_ibfk_38` FOREIGN KEY (`Id_Reactivo`) REFERENCES `reactivos` (`Id_Reactivo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividadreactivo`
--

LOCK TABLES `actividadreactivo` WRITE;
/*!40000 ALTER TABLE `actividadreactivo` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividadreactivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada`
--

DROP TABLE IF EXISTS `entrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entrada` (
  `Id_Entrada` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reactivo` int(11) DEFAULT NULL,
  `Lote` varchar(255) DEFAULT NULL,
  `Can_Inicial` int(11) DEFAULT NULL,
  `Can_Salida` int(11) DEFAULT NULL,
  `Uni_Medida` enum('gr','L','mL') DEFAULT NULL,
  `Fec_Vencimiento` datetime DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_Entrada`),
  KEY `Id_Reactivo` (`Id_Reactivo`),
  CONSTRAINT `entrada_ibfk_1` FOREIGN KEY (`Id_Reactivo`) REFERENCES `reactivos` (`Id_Reactivo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada`
--

LOCK TABLES `entrada` WRITE;
/*!40000 ALTER TABLE `entrada` DISABLE KEYS */;
INSERT INTO `entrada` VALUES (1,1,'R12',20,0,'gr','2026-03-18 00:00:00','Activo','2026-03-03 14:19:33','2026-05-25 12:23:46'),(2,1,'R12',20,7,'gr','2026-03-18 00:00:00','Activo','2026-03-03 14:19:44','2026-05-25 12:24:38'),(3,7,'R12',20,0,'gr','2026-03-18 00:00:00','Activo','2026-03-03 14:19:33','2026-05-20 22:57:30'),(4,9,'R22',20,4,'gr','2026-03-18 00:00:00','Activo','2026-03-03 14:19:33','2026-05-20 01:49:44'),(5,6,'R22',20,12,'gr','2026-03-18 00:00:00','Activo','2026-03-03 14:19:33','2026-03-03 14:31:04'),(6,1,'dr13',12,0,'gr','2026-03-03 00:00:00','Activo','2026-03-03 14:56:39','2026-05-20 23:00:20'),(7,12,'dr16',3,2,'gr','2026-03-04 00:00:00','Activo','2026-03-03 22:13:16','2026-05-20 01:49:44');
/*!40000 ALTER TABLE `entrada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo`
--

DROP TABLE IF EXISTS `equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipo` (
  `Id_Equipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `grupo` varchar(255) DEFAULT NULL,
  `linea` varchar(255) DEFAULT NULL,
  `centro_costos` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `img_equipo` text DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL,
  `ficha_tecnica` varchar(255) DEFAULT NULL,
  `no_chapeta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_Equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo`
--

LOCK TABLES `equipo` WRITE;
/*!40000 ALTER TABLE `equipo` DISABLE KEYS */;
INSERT INTO `equipo` VALUES (1,'Autoclave','Asus','Laboratorio de Biotecnologia','Esteriliza materiales, medios de cultivo y utensilios mediante vapor a alta presión y temperatura (1','Sena Empresa','2025-10-06 15:42:32','2026-05-12 14:20:22','[\"1773675193336.png\"]','Activo','1778595622835-1556.pdf',NULL),(2,'Microscopio óptico','Hp','Laboratorio de Biotecnologia','Permite observar tejidos vegetales, estructuras celulares y contaminaciones microbianas. Puede tener','Sena Empresa','2025-10-06 15:45:17','2026-05-07 00:10:48','[\"1773681804376.png\",\"1778112648056-7853.jpeg\"]','Activo',NULL,NULL),(3,'Centrífuga','Apple','Laboratorio de Biotecnologia','Separa componentes celulares o líquidos por densidad mediante rotación rápida (rpm variables según m','Sena Empresa','2025-10-06 15:46:31','2026-05-07 00:18:59','[\"1778113139712-9520.jpeg\"]','Activo',NULL,NULL),(70,'Autoclave','Asus','ccccccccccccc','cccccccccccc','ccccccccccccccc','2026-05-14 13:40:45','2026-05-14 13:40:45',NULL,'Activo',NULL,NULL);
/*!40000 ALTER TABLE `equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especie`
--

DROP TABLE IF EXISTS `especie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `especie` (
  `Id_especie` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_especie` varchar(255) DEFAULT NULL,
  `img_especie` text DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_especie`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especie`
--

LOCK TABLES `especie` WRITE;
/*!40000 ALTER TABLE `especie` DISABLE KEYS */;
INSERT INTO `especie` VALUES (21,'Catalaya','[\"1778112855892-2047.jpeg\",\"1778604073338-9165.png\"]','Activo','2025-11-25 17:16:33','2026-05-12 16:41:13'),(22,'Mango',NULL,'Activo','2025-11-25 17:16:37','2026-03-16 13:33:47'),(23,'Limon',NULL,'Activo','2025-11-25 17:16:41','2026-03-16 13:33:47'),(25,'calabaza',NULL,'Activo','2025-11-25 18:16:15','2025-11-25 18:16:15'),(31,'Kiwi',NULL,'Activo','2025-11-25 18:18:37','2025-11-25 18:18:37'),(47,'Margarita',NULL,'Activo','2025-12-01 12:43:53','2026-03-03 22:14:37'),(48,'Limon',NULL,'Activo','2025-12-16 14:20:13','2025-12-16 14:20:13'),(49,'cristiano',NULL,'Activo','2026-03-04 02:08:02','2026-03-04 02:08:15'),(50,'Mango',NULL,'Activo','2026-03-06 16:26:18','2026-03-06 16:26:18');
/*!40000 ALTER TABLE `especie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados`
--

DROP TABLE IF EXISTS `estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estados` (
  `Id_Estado` int(11) NOT NULL AUTO_INCREMENT,
  `Tip_Estado` varchar(255) NOT NULL,
  PRIMARY KEY (`Id_Estado`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados`
--

LOCK TABLES `estados` WRITE;
/*!40000 ALTER TABLE `estados` DISABLE KEYS */;
INSERT INTO `estados` VALUES (1,'Solicitado'),(2,'Aprobado'),(3,'Rechazado'),(4,'Cancelado'),(5,'En proceso'),(7,'Finalizado');
/*!40000 ALTER TABLE `estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `material` (
  `Id_Material` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Material` varchar(255) DEFAULT NULL,
  `Can_Material` int(11) DEFAULT NULL,
  `img_material` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`Id_Material`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (4,'Caja Petri',7,'[\"1778603856315-9573.png\",\"1778603863242-4465.png\"]','2026-03-02 16:41:41','2026-05-12 16:54:42','Activo'),(5,'Tubo de ensayo',1,NULL,'2026-03-02 16:41:41','2026-05-12 16:55:28','Activo'),(6,'Asa de siembra',0,NULL,'2026-03-02 16:41:41','2026-03-02 16:41:41','Activo'),(7,'Pipetas automáticas',0,NULL,'2026-03-02 16:41:41','2026-03-02 16:41:41','Activo'),(8,'Pipetas puntas estér',0,NULL,'2026-03-02 16:41:41','2026-03-02 16:41:41','Activo'),(9,'Viales criogénicos',0,NULL,'2026-03-02 16:41:41','2026-03-02 16:41:41','Activo'),(10,'Frascos erlenmeyer ',0,NULL,'2026-03-02 16:41:41','2026-03-02 16:41:41','Activo');
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientoreactivo`
--

DROP TABLE IF EXISTS `movimientoreactivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimientoreactivo` (
  `Id_Movimiento` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Entrada` int(11) NOT NULL,
  `Id_Reserva` int(11) DEFAULT NULL,
  `Tipo` enum('Entrada','Salida','Devolución','Ajuste') NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Fecha` datetime DEFAULT NULL,
  `Detalle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_Movimiento`),
  KEY `Id_Entrada` (`Id_Entrada`),
  KEY `Id_Reserva` (`Id_Reserva`),
  CONSTRAINT `movimientoreactivo_ibfk_13` FOREIGN KEY (`Id_Entrada`) REFERENCES `entrada` (`Id_Entrada`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `movimientoreactivo_ibfk_14` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientoreactivo`
--

LOCK TABLES `movimientoreactivo` WRITE;
/*!40000 ALTER TABLE `movimientoreactivo` DISABLE KEYS */;
INSERT INTO `movimientoreactivo` VALUES (3,3,58,'Salida',12,'2026-05-20 01:48:25','Descuento por Reserva #58'),(4,4,58,'Salida',6,'2026-05-20 01:48:25','Descuento por Reserva #58'),(5,7,58,'Salida',3,'2026-05-20 01:48:25','Descuento por Reserva #58'),(6,3,58,'Devolución',7,'2026-05-20 01:49:44','Devolución de reactivo no utilizado por finalización de reserva'),(7,4,58,'Devolución',4,'2026-05-20 01:49:44','Devolución de reactivo no utilizado por finalización de reserva'),(8,7,58,'Devolución',2,'2026-05-20 01:49:44','Devolución de reactivo no utilizado por finalización de reserva'),(9,3,59,'Salida',7,'2026-05-20 22:57:30','Descuento por Reserva #59'),(10,6,59,'Salida',10,'2026-05-20 22:57:30','Descuento por Reserva #59'),(11,6,60,'Salida',4,'2026-05-20 23:00:20','Descuento por Reserva #60'),(12,1,60,'Salida',2,'2026-05-20 23:00:20','Descuento por Reserva #60'),(13,2,60,'Devolución',3,'2026-05-20 23:00:51','Devolución de reactivo no utilizado por finalización de reserva'),(14,1,61,'Salida',10,'2026-05-25 12:23:46','Descuento por Reserva #61'),(15,2,61,'Salida',15,'2026-05-25 12:23:46','Descuento por Reserva #61'),(16,2,61,'Devolución',7,'2026-05-25 12:24:38','Devolución de reactivo no utilizado por finalización de reserva');
/*!40000 ALTER TABLE `movimientoreactivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practica`
--

DROP TABLE IF EXISTS `practica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `practica` (
  `Id_Practica` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_Practica`),
  KEY `Id_Reserva` (`Id_Reserva`),
  CONSTRAINT `practica_ibfk_1` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practica`
--

LOCK TABLES `practica` WRITE;
/*!40000 ALTER TABLE `practica` DISABLE KEYS */;
/*!40000 ALTER TABLE `practica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produccion`
--

DROP TABLE IF EXISTS `produccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produccion` (
  `Id_produccion` int(11) NOT NULL AUTO_INCREMENT,
  `Tip_produccion` enum('Practica','Propia','Externa') DEFAULT NULL,
  `Fec_produccion` datetime DEFAULT NULL,
  `Lote` varchar(255) DEFAULT NULL,
  `Id_especie` int(11) NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_produccion`),
  KEY `Id_especie` (`Id_especie`),
  CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`Id_especie`) REFERENCES `especie` (`Id_especie`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produccion`
--

LOCK TABLES `produccion` WRITE;
/*!40000 ALTER TABLE `produccion` DISABLE KEYS */;
INSERT INTO `produccion` VALUES (1,'Practica','2026-03-19 00:00:00','R12',25,'Activo','2026-02-05 13:07:25','2026-05-06 22:21:05'),(2,'Propia','2026-03-10 00:00:00','dr1',21,'Activo','2026-03-06 16:27:22','2026-05-06 22:21:12');
/*!40000 ALTER TABLE `produccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reactivos`
--

DROP TABLE IF EXISTS `reactivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reactivos` (
  `Id_Reactivo` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_reactivo` varchar(255) DEFAULT NULL,
  `Nomenclatura` varchar(255) DEFAULT NULL,
  `Presentacion` varchar(255) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Ficha_tecnica` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_Reactivo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactivos`
--

LOCK TABLES `reactivos` WRITE;
/*!40000 ALTER TABLE `reactivos` DISABLE KEYS */;
INSERT INTO `reactivos` VALUES (2,'Sodio','Na','Tubo de ensayo','Activo','2026-02-24 20:03:12','2026-05-20 02:45:56',NULL);
/*!40000 ALTER TABLE `reactivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reserva` (
  `Id_Reserva` int(10) NOT NULL AUTO_INCREMENT,
  `Tip_Reserva` varchar(255) NOT NULL,
  `Nom_Solicitante` varchar(255) NOT NULL,
  `Doc_Solicitante` varchar(255) NOT NULL,
  `Tel_Solicitante` varchar(255) NOT NULL,
  `Cor_Solicitante` varchar(255) NOT NULL,
  `Can_Aprendices` int(11) NOT NULL,
  `Fec_Reserva` date NOT NULL,
  `Hor_Reserva` time NOT NULL,
  `Num_Ficha` varchar(255) NOT NULL,
  `Booleano` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_Reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (31,'Practica','vtutfvytvf','5166541','841654','vanegaskevinalexander@gmail.com',15,'0544-08-07','07:42:00','31651','Activo','2026-04-08 21:40:43','2026-04-12 14:06:20'),(32,'Practica','pepe','68461651','6516164','ydguyg@gmail.com',0,'2026-04-24','14:57:00','3161','Activo','2026-04-11 19:58:19','2026-04-12 19:27:04'),(33,'Practica','fivisdbchy','46494949','484894894','vanegaskevinalexander@gmail.com',7,'2026-04-18','15:21:00','14498696','Activo','2026-04-11 20:21:57','2026-04-12 14:14:42'),(35,'Visita','ihiyby','4156515','51614','vanegaskevinalexander@gmail.com',65,'2026-04-17','08:34:00','5465','Activo','2026-04-12 13:34:27','2026-04-12 14:36:36'),(36,'Practica','vgyyuvgvigy','515514','4986544','vanegaskevinalexander@gmail.com',521,'2026-05-01','09:00:00','4684','Activo','2026-04-12 14:01:04','2026-04-14 14:41:58'),(40,'Visita','Alexander Vanegas Cortes','90132096','3142240193','Alex@hotmail.com',20,'2026-04-16','12:37:00','3140221','Activo','2026-04-12 17:42:46','2026-04-19 15:46:10'),(41,'Visita','kkkkkk','8565458','85449654','vanegaskevinalexander@gmail.com',41,'2026-04-25','14:21:00','854','Activo','2026-04-12 19:21:39','2026-04-14 14:17:44'),(42,'Visita','Anyul Cortes','1564115','5164184','vanegaskevinalexander@gmail.com',20,'2026-04-16','09:37:00','3140221','Inactivo','2026-04-14 14:37:51','2026-04-14 14:38:54'),(43,'Visita','Andrade','15185418','5116841','vanegaskevinalexander@gmail.com',20,'2026-04-24','09:42:00','3140221','Inactivo','2026-04-14 14:42:27','2026-04-14 14:43:56'),(44,'Visita','Messi Ronaldo','51647','3484854','vanegaskevinalexander@gmail.com',14,'2026-04-21','09:56:00','3140221','Inactivo','2026-04-14 14:56:11','2026-04-14 14:56:32'),(45,'Visita','pepe','641541','1515115','vanegaskevinalexander@gmail.com',14,'2026-04-27','09:57:00','3140221','Inactivo','2026-04-14 14:57:55','2026-04-14 14:58:20'),(46,'Practica','Kevin Alexander Vanegas Cortes','1105680376','3205925734','vanegaskevinalexander@gmail.com',19,'2026-04-22','12:05:00','3140221','Activo','2026-04-19 17:05:09','2026-05-12 13:35:33'),(47,'Visita','Juan Emilio Perez','1496441','4167541','vanegaskevinalexander@gmail.com',14,'2026-04-24','12:51:00','3140221','Inactivo','2026-04-19 17:51:21','2026-05-12 14:31:34'),(48,'Visita','Mellado','123456789','987654321','mellado@hotmail.com',20,'2026-04-22','13:00:00','3140221','Activo','2026-04-19 18:48:04','2026-04-27 14:34:44'),(49,'Practica','Herik ','2147483647','3142466100','Ljhah@gmail.com',19,'2026-04-30','07:30:00','342567','Activo','2026-04-20 16:12:29','2026-04-20 19:37:00'),(50,'Visita','camilo','1111111111','3142466100','camilo@gmail.com',20,'2026-04-30','14:40:00','3140221','Inactivo','2026-04-20 19:38:08','2026-05-12 13:26:29'),(51,'Visita','Cristian','515118','5949847','vanegaskevinalexander@gmail.com',8,'2026-05-03','14:00:00','354216','Inactivo','2026-04-21 12:56:32','2026-04-21 13:31:06'),(52,'Practica','Andres','1006003974','','andres@gmail.com',16,'2026-06-23','08:54:00','3140221','Inactivo','2026-04-27 13:54:27','2026-05-12 13:38:54'),(53,'Practica','Joao','1108564814','32131','sierra@gmail.com',12,'2026-04-01','00:30:00','0','Inactivo','2026-04-27 15:24:46','2026-05-12 14:41:09'),(54,'Practica','Camilo','123456789','3108879202','Camilo@gmail.com',20,'2026-10-21','08:58:00','2147483647','Inactivo','2026-05-12 12:58:10','2026-05-12 13:02:58'),(55,'Practica','Andres','1006003974','3143877770','andres@gmail.com',15,'2027-01-20','12:00:00','2222222','Activo','2026-05-12 15:16:41','2026-05-14 14:11:57'),(56,'Practica','Andres','1006003974','3143877770','andres@gmail.com',15,'2026-10-19','09:28:00','55555555','Activo','2026-05-14 14:28:39','2026-05-14 14:28:39'),(57,'Practica','Andres','1006003974','3143877770','andres@gmail.com',10,'2026-12-15','10:00:00','1234567','Activo','2026-05-19 19:38:29','2026-05-19 19:38:29'),(58,'Practica','Julian','1108932187','3142466100','julian@gmail.com',11,'2028-06-07','08:48:00','11111111111','Inactivo','2026-05-20 01:48:25','2026-05-20 01:49:44'),(59,'Practica','Julian','1108932187','3142466100','julian@gmail.com',12,'2030-09-20','17:57:00','1111111111111','Inactivo','2026-05-20 22:57:30','2026-05-20 22:58:08'),(60,'Practica','Julian','1108932187','3142466100','julian@gmail.com',12,'2030-07-20','18:00:00','777777777','Inactivo','2026-05-20 23:00:20','2026-05-20 23:00:51'),(61,'Practica','Julian','1108932187','3142466100','julian@gmail.com',20,'2034-11-25','07:23:00','1111111111','Inactivo','2026-05-25 12:23:46','2026-05-25 12:24:38');
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservaactividad`
--

DROP TABLE IF EXISTS `reservaactividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservaactividad` (
  `Id_ReservaActividad` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Id_Actividad` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_ReservaActividad`),
  KEY `Id_Reserva` (`Id_Reserva`),
  KEY `Id_Actividad` (`Id_Actividad`),
  CONSTRAINT `reservaactividad_ibfk_11` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reservaactividad_ibfk_12` FOREIGN KEY (`Id_Actividad`) REFERENCES `actividades` (`Id_Actividad`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservaactividad`
--

LOCK TABLES `reservaactividad` WRITE;
/*!40000 ALTER TABLE `reservaactividad` DISABLE KEYS */;
INSERT INTO `reservaactividad` VALUES (5,31,4,'2026-04-08 21:40:43','2026-04-08 21:40:43'),(6,32,4,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(7,33,4,'2026-04-11 20:21:57','2026-04-11 20:21:57'),(8,33,5,'2026-04-11 20:21:57','2026-04-11 20:21:57'),(10,36,5,'2026-04-12 14:01:04','2026-04-12 14:01:04'),(20,40,4,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(21,40,5,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(22,40,6,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(23,46,4,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(24,46,5,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(25,49,4,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(26,49,5,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(27,51,4,'2026-04-21 12:56:32','2026-04-21 12:56:32'),(28,52,4,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(29,53,4,'2026-04-27 15:24:46','2026-04-27 15:24:46'),(30,54,4,'2026-05-12 12:58:10','2026-05-12 12:58:10'),(33,55,4,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(34,56,4,'2026-05-14 14:28:39','2026-05-14 14:28:39'),(35,57,5,'2026-05-19 19:38:29','2026-05-19 19:38:29'),(36,57,4,'2026-05-19 19:38:29','2026-05-19 19:38:29'),(37,58,4,'2026-05-20 01:48:25','2026-05-20 01:48:25'),(38,59,4,'2026-05-20 22:57:30','2026-05-20 22:57:30'),(39,60,4,'2026-05-20 23:00:20','2026-05-20 23:00:20'),(40,61,4,'2026-05-25 12:23:46','2026-05-25 12:23:46');
/*!40000 ALTER TABLE `reservaactividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservaequipo`
--

DROP TABLE IF EXISTS `reservaequipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservaequipo` (
  `Id_ReservaEquipo` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Id_Equipo` int(11) NOT NULL,
  `Can_Equipos` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_ReservaEquipo`),
  KEY `Id_Reserva` (`Id_Reserva`),
  KEY `Id_Actividad` (`Id_Equipo`),
  KEY `Id_Equipo` (`Id_Equipo`),
  CONSTRAINT `reservaequipo_ibfk_11` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reservaequipo_ibfk_12` FOREIGN KEY (`Id_Equipo`) REFERENCES `equipo` (`Id_Equipo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservaequipo`
--

LOCK TABLES `reservaequipo` WRITE;
/*!40000 ALTER TABLE `reservaequipo` DISABLE KEYS */;
INSERT INTO `reservaequipo` VALUES (7,31,66,2,'2026-04-08 21:40:43','2026-04-08 21:40:43'),(8,32,66,2,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(9,32,67,1,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(10,32,69,1,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(15,40,66,5,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(16,46,1,1,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(17,46,2,2,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(18,46,3,1,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(19,49,1,1,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(20,49,2,1,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(21,51,1,1,'2026-04-21 12:56:32','2026-04-21 12:56:32'),(22,52,1,1,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(23,52,2,1,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(24,52,3,1,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(31,55,3,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(32,55,59,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(33,55,60,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(34,61,2,1,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(35,61,3,1,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(36,61,59,1,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(37,61,60,1,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(38,61,1,1,'2026-05-25 12:23:46','2026-05-25 12:23:46');
/*!40000 ALTER TABLE `reservaequipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservaestado`
--

DROP TABLE IF EXISTS `reservaestado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservaestado` (
  `Id_ReservaEstado` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Id_Estado` int(11) NOT NULL,
  `Mot_RecCan` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_ReservaEstado`),
  KEY `Id_Reserva` (`Id_Reserva`),
  KEY `Id_Estado` (`Id_Estado`),
  CONSTRAINT `reservaestado_ibfk_11` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reservaestado_ibfk_12` FOREIGN KEY (`Id_Estado`) REFERENCES `estados` (`Id_Estado`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservaestado`
--

LOCK TABLES `reservaestado` WRITE;
/*!40000 ALTER TABLE `reservaestado` DISABLE KEYS */;
INSERT INTO `reservaestado` VALUES (71,31,7,'','2026-04-12 14:06:20','2026-04-12 14:06:20'),(72,32,2,'','2026-04-12 14:08:49','2026-04-12 14:08:49'),(73,36,2,'','2026-04-12 14:09:15','2026-04-12 14:09:15'),(74,33,2,'','2026-04-12 14:13:52','2026-04-12 14:13:52'),(75,33,5,'','2026-04-12 14:14:20','2026-04-12 14:14:20'),(76,33,7,'','2026-04-12 14:14:42','2026-04-12 14:14:42'),(77,35,2,'','2026-04-12 14:28:59','2026-04-12 14:28:59'),(78,35,4,'','2026-04-12 14:29:28','2026-04-12 14:29:28'),(79,32,5,'','2026-04-12 14:31:17','2026-04-12 14:31:17'),(80,36,5,'','2026-04-12 14:31:45','2026-04-12 14:31:45'),(81,40,1,NULL,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(82,40,3,'Este día estaremos haciendo inventario del laboratorio','2026-04-12 17:44:40','2026-04-12 17:44:40'),(83,36,7,NULL,'2026-04-12 18:18:14','2026-04-12 18:18:14'),(84,41,1,NULL,'2026-04-12 19:21:39','2026-04-12 19:21:39'),(85,41,2,NULL,'2026-04-12 19:21:57','2026-04-12 19:21:57'),(86,41,4,'Se me dio la gana','2026-04-12 19:22:13','2026-04-12 19:22:13'),(87,32,7,NULL,'2026-04-12 19:27:04','2026-04-12 19:27:04'),(88,42,1,NULL,'2026-04-14 14:37:51','2026-04-14 14:37:51'),(89,42,2,NULL,'2026-04-14 14:38:13','2026-04-14 14:38:13'),(90,42,4,'Por motivos de lluvia el laboratorio no esta en condiciones para ser usado','2026-04-14 14:38:54','2026-04-14 14:38:54'),(91,43,1,NULL,'2026-04-14 14:42:27','2026-04-14 14:42:27'),(92,43,3,'El laboratorio no abre ese dia','2026-04-14 14:43:56','2026-04-14 14:43:56'),(93,44,1,NULL,'2026-04-14 14:56:11','2026-04-14 14:56:11'),(94,44,2,NULL,'2026-04-14 14:56:18','2026-04-14 14:56:18'),(95,44,5,NULL,'2026-04-14 14:56:25','2026-04-14 14:56:25'),(96,44,7,NULL,'2026-04-14 14:56:32','2026-04-14 14:56:32'),(97,45,1,NULL,'2026-04-14 14:57:55','2026-04-14 14:57:55'),(98,45,3,'bhicuieybhcfiuebhd','2026-04-14 14:58:20','2026-04-14 14:58:20'),(99,46,1,NULL,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(100,47,1,NULL,'2026-04-19 17:51:21','2026-04-19 17:51:21'),(101,48,1,NULL,'2026-04-19 18:48:04','2026-04-19 18:48:04'),(102,49,1,NULL,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(103,49,2,NULL,'2026-04-20 16:15:01','2026-04-20 16:15:01'),(104,49,5,NULL,'2026-04-20 16:16:57','2026-04-20 16:16:57'),(105,50,1,NULL,'2026-04-20 19:38:08','2026-04-20 19:38:08'),(106,51,1,NULL,'2026-04-21 12:56:32','2026-04-21 12:56:32'),(107,51,3,'Por que si','2026-04-21 12:56:59','2026-04-21 12:56:59'),(108,52,1,NULL,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(109,53,1,NULL,'2026-04-27 15:24:46','2026-04-27 15:24:46'),(110,53,2,NULL,'2026-04-27 15:25:53','2026-04-27 15:25:53'),(111,54,1,NULL,'2026-05-12 12:58:10','2026-05-12 12:58:10'),(112,54,2,NULL,'2026-05-12 13:02:11','2026-05-12 13:02:11'),(113,54,5,NULL,'2026-05-12 13:02:19','2026-05-12 13:02:19'),(114,54,7,NULL,'2026-05-12 13:02:58','2026-05-12 13:02:58'),(115,53,5,NULL,'2026-05-12 13:25:42','2026-05-12 13:25:42'),(116,50,3,'porque si','2026-05-12 13:26:29','2026-05-12 13:26:29'),(117,52,3,'esta en mantenimiento el laboratorio','2026-05-12 13:38:54','2026-05-12 13:38:54'),(118,47,3,'no se','2026-05-12 14:31:34','2026-05-12 14:31:34'),(119,53,7,NULL,'2026-05-12 14:41:09','2026-05-12 14:41:09'),(120,55,1,NULL,'2026-05-12 15:16:41','2026-05-12 15:16:41'),(121,55,2,NULL,'2026-05-12 15:17:36','2026-05-12 15:17:36'),(122,55,5,NULL,'2026-05-12 15:17:54','2026-05-12 15:17:54'),(123,56,1,NULL,'2026-05-14 14:28:39','2026-05-14 14:28:39'),(124,57,1,NULL,'2026-05-19 19:38:29','2026-05-19 19:38:29'),(125,58,1,NULL,'2026-05-20 01:48:25','2026-05-20 01:48:25'),(126,58,2,NULL,'2026-05-20 01:49:27','2026-05-20 01:49:27'),(127,58,5,NULL,'2026-05-20 01:49:32','2026-05-20 01:49:32'),(128,58,7,NULL,'2026-05-20 01:49:44','2026-05-20 01:49:44'),(129,59,1,NULL,'2026-05-20 22:57:30','2026-05-20 22:57:30'),(130,59,2,NULL,'2026-05-20 22:58:00','2026-05-20 22:58:00'),(131,59,5,NULL,'2026-05-20 22:58:04','2026-05-20 22:58:04'),(132,59,7,NULL,'2026-05-20 22:58:08','2026-05-20 22:58:08'),(133,60,1,NULL,'2026-05-20 23:00:20','2026-05-20 23:00:20'),(134,60,2,NULL,'2026-05-20 23:00:26','2026-05-20 23:00:26'),(135,60,5,NULL,'2026-05-20 23:00:29','2026-05-20 23:00:29'),(136,60,7,NULL,'2026-05-20 23:00:51','2026-05-20 23:00:51'),(137,61,1,NULL,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(138,61,2,NULL,'2026-05-25 12:24:13','2026-05-25 12:24:13'),(139,61,5,NULL,'2026-05-25 12:24:22','2026-05-25 12:24:22'),(140,61,7,NULL,'2026-05-25 12:24:37','2026-05-25 12:24:37');
/*!40000 ALTER TABLE `reservaestado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservamaterial`
--

DROP TABLE IF EXISTS `reservamaterial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservamaterial` (
  `Id_ReservaMaterial` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Id_Material` int(11) NOT NULL,
  `Can_Materiales` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_ReservaMaterial`),
  KEY `Id_Reserva` (`Id_Reserva`),
  KEY `Id_Material` (`Id_Material`),
  CONSTRAINT `reservamaterial_ibfk_11` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reservamaterial_ibfk_12` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservamaterial`
--

LOCK TABLES `reservamaterial` WRITE;
/*!40000 ALTER TABLE `reservamaterial` DISABLE KEYS */;
INSERT INTO `reservamaterial` VALUES (7,31,4,1,'2026-04-08 21:40:43','2026-04-08 21:40:43'),(8,32,6,1,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(9,32,5,2,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(10,32,4,1,'2026-04-11 19:58:19','2026-04-11 19:58:19'),(15,40,4,5,'2026-04-12 17:42:46','2026-04-12 17:42:46'),(16,46,4,3,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(17,46,5,1,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(18,46,6,1,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(19,49,4,5,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(20,49,5,1,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(21,51,5,2,'2026-04-21 12:56:32','2026-04-21 12:56:32'),(22,52,6,1,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(31,55,4,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(32,55,5,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(33,55,6,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(34,55,7,1,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(35,61,4,1,'2026-05-25 12:23:46','2026-05-25 12:23:46'),(36,61,5,1,'2026-05-25 12:23:46','2026-05-25 12:23:46');
/*!40000 ALTER TABLE `reservamaterial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservareactivo`
--

DROP TABLE IF EXISTS `reservareactivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservareactivo` (
  `Id_ReservaReactivo` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Reserva` int(11) NOT NULL,
  `Id_Reactivo` int(11) NOT NULL,
  `Can_Reactivo` int(11) NOT NULL,
  `Reac_Utilizados` int(11) DEFAULT 0,
  `Reac_Devueltos` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_ReservaReactivo`),
  KEY `Id_Reserva` (`Id_Reserva`),
  KEY `Id_Reactivo` (`Id_Reactivo`),
  CONSTRAINT `reservareactivo_ibfk_11` FOREIGN KEY (`Id_Reserva`) REFERENCES `reserva` (`Id_Reserva`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reservareactivo_ibfk_12` FOREIGN KEY (`Id_Reactivo`) REFERENCES `reactivos` (`Id_Reactivo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservareactivo`
--

LOCK TABLES `reservareactivo` WRITE;
/*!40000 ALTER TABLE `reservareactivo` DISABLE KEYS */;
INSERT INTO `reservareactivo` VALUES (25,46,2,4,0,0,'2026-04-19 17:05:09','2026-04-19 17:05:09'),(26,49,2,1,0,0,'2026-04-20 16:12:29','2026-04-20 16:12:29'),(27,51,2,1,0,0,'2026-04-21 12:56:32','2026-04-21 12:56:32'),(28,52,9,1,0,0,'2026-04-27 13:54:27','2026-04-27 13:54:27'),(29,54,7,15,0,0,'2026-05-12 12:58:10','2026-05-12 12:58:10'),(30,54,9,12,0,0,'2026-05-12 12:58:10','2026-05-12 12:58:10'),(31,54,12,10,0,0,'2026-05-12 12:58:10','2026-05-12 12:58:10'),(34,55,7,1,0,0,'2026-05-14 14:11:58','2026-05-14 14:11:58'),(35,56,7,1,0,0,'2026-05-14 14:28:39','2026-05-14 14:28:39'),(36,56,9,1,0,0,'2026-05-14 14:28:39','2026-05-14 14:28:39'),(37,56,12,1,0,0,'2026-05-14 14:28:39','2026-05-14 14:28:39'),(38,57,9,6,0,0,'2026-05-19 19:38:29','2026-05-19 19:38:29'),(39,58,7,5,0,0,'2026-05-20 01:48:25','2026-05-20 01:49:44'),(40,58,9,2,0,0,'2026-05-20 01:48:25','2026-05-20 01:49:44'),(41,58,12,1,0,0,'2026-05-20 01:48:25','2026-05-20 01:49:44'),(42,59,7,7,7,0,'2026-05-20 22:57:30','2026-05-20 22:58:08'),(43,59,1,10,10,0,'2026-05-20 22:57:30','2026-05-20 22:58:08'),(44,60,1,6,3,3,'2026-05-20 23:00:20','2026-05-20 23:00:51'),(45,61,1,25,18,7,'2026-05-25 12:23:46','2026-05-25 12:24:38');
/*!40000 ALTER TABLE `reservareactivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sup_plantas`
--

DROP TABLE IF EXISTS `sup_plantas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sup_plantas` (
  `Id_supervision` int(11) NOT NULL AUTO_INCREMENT,
  `Id_produccion` int(11) NOT NULL,
  `Num_lote` enum('1','2','3') DEFAULT NULL,
  `Med_Cultivo` enum('MyS','MyS carbon') DEFAULT NULL,
  `Met_Propagacion` enum('Siembra','Repique') DEFAULT NULL,
  `Fc_Iniciales` int(11) DEFAULT NULL,
  `Fra_Contaminados` int(11) DEFAULT NULL,
  `Fc_Bacterias` int(11) DEFAULT NULL,
  `Fc_Hongos` int(11) DEFAULT NULL,
  `Fs_Desarrollo` int(11) DEFAULT NULL,
  `Fra_Desarrollo` int(11) DEFAULT NULL,
  `Fd_BR` int(11) DEFAULT NULL,
  `Fd_RA` int(11) DEFAULT NULL,
  `Fd_CA` int(11) DEFAULT NULL,
  `Fd_MOR` int(11) DEFAULT NULL,
  `Fd_GER` int(11) DEFAULT NULL,
  `Num_endurecimiento` int(11) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id_supervision`),
  KEY `Id_produccion` (`Id_produccion`),
  CONSTRAINT `fk_sup_plantas_produccion` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_1` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_10` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_11` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_12` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_13` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_14` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_15` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_16` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_17` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_18` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_19` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_2` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_3` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_4` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_5` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_6` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_7` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_8` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sup_plantas_ibfk_9` FOREIGN KEY (`Id_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sup_plantas`
--

LOCK TABLES `sup_plantas` WRITE;
/*!40000 ALTER TABLE `sup_plantas` DISABLE KEYS */;
INSERT INTO `sup_plantas` VALUES (1,1,'3','MyS','Siembra',2,0,2,3,0,2,5,13,4,1,1,12,'Activo','2026-02-05 19:59:26','2026-03-16 19:38:40'),(2,1,'2','MyS','Siembra',2,0,2,3,0,2,5,13,4,1,1,12,'Activo','2026-02-05 19:59:36','2026-03-16 14:13:46'),(3,1,'3','MyS','Repique',6,1,2,0,2,0,1,1,1,1,1,13,'Activo','2026-03-03 23:10:05','2026-03-04 02:16:16'),(4,2,'2','MyS','Siembra',10,1,0,0,0,0,3,0,0,0,0,4,'Activo','2026-03-06 16:30:00','2026-03-06 16:30:00'),(5,2,'2','MyS','Siembra',10,1,0,0,0,0,3,0,4,3,0,4,'Activo','2026-03-06 16:30:00','2026-03-16 19:36:21');
/*!40000 ALTER TABLE `sup_plantas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `uuid` varchar(100) NOT NULL,
  `documento` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `rol` enum('administrador','solicitante','pasante','gestor','instructor') DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL,
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('c8effced-54ea-49b1-bf18-6db4160c41d0',1006003974,'Andres','andres@gmail.com','$2b$10$dXmXtKWB5ZQNVq6/0V9mqOZ4spytwZg6JkwQuYvE74CJXyjbth4P.','3143877770','2026-04-27 12:34:54','2026-05-19 19:29:47',NULL,'solicitante','Activo'),('35337681-8bcc-47dd-8cf3-cb2f0e6b1b06',123456789,'Camilo','Camilo@gmail.com','$2b$10$KQZbTNOZgMcm6tzZpKU67eQdbHbsjJKGnxDg7rU2hNKMGTdIXF7cO','3108879202','2026-02-18 17:50:38','2026-04-30 11:56:29',NULL,'administrador','Activo'),('46ee8371-23f2-4fff-ae88-bbbd930967b6',1108564815,'Juan','juan@gmail.com','$2b$10$40VU6Qw3vl.QpLlhvVBzr.FzYotga/5Yn12bmwXu4pL0UiARdrYte',NULL,'2026-03-10 13:10:00','2026-03-10 13:10:00',NULL,'administrador','Activo'),('b1245c68-e2cd-4c6b-a05d-84cfe097d5a7',1104935181,'Felipe','juanfelipe010504@gmail.com','$2b$10$R/slilXNlVuYoUdmGp4ZHOH1h4cQnFBWX8zCNBohvKoRlizLF10l6',NULL,'2026-04-23 15:27:22','2026-06-04 19:19:07','355e9b9b68474fcdbedd4053494f15a4','administrador','Activo'),('c087b62b-f8bd-4875-85e9-8850669ced3c',1108932187,'Julian','julian@gmail.com','$2b$10$I881/pwtRVw.69.M7wruJuUb/wnT0oT2gUT00rHKEQpuIi.jj8Qku','3142466100','2026-02-18 17:22:32','2026-05-20 22:37:24',NULL,'administrador','Activo'),('1fd7b22f-f849-4f08-8bc8-b13f5c296509',1234567899,'Mellado','julianmellado9916@gmail.com','$2b$10$X5FjgQREBU0L25qO4xO99OEs9FuknlDWJpofTmbdeXDaGeehskCeG','1234567888','2026-06-04 16:43:04','2026-06-04 19:14:35','193ed6ed467947aaafc38f4feb0a4f3a','solicitante','Activo'),('7481ff32-9dc7-406b-a38a-06d8db794f67',1105680376,'Kevin','kevin@gmail.com','$2b$10$qMgp861JAy.lSlr8ktF/rOVbhId0PfosFU2l0xNyTfhbjQBpEm5dy',NULL,'2026-04-14 00:38:13','2026-04-14 00:38:13',NULL,'administrador','Activo'),('0b56f7a9-6055-4ac1-8201-589d8a63bfef',2147483647,'Juana','milito@gmail.com','$2b$10$I2xNt7ABXFIUQeYQTx/pduU8azpa./T6kdsvzJVHvn5Q1qttVKWo2','314214124134131','2026-04-30 16:57:20','2026-04-30 16:57:20',NULL,'instructor','Activo'),('dfaa558b-2c81-4546-abdc-62da07831e2b',1108564814,'Joao','sierra@gmail.com','$2b$10$XO4i8FqsFGkF53pKpDYiKejqCKdH4Vz9wfjfbuXxQDOCopVK.gBP.',NULL,'2026-04-27 15:20:37','2026-04-27 15:20:37',NULL,'solicitante','Activo'),('c6e4b431-7965-480f-8997-9aa20fd0df0e',111111,'xd','xd@gmail.com','$2b$10$K/OL7T7RzU7Y3TaPOucNQuZKrpmsl5A5J9S9Q.KtudF/hJ.TgPbcO','111111111111111','2026-05-22 12:11:20','2026-05-22 12:11:20',NULL,'solicitante','Activo');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02  8:46:56
