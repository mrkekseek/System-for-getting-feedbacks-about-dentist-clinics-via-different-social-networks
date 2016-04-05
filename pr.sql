/*
SQLyog Ultimate v12.14 (64 bit)
MySQL - 5.5.45 : Database - pr
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`pr` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `pr`;

/*Table structure for table `cron` */

DROP TABLE IF EXISTS `cron`;

CREATE TABLE `cron` (
  `cron_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cron_method` varchar(255) NOT NULL,
  `cron_level` tinyint(4) unsigned NOT NULL,
  `cron_begin` tinyint(4) unsigned NOT NULL,
  `cron_remove` tinyint(4) unsigned NOT NULL,
  `cron_minute` varchar(255) NOT NULL,
  `cron_hour` varchar(255) NOT NULL,
  `cron_day` varchar(255) NOT NULL,
  `cron_week` varchar(255) NOT NULL,
  `cron_month` varchar(255) NOT NULL,
  PRIMARY KEY (`cron_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `cron` */

insert  into `cron`(`cron_id`,`cron_method`,`cron_level`,`cron_begin`,`cron_remove`,`cron_minute`,`cron_hour`,`cron_day`,`cron_week`,`cron_month`) values 
(1,'resend_letters',2,0,0,'1','9','','',''),
(2,'send_mailing',3,0,0,'','','','',''),
(3,'send_other',2,0,0,'','','','',''),
(4,'reminders',1,0,0,'','','','',''),
(5,'generate_invoices',1,0,0,'1','1','','',''),
(6,'onlines',2,0,0,'','','','','');

/*Table structure for table `doctors` */

DROP TABLE IF EXISTS `doctors`;

CREATE TABLE `doctors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(11) unsigned NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `function` varchar(255) NOT NULL,
  `zorgkaart` varchar(255) NOT NULL,
  `date` int(11) NOT NULL,
  `free` tinyint(4) unsigned NOT NULL,
  `short_checked` tinyint(4) unsigned NOT NULL,
  `short` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

/*Data for the table `doctors` */

insert  into `doctors`(`id`,`users_id`,`firstname`,`lastname`,`title`,`function`,`zorgkaart`,`date`,`free`,`short_checked`,`short`) values 
(3,111,'Nick','van den Berg','Dr.','Dokter','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291',1438380515,0,1,'nvdb'),
(18,111,'sdfsdf','sdfsdf','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291',1443978877,1,0,''),
(17,111,'Test','Test','Dr.','','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291',1443975444,1,0,''),
(14,63,'Nick','van den Berg','Dr.','','https://www.zorgkaartnederland.nl/zorgverlener/fysiotherapeut-fysiotherapeut-buytenhek-c-dordrecht-28823',1443801337,1,1,'nick-van-den-berg'),
(15,64,'Nick','van den Berg','heer','','https://www.zorgkaartnederland.nl/zorgverlener/basisarts-basisarts-nickolson-v-m-hoorn-120456',1443874312,1,0,''),
(16,64,'Patricia','Janssen','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/basisarts-basisarts-nickolson-v-m-hoorn-120456',1443889460,0,0,''),
(19,74,'Nick','van den Berg','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032',1444761645,1,0,''),
(20,75,'D.D.A','Diederiks','heer','','https://www.zorgkaartnederland.nl/zorgverlener/',1444764568,1,0,''),
(21,76,'D.D.A','Ricardo','heer','','https://www.zorgkaartnederland.nl/zorgverlener/',1444767738,1,0,''),
(22,77,'dd','tewr','heer','','https://www.zorgkaartnederland.nl/zorgverlener/',1444768350,1,0,''),
(23,80,'Nick','vd berg','Dr.','','https://www.zorgkaartnederland.nl/zorgverlener/',1444769522,1,0,''),
(24,81,'Nick','van den Berg','Drs.','','https://www.zorgkaartnederland.nl/zorgverlener/',1444770056,1,0,''),
(25,82,'test','test','Dr.','','https://www.zorgkaartnederland.nl/zorgverlener/',1444770233,1,0,''),
(26,82,'tr','fds','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/',1444770250,1,0,''),
(27,83,'Test','test','Dr.','','https://www.zorgkaartnederland.nl/zorgverlener/',1444770418,1,0,''),
(39,1,'Doc','Four','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291/waardeer',1455131280,0,0,''),
(38,1,'Doc','Three','heer','','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291/waardeer',1455131234,1,0,''),
(37,1,'Doc','Two','mevrouw','','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-idzahi-k-den-haag-96291/waardeer',1455131197,1,0,''),
(36,1,'Doc','One','heer','','https://www.zorgkaartnederland.nl/zorgverlener/fysiotherapeut-fysiotherapeut-buytenhek-c-dordrecht-28823/waardeer',1455131078,1,0,''),
(62,1,'Doc','Five','Dr.','','',1459518131,0,0,'');

/*Table structure for table `doctors_ids` */

DROP TABLE IF EXISTS `doctors_ids`;

CREATE TABLE `doctors_ids` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `doctors_id` int(10) unsigned NOT NULL,
  `doctors_name` varchar(255) NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `doctors_ids` */

insert  into `doctors_ids`(`rows_id`,`users_id`,`doctors_id`,`doctors_name`) values 
(1,1,36,'doc 1'),
(2,1,37,'doc 2'),
(3,1,38,'doc 3'),
(4,1,39,'doc 4'),
(5,1,62,'doc 5');

/*Table structure for table `doctors_pay` */

DROP TABLE IF EXISTS `doctors_pay`;

CREATE TABLE `doctors_pay` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `doctors_id` int(10) unsigned NOT NULL,
  `users_id` int(10) unsigned NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` double(10,2) unsigned NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

/*Data for the table `doctors_pay` */

insert  into `doctors_pay`(`rows_id`,`doctors_id`,`users_id`,`firstname`,`lastname`,`title`,`amount`) values 
(5,3,1,'Nick','van den Berg','Dr.',1.17),
(6,3,1,'Nick','van den Berg','Dr.',0.82),
(7,16,64,'Patricia','Janssen','mevrouw',2.46);

/*Table structure for table `emails` */

DROP TABLE IF EXISTS `emails`;

CREATE TABLE `emails` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(11) unsigned NOT NULL,
  `subject` text NOT NULL,
  `header` text NOT NULL,
  `gray` text NOT NULL,
  `text1` text NOT NULL,
  `text2` text NOT NULL,
  `promo` text NOT NULL,
  `footer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `emails` */

insert  into `emails`(`id`,`users_id`,`subject`,`header`,`gray`,`text1`,`text2`,`promo`,`footer`) values 
(19,65,'Hoe was uw behandeling bij [NAAM PRAKTIJK]?','[VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT], hoe was uw behandeling?','Betreft: [ONDERWERP VAN E-MAIL]','Beste [VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT],<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven hoe u uw behandeling heeft ervaren. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt..'),
(20,75,'Hoe was uw behandeling bij [NAAM PRAKTIJK]?','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]<br />[AANHEF ZORGVERLENER] [VOORNAAM ZORGVERLENER] [ACHTERNAAM ZORGVERLENER]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt..'),
(17,63,'Hoe was je behandeling bij [NAAM PRAKTIJK]?','Hoe was je behandeling?','Betreft: [ONDERWERP VAN E-MAIL]','Beste [VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT],<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 0 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven hoe u uw behandeling heeft ervaren. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een BRAUN Elektrische Tandenborstel t.w.v. €39,95!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt..'),
(18,64,'Hoe was uw behandeling?','[VOORNAAM PATIËNT], hoe was je behandeling?','Betreft: [ONDERWERP VAN E-MAIL]','Beste [VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT],<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 0 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven hoe u uw behandeling heeft ervaren. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt..'),
(16,61,'Hoe was uw behandeling bij Topvorm Fysiotherapie?','[VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT], hoe was uw behandeling?','Betreft: [ONDERWERP VAN E-MAIL]','Beste [VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT],<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen. Op een schaal van 0 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven hoe u uw behandeling heeft ervaren. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[VOORNAAM ZORGVERLENER]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt..'),
(13,1,'[VOORNAAM PATIËNT] Hoe was uw behandeling bij Tandheelkunde Oss','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!12312313','U ontvangt deze e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Het verzoek tot deelname aan dit is een eenmalige e-mail volgend op uw behandeling.<br />Deze e-mailuitnodiging wordt verzorgd door <a href=\'http://www.patientenreview.nl/\'>Patiëntenreview</a>.'),
(14,59,'Hoe was uw behandeling bij [AANHEF ZORGVERLENER] [VOORNAAM ZORGVERLENER] [ACHTERNAAM ZORGVERLENER]','[VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT], hoe was uw behandeling?','Betreft [ONDERWERP VAN E-MAIL]','Beste [VOORNAAM PATIËNT] [ACHTERNAAM PATIËNT],<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.','Beweeg met uw muis over het aantal sterretjes hierboven en klik om aan te geven hoe u uw behandeling heeft ervaren. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[AANHEF ZORGVERLENER] [VOORNAAM ZORGVERLENER] [ACHTERNAAM ZORGVERLENER]<br />[NAAM PRAKTIJK]','','U ontvangt deze e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Het verzoek tot deelname aan dit is een eenmalige e-mail volgend op uw behandeling.<br />Deze e-mailuitnodiging wordt verzorgd door <a href=\'http://www.patientenreview.nl/\'>Patiëntenreview</a>.'),
(21,74,'Hoe was uw behandeling bij [NAAM PRAKTIJK]?','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.'),
(22,83,'Hoe was uw behandeling bij [NAAM PRAKTIJK]?','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.'),
(23,84,'Hoe was uw behandeling bij [NAAM PRAKTIJK]?','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.'),
(24,88,'Hoe was uw behandeling?','Hoe was uw behandeling?','Zou u [NAAM PRAKTIJK] aanbevelen?','Geachte heer/mevrouw,<br /><br />U bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.<br /><br />Op een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?','Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.<br /><br />Bedankt voor het delen van uw mening!<br /><br />Met vriendelijke groet,<br /><br />[NAAM PRAKTIJK]','Beoordeel ons en win een ... t.w.v. €..,..!','U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.');

/*Table structure for table `invoices` */

DROP TABLE IF EXISTS `invoices`;

CREATE TABLE `invoices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `base_amount` double(10,2) unsigned NOT NULL,
  `amount` double(10,2) unsigned NOT NULL,
  `file` varchar(4) NOT NULL,
  `half` tinyint(4) unsigned NOT NULL,
  `info` text NOT NULL,
  `date` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

/*Data for the table `invoices` */

insert  into `invoices`(`id`,`users_id`,`name`,`code`,`base_amount`,`amount`,`file`,`half`,`info`,`date`) values 
(15,1,'23-08-2015','201508002',0.00,10.00,'',0,'',1440284461),
(14,1,'21-08-2015','201508001',0.00,10.00,'',0,'',1440111661),
(16,1,'25-08-2015','201508003',0.00,10.00,'',0,'',1440457261),
(17,1,'26-08-2015','201508004',22.92,32.92,'',0,'',1440595998),
(18,1,'28-08-2015','201508005',0.00,10.00,'',0,'',1440716462),
(22,1,'31-08-2015','201508006',450.00,1.91,'',1,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\"}],\"doctors_amount\":60,\"half\":true,\"today\":\"31-08-2015\",\"suspension\":\"04-09-2015\",\"days\":4,\"half_pro\":4.92,\"half_basic\":3.01,\"amount\":1.91}',1441022864),
(23,59,'01-09-2015','201509001',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"01-09-2015\",\"suspension\":\"31-08-2016\",\"days\":365,\"half_pro\":448.77,\"half_basic\":274.25,\"amount\":450}',1441106606),
(28,1,'01-09-2015','201509002',450.00,176.44,'',1,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\",\"short_checked\":\"1\",\"short\":\"d\"}],\"doctors_amount\":60,\"half\":true,\"today\":\"01-09-2015\",\"suspension\":\"04-09-2016\",\"days\":369,\"half_pro\":453.69,\"half_basic\":277.25,\"amount\":176.44}',1441116824),
(34,63,'02-10-2015','201510001',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"16-10-2015\",\"suspension\":\"01-10-2016\",\"days\":350.26747685185,\"half_pro\":430.66,\"half_basic\":263.18,\"amount\":450}',1445009690),
(30,1,'04-09-2015','201509004',450.00,510.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\",\"short_checked\":\"1\",\"short\":\"d\"}],\"doctors_amount\":60,\"half\":false,\"today\":\"15-09-2015\",\"suspension\":\"01-09-2016\",\"days\":351.22685185185,\"half_pro\":431.84,\"half_basic\":263.9,\"amount\":510}',1442334800),
(31,1,'14-09-2015','201509005',275.00,335.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\",\"short_checked\":\"1\",\"short\":\"nvdb\"}],\"doctors_amount\":60,\"half\":false,\"today\":\"14-09-2015\",\"suspension\":\"15-09-2016\",\"days\":-16691.958333333,\"half_pro\":-20522.9,\"half_basic\":-12541.77,\"amount\":335}',1442231358),
(33,1,'15-09-2015','201509006',275.00,335.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\",\"short_checked\":\"1\",\"short\":\"nvdb\"}],\"doctors_amount\":60,\"half\":false,\"today\":\"15-09-2015\",\"suspension\":\"24-11-2016\",\"days\":-16692.958333333,\"half_pro\":-20524.13,\"half_basic\":-12542.52,\"amount\":335}',1442340493),
(35,64,'03-10-2015','201510002',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"15\",\"users_id\":\"64\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/basisarts-basisarts-nickolson-v-m-hoorn-120456\",\"date\":\"1443874312\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"17-10-2015\",\"suspension\":\"02-10-2016\",\"days\":350.53981481481,\"half_pro\":430.99,\"half_basic\":263.38,\"amount\":275}',1445072560),
(36,61,'03-10-2015','201510003',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"04-10-2015\",\"suspension\":\"19-09-2016\",\"days\":350.43681712963,\"half_pro\":430.86,\"half_basic\":263.31,\"amount\":450}',1443958259),
(37,1,'04-10-2015','201510004',450.00,173.56,'',1,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"3\",\"users_id\":\"1\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Dr.\",\"function\":\"Dokter\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1438380515\",\"free\":\"0\",\"short_checked\":\"1\",\"short\":\"nvdb\"},{\"id\":\"17\",\"users_id\":\"1\",\"firstname\":\"Test\",\"lastname\":\"Test\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\",\"date\":\"1443975444\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":true,\"today\":\"04-10-2015\",\"suspension\":\"01-10-2016\",\"days\":363,\"half_pro\":446.31,\"half_basic\":272.75,\"amount\":173.56}',1443978657),
(38,74,'13-10-2015','201510005',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"19\",\"users_id\":\"74\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032\",\"date\":\"1444761645\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"26-10-2015\",\"days\":-1.8194675925926,\"half_pro\":-2.24,\"half_basic\":-1.37,\"amount\":450}',1445971202),
(39,76,'13-10-2015','201510006',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"21\",\"users_id\":\"76\",\"firstname\":\"D.D.A\",\"lastname\":\"Ricardo\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444767738\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"31-01-1970\",\"days\":-16705.890127315,\"half_pro\":-20540.03,\"half_basic\":-12552.24,\"amount\":450}',1445977307),
(43,75,'13-10-2015','201510007',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"20\",\"users_id\":\"75\",\"firstname\":\"D.D.A\",\"lastname\":\"Diederiks\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444764568\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"27-10-2015\",\"days\":-0.84502314814815,\"half_pro\":-1.04,\"half_basic\":-0.63,\"amount\":450}',1445973410),
(46,77,'13-10-2015','201510008',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"22\",\"users_id\":\"77\",\"firstname\":\"dd\",\"lastname\":\"tewr\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444768350\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"31-01-1970\",\"days\":-16705.89849537,\"half_pro\":-20540.04,\"half_basic\":-12552.25,\"amount\":450}',1445978030),
(47,80,'13-10-2015','201510009',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"23\",\"users_id\":\"80\",\"firstname\":\"Nick\",\"lastname\":\"vd berg\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444769522\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"27-10-2015\",\"days\":-0.91016203703704,\"half_pro\":-1.12,\"half_basic\":-0.68,\"amount\":450}',1445979038),
(48,81,'13-10-2015','201510010',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"24\",\"users_id\":\"81\",\"firstname\":\"Nick\",\"lastname\":\"van den Berg\",\"title\":\"Drs.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444770056\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"27-10-2015\",\"days\":-0.91675925925926,\"half_pro\":-1.13,\"half_basic\":-0.69,\"amount\":450}',1445979608),
(49,82,'13-10-2015','201510011',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"25\",\"users_id\":\"82\",\"firstname\":\"test\",\"lastname\":\"test\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444770233\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"},{\"id\":\"26\",\"users_id\":\"82\",\"firstname\":\"tr\",\"lastname\":\"fds\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444770250\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"27-10-2015\",\"days\":-0.91804398148148,\"half_pro\":-1.13,\"half_basic\":-0.69,\"amount\":450}',1445979719),
(50,83,'13-10-2015','201510012',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[{\"id\":\"27\",\"users_id\":\"83\",\"firstname\":\"Test\",\"lastname\":\"test\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/\",\"date\":\"1444770418\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"}],\"doctors_amount\":0,\"half\":false,\"today\":\"27-10-2015\",\"suspension\":\"27-10-2015\",\"days\":-0.91822916666667,\"half_pro\":-1.13,\"half_basic\":-0.69,\"amount\":450}',1445979735),
(51,85,'28-10-2015','201511001',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"01-11-2015\",\"suspension\":\"01-11-2015\",\"days\":-0.76436342592593,\"half_pro\":-0.94,\"half_basic\":-0.57,\"amount\":275}',1446398441),
(52,86,'28-10-2015','201511002',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"11-11-2015\",\"suspension\":\"11-11-2015\",\"days\":-0.52493055555556,\"half_pro\":-0.65,\"half_basic\":-0.39,\"amount\":275}',1447241754),
(53,87,'28-10-2015','201511003',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"11-11-2015\",\"suspension\":\"11-11-2015\",\"days\":-0.52759259259259,\"half_pro\":-0.65,\"half_basic\":-0.4,\"amount\":275}',1447241984),
(54,88,'28-10-2015','201511004',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"11-11-2015\",\"suspension\":\"11-11-2015\",\"days\":-0.52856481481481,\"half_pro\":-0.65,\"half_basic\":-0.4,\"amount\":275}',1447242068),
(55,1,'28-10-2015','201511005',450.00,450.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"04-11-2015\",\"suspension\":\"04-10-2016\",\"days\":334.3428587963,\"half_pro\":411.08,\"half_basic\":251.21,\"amount\":450}',1446644777),
(56,1,'11-11-2015','201511006',275.00,275.00,'',0,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":false,\"today\":\"04-11-2015\",\"suspension\":\"04-11-2016\",\"days\":365.38452546296,\"half_pro\":449.24,\"half_basic\":274.54,\"amount\":275}',1446644777),
(57,1,'30-11-2015','201511007',450.00,162.57,'',1,'{\"base_amount\":275,\"pro_amount\":450,\"doctors\":[],\"doctors_amount\":0,\"half\":true,\"today\":\"30-11-2015\",\"suspension\":\"04-11-2016\",\"days\":340,\"half_pro\":418.03,\"half_basic\":255.46,\"amount\":162.57}',1448887644),
(58,1,'26-12-2015','201512001',0.00,1.99,'',0,'',1451088061),
(61,1,'09-02-2016-D','201602001',0.00,48.52,'',0,'{\"doctors\":{\"id\":\"35\",\"users_id\":\"1\",\"firstname\":\"wert\",\"lastname\":\"sdfg\",\"title\":\"Drs.\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/basisarts-basisarts-nickolson-v-m-hoorn-120456\\/waardeer\",\"date\":\"1455035222\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":48.52}',1455035222),
(62,1,'10-02-2016-D','201602002',0.00,0.00,'',0,'{\"doctors\":{\"id\":\"36\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"One\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/fysiotherapeut-fysiotherapeut-buytenhek-c-dordrecht-28823\\/waardeer\",\"date\":\"1455131078\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":0}',1455131078),
(63,1,'10-02-2016-37','201602003',0.00,0.00,'',0,'{\"doctors\":{\"id\":\"37\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Two\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\\/waardeer\",\"date\":\"1455131197\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":0}',1455131197),
(64,1,'10-02-2016-38','201602004',0.00,0.00,'',0,'{\"doctors\":{\"id\":\"38\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Three\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\\/waardeer\",\"date\":\"1455131234\",\"free\":\"1\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":0}',1455131234),
(65,1,'10-02-2016-39','201602005',0.00,48.36,'',0,'{\"doctors\":{\"id\":\"39\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Four\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/tandarts-idzahi-k-den-haag-96291\\/waardeer\",\"date\":\"1455131280\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":48.36}',1455131280),
(66,1,'18-02-2016-40','201602006',0.00,47.05,'',0,'{\"doctors\":{\"id\":\"40\",\"users_id\":\"1\",\"firstname\":\"wqe\",\"lastname\":\"qwe\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032\\/waardeer\",\"date\":\"1455795448\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":47.05}',1455795448),
(67,1,'01-03-2016-41','201603001',0.00,6.41,'',0,'{\"doctors\":{\"id\":\"41\",\"users_id\":\"1\",\"firstname\":\"s\",\"lastname\":\"er\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"https:\\/\\/www.zorgkaartnederland.nl\\/zorgverlener\\/basisarts-basisarts-nickolson-v-m-hoorn-120456\\/waardeer\",\"date\":\"1456832870\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":6.41}',1456832870),
(68,1,'01-04-2016-42','201604001',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"42\",\"users_id\":\"1\",\"firstname\":\"Test\",\"lastname\":\"New\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459512335\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459512335),
(69,1,'01-04-2016-43','201604002',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"43\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Five\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459512554\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459512554),
(70,1,'01-04-2016-44','201604003',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"44\",\"users_id\":\"1\",\"firstname\":\"123\",\"lastname\":\"123\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513173\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513173),
(71,1,'01-04-2016-45','201604004',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"45\",\"users_id\":\"1\",\"firstname\":\"fsdf\",\"lastname\":\"sdfsdf\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513219\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513219),
(72,1,'01-04-2016-46','201604005',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"46\",\"users_id\":\"1\",\"firstname\":\"cxv\",\"lastname\":\"xcv\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513453\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513453),
(73,1,'01-04-2016-47','201604006',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"47\",\"users_id\":\"1\",\"firstname\":\"sdv\",\"lastname\":\"sdf\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513516\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513516),
(74,1,'01-04-2016-48','201604007',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"48\",\"users_id\":\"1\",\"firstname\":\"sdf\",\"lastname\":\"sdf\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513675\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513675),
(75,1,'01-04-2016-49','201604008',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"49\",\"users_id\":\"1\",\"firstname\":\"erf\",\"lastname\":\"sdf\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513810\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513810),
(76,1,'01-04-2016-50','201604009',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"50\",\"users_id\":\"1\",\"firstname\":\"sdf\",\"lastname\":\"sdf\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459513867\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459513867),
(77,1,'01-04-2016-51','201604010',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"51\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Five\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459514185\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459514185),
(78,1,'01-04-2016-52','201604011',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"52\",\"users_id\":\"1\",\"firstname\":\"zxc\",\"lastname\":\"zxc\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459514453\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459514453),
(79,1,'01-04-2016-53','201604012',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"53\",\"users_id\":\"1\",\"firstname\":\"zxc\",\"lastname\":\"zxc\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459514497\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459514497),
(80,1,'01-04-2016-54','201604013',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"54\",\"users_id\":\"1\",\"firstname\":\"asd\",\"lastname\":\"asd\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459514568\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459514568),
(81,1,'01-04-2016-55','201604014',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"55\",\"users_id\":\"1\",\"firstname\":\"AS\",\"lastname\":\"as\",\"title\":\"mevrouw\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459515032\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459515032),
(82,1,'01-04-2016-56','201604015',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"56\",\"users_id\":\"1\",\"firstname\":\"saasd\",\"lastname\":\"asdasd\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459516277\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459516277),
(83,1,'01-04-2016-57','201604016',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"57\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Five\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459516627\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459516627),
(84,1,'01-04-2016-58','201604017',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"58\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"5\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459516715\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459516715),
(85,1,'01-04-2016-59','201604018',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"59\",\"users_id\":\"1\",\"firstname\":\"dfg\",\"lastname\":\"dfg\",\"title\":\"heer\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459517047\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459517047),
(86,1,'01-04-2016-60','201604019',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"60\",\"users_id\":\"1\",\"firstname\":\"D\",\"lastname\":\"5\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459517220\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459517220),
(87,1,'01-04-2016-61','201604020',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"61\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"5\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459517263\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459517263),
(88,1,'01-04-2016-62','201604021',0.00,1.32,'',0,'{\"doctors\":{\"id\":\"62\",\"users_id\":\"1\",\"firstname\":\"Doc\",\"lastname\":\"Five\",\"title\":\"Dr.\",\"function\":\"\",\"zorgkaart\":\"\",\"date\":\"1459518131\",\"free\":\"0\",\"short_checked\":\"0\",\"short\":\"\"},\"doctors_amount\":60,\"amount\":1.32}',1459518131);

/*Table structure for table `invoices_doctors` */

DROP TABLE IF EXISTS `invoices_doctors`;

CREATE TABLE `invoices_doctors` (
  `rows_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `invoices_id` int(11) unsigned NOT NULL,
  `doctors_id` int(11) unsigned NOT NULL,
  `doctors_title` varchar(255) NOT NULL,
  `doctors_firstname` varchar(255) NOT NULL,
  `doctors_lastname` varchar(255) NOT NULL,
  `doctors_amount` double(10,2) unsigned NOT NULL,
  `doctors_pay` tinyint(4) unsigned NOT NULL,
  `free` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=MyISAM AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

/*Data for the table `invoices_doctors` */

insert  into `invoices_doctors`(`rows_id`,`invoices_id`,`doctors_id`,`doctors_title`,`doctors_firstname`,`doctors_lastname`,`doctors_amount`,`doctors_pay`,`free`) values 
(13,21,3,'Dr.','Nick','van den Berg',60.00,0,0),
(2,14,3,'','Nick','van den Berg',5.00,0,0),
(4,15,3,'','Nick','van den Berg',5.00,0,0),
(12,0,3,'Dr.','Nick','van den Berg',60.00,0,0),
(6,16,3,'','Nick','van den Berg',5.00,0,0),
(8,17,3,'','Nick','van den Berg',5.00,0,0),
(11,0,3,'Dr.','Nick','van den Berg',60.00,0,0),
(10,18,3,'','Nick','van den Berg',5.00,0,0),
(14,22,3,'Dr.','Nick','van den Berg',60.00,0,0),
(15,24,3,'Dr.','Nick','van den Berg',60.00,0,0),
(16,25,3,'Dr.','Nick','van den Berg',60.00,0,0),
(17,26,3,'Dr.','Nick','van den Berg',60.00,0,0),
(18,27,3,'Dr.','Nick','van den Berg',60.00,0,0),
(19,28,3,'Dr.','Nick','van den Berg',60.00,0,0),
(20,30,3,'Dr.','Nick','van den Berg',60.00,0,0),
(21,31,3,'Dr.','Nick','van den Berg',60.00,0,0),
(22,32,3,'Dr.','Nick','van den Berg',60.00,0,0),
(23,33,3,'Dr.','Nick','van den Berg',60.00,0,0),
(24,35,15,'heer','Nick','van den Berg',60.00,0,0),
(25,37,3,'Dr.','Nick','van den Berg',60.00,0,0),
(26,37,17,'Dr.','Test','Test',60.00,0,0),
(27,38,19,'mevrouw','Nick','van den Berg',60.00,0,0),
(28,39,21,'heer','D.D.A','Ricardo',60.00,0,0),
(29,47,23,'Dr.','Nick','vd berg',60.00,0,1),
(30,48,24,'Drs.','Nick','van den Berg',60.00,0,1),
(31,49,25,'Dr.','test','test',60.00,0,1),
(32,49,26,'mevrouw','tr','fds',60.00,0,1),
(33,50,27,'Dr.','Test','test',60.00,0,1),
(39,64,38,'heer','Doc','Three',0.00,1,0),
(38,63,37,'mevrouw','Doc','Two',0.00,1,0),
(37,62,36,'heer','Doc','One',0.00,1,0),
(40,65,39,'mevrouw','Doc','Four',48.36,1,0),
(63,88,62,'Dr.','Doc','Five',1.32,1,0);

/*Table structure for table `letters` */

DROP TABLE IF EXISTS `letters`;

CREATE TABLE `letters` (
  `letters_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `letters_to` varchar(255) NOT NULL,
  `letters_subject` varchar(255) NOT NULL,
  `letters_message` text NOT NULL,
  `letters_from` varchar(255) NOT NULL,
  `letters_from_email` varchar(255) NOT NULL,
  `letters_type` varchar(255) NOT NULL,
  `letters_attach` varchar(255) NOT NULL,
  PRIMARY KEY (`letters_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1418 DEFAULT CHARSET=utf8;

/*Data for the table `letters` */

/*Table structure for table `locations` */

DROP TABLE IF EXISTS `locations`;

CREATE TABLE `locations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `address` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `date` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `locations` */

insert  into `locations`(`id`,`users_id`,`address`,`postcode`,`city`,`date`) values 
(1,1,'123','334455','Kyiv',1459521795);

/*Table structure for table `locations_ids` */

DROP TABLE IF EXISTS `locations_ids`;

CREATE TABLE `locations_ids` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `locations_id` int(10) unsigned NOT NULL,
  `locations_name` varchar(255) NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `locations_ids` */

insert  into `locations_ids`(`rows_id`,`users_id`,`locations_id`,`locations_name`) values 
(1,1,1,'aasds');

/*Table structure for table `notifier_last_rated` */

DROP TABLE IF EXISTS `notifier_last_rated`;

CREATE TABLE `notifier_last_rated` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating_url` varchar(255) NOT NULL,
  `given_rating` varchar(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `notifier_last_rated` */

/*Table structure for table `reviews` */

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(11) unsigned NOT NULL,
  `profile` varchar(255) NOT NULL,
  `rating` double(10,2) unsigned NOT NULL,
  `score` double(10,2) unsigned NOT NULL,
  `text` text NOT NULL,
  `link` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` int(11) unsigned NOT NULL,
  `hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

/*Data for the table `reviews` */

insert  into `reviews`(`id`,`users_id`,`profile`,`rating`,`score`,`text`,`link`,`date`,`time`,`hash`) values 
(1,1,'google',2.80,3.00,'Na ernstige klacht in het weekeind ben ik maandag op aanraden van een vriend naar tandarts van der Lugt gegaan, en ondanks dat haar agenda vol zat heeft ze me in haar pauze toch goed kunnen helpen. \nDit is nu 12 weken geleden en ben nog steeds blij dat ik naar deze kliniek ben gegaan.','https://plus.google.com/+Cloudrocketsoftware/about','17-12-2012',1355774737,'98549489e46a9c3b90d3cff9b581018e'),
(2,1,'google',2.80,1.00,'Slechte tandartsen praktijk, heb ook zeer slechte ervaringen met tandarts van der lught.\nMijn gebit is achteruit gegaan ondanks de controles, het is net of ze expres je gebit niet goed controleren bij een controle, gemaakte vullingen gaan na 4 weken eruit, dat vertelt veel over de vakkennis. \nAdvies, blijf weg bij deze horror kliniek.','https://plus.google.com/+Cloudrocketsoftware/about','02-05-2012',1335978677,'df29dfa743169d0f344e850500ebfd91'),
(3,1,'google',2.80,1.00,'telefonisch werd door gegeven dat kies laten trekken ongeveer 60 to 80 euro zou kosten.\n\npuntje bij bepaaltje eind afrekening 110 euro. ze kwamen met allerlei dingen aanzetten toen ik vraag wat er met de afgesproken bedrag was.\n\nik zei dat ze direct mijn inschrijving ongedaan moest maken. en zei heel bijdehand nog van je gaat in dossier zo dat je volgende keer niet geholpen kan worden. nou mensen hoever kan iemand zinken voor geld.\n\ndus niet doen, niet gaan, blijf uit hun buurt, ze zijn niet te vertrouwen, geld wolven, oplichter, afzetters,  vooral brutaal..\n\nje bent gewaarschuwd..','https://plus.google.com/+Cloudrocketsoftware/about','01-02-2011',1296582433,'e6b8e4707ceaec2c3c0b27ecd538d2e8'),
(4,1,'google',2.20,1.00,'Vervelende kliniek! Brutale medewerker, straks moet je pinnen, tandarts van der Lugt heeft straks onnodige röntgen gemaakt die zij nooit heeft gebruikt, maar ik moet ervoor 50 euro betalen. Daarna heeft zij  zo een slechte vulling gemaakt dat die na 4 weken is uitgevallen. Als ik terug kwam, heeft zij  - zonder mijn toestemming en totaal onnodig - mijn voortand zo afgeslepen dat de tand heel dun is geworden! Total vervelende ervaring en vervelende tandarts. Ik voel mij opgelicht, mijn geld kwijt en mijn tand is in noch slechter toestand als van tevoren. Echt geen advies daar naartoe gaan! ','https://plus.google.com/+Cloudrocketsoftware/about','07-10-2010',1286473851,'38aa75bcd67adc08fe652a8743695f95'),
(5,1,'zorgkaart',0.00,5.00,'Heb verschillende tandartsen gehad die heel veel aan mijn gebit &amp;quot;gerommeld&amp;quot; hebben. Bij deze tandarts wil ik nooit meer weg en ik vind het j','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-ausems-s-p-geleen-29723','21-10-2014',1413926040,'4b6e56ef15247a5dc9f5a35f96de98f5'),
(6,1,'zorgkaart',0.00,4.00,'Zeer vakbekwame en ervaren tandarts! Uitstekend luisteraar, komt met prima oplossingen. Ik ben inmiddels zo&amp;#039;n 28 jaar &amp;#039;patient&amp;#039; bij tan','https://www.zorgkaartnederland.nl/zorgverlener/tandarts-ausems-s-p-geleen-29723','19-06-2013',1371642907,'cc5db5da5afa2479ce1d88ac9fbc0568'),
(7,59,'zorgkaart',4.15,4.00,'Ik ben al  vanaf begin van de praktijk verbonden bij Dr. Han van der Steeg. We hebben een hele goede vertrouwensband gekregen. Wij als gezin zijn zeer','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','11-02-2015',1423678560,'8fce753e48ed40dcc2a7ed73c63560ee'),
(8,59,'zorgkaart',4.15,5.00,'Een gezellige praktijk met leuke mensen','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','18-11-2014',1416333540,'b89130547cca2398a344a724886d3c36'),
(9,59,'zorgkaart',4.15,4.00,'Professioneel ogende praktijk ,die vertrouwen wekt door orde, netheid en inrichting. Prettige sfeer is ook voor de patiënt voelbaar. Consulten verlope','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','05-11-2014',1415203920,'2dd62865d3311e17239cff5957236e70'),
(10,59,'zorgkaart',4.15,4.00,'Ik ben nu al 21 jaar patiënt bij deze praktijk, in de loop van de tijd is deze praktijk uitgebouwd van een kleine solo naar een groot centrum op 3 loc','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','23-10-2014',1414076220,'e0b2ffb564c86c9e98d3364efdd7c102'),
(11,59,'zorgkaart',4.15,4.00,'Mooie praktijk, niet te groot, persoonlijk karakter.\nuitstekend personeel. Veel mogelijkheden onder één dak.','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','22-10-2014',1413975240,'1ae828686393247d0c9682f167406cca'),
(12,59,'zorgkaart',4.15,4.00,'Vriendelijk te woord gestaan, makkelijk telefonisch of per mail bereikbaar, bijna altijd dezelfde dag nog een afspraak of antwoord, voelde me serieus ...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','08-09-2014',1410203880,'840529bfe4493e21ae115f44bd0578b6'),
(13,59,'zorgkaart',4.15,1.00,'Ik heb een afspraak gemaakt voor een keuring voor mijn groot rijbewijs via de zeer professieonele telefooncentrale van MediMere. Assistente wist niet ...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','03-02-2012',1328270906,'25f5c142ebb6a63d9f7d01eb7713ab47'),
(14,59,'zorgkaart',4.15,4.00,'Ik word kundig behandeld en er is een prettige benadering door het personeel. Deze praktijk is flexibel en kleinschalig. ','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-huisartsenpraktijk-medi-mere-buiten-almere-3031382','05-01-2011',1294226409,'95810d85f8004b8f352ab935dddbf39c'),
(15,1,'independer',3.05,0.75,'Een flitsend, knipperend &quot;open&quot;-bord (veel gezien bij shoarmazaken) hoort wat mij betreft niet bij een huisarts.  Er is een behandelkamer waar de wachtruimte, gesitueerd in een gang,  uitzicht op heeft. De aanblik vond ik onprofessioneel en onhygi&#235;nisch.De assistente was onge&#239;nteresserd en liet me niet uitpraten want ze dacht het allemaal al te weten en vulde mijn zinnen, vaak foutief, aan. Datzelfde geldt ook voor de arts zelf, welke mij  vragen en opmerkingen gemakkelijk weg wimpelde en onnodig vond. Ik voelde me niet serieus genomen en ben met een erg vervelend gevoel achtergebleven. Niet mijn soort praktijk dus!','https://www.independer.nl/huisarts/regio/brabant-zuidoost/helmond/huisartspraktijk-verhaegh/hof-bruheze-1.aspx','',0,'96fc3c6f319ce306166f6f864e02edaa'),
(16,1,'independer',3.05,4.50,'Dr. Verhaegh is een rustige man die je prima op je gemak weet te stellen. Hij neemt ruim de tijd voor je. ','https://www.independer.nl/huisarts/regio/brabant-zuidoost/helmond/huisartspraktijk-verhaegh/hof-bruheze-1.aspx','',0,'f51d2e2108e525cc3338255e560dc6f9'),
(17,61,'google',5.00,5.00,'','https://plus.google.com/108010168494125844792/posts','20-01-2014',1390177760,'d41d8cd98f00b204e9800998ecf8427e'),
(18,84,'zorgkaart',4.70,4.00,'Je wordt volledig geïnformeerd over de behandeling, en eventueel verwachte kosten. De te behandelen plek en alles rondom wordt getoond en samenhang du','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','20-08-2015',1440101460,'11c6496f52747736e4e7f43fd09e9f85'),
(19,84,'zorgkaart',4.70,4.00,'Prima service.','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','26-07-2015',1437930600,'158e581818a3199bdf66d3469c19af93'),
(20,84,'zorgkaart',4.70,5.00,'Katja luistert goed naar de klachten en vraagt veel. Zo zijn we er achter gekomen waar de knie klachten vandaan kwamen. Na vele fysio&amp;#039;s eindelijk','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','25-07-2015',1437819960,'64cd9cbaf7aa8217026c00b78360a484'),
(21,84,'zorgkaart',4.70,5.00,'kundige behandelaars, nette praktijk!','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','21-02-2015',1424511660,'a32b0f19dbc1215188cfcf569e41f0d9'),
(22,84,'zorgkaart',4.70,5.00,'In de voorzomer had  ik een erge blessure opgelopen ik had mijn meniscus toen gescheurd. Allerlei doktoren vertelden mij om het te opereren en dat wou...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','25-09-2014',1411646280,'45f65350f3222be305e546aefb8cf65a'),
(23,84,'zorgkaart',4.70,5.00,'Effectieve behandelingen met snelle verbetering! Top!','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','02-06-2014',1401701889,'52ecfc2e00cbccb59ebdd583cf40c3fe'),
(24,84,'zorgkaart',4.70,4.00,'Door de goede en effectieve behandelingen van Katja Wories zijn blessures snel verleden tijd. ','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','06-05-2014',1399368854,'c0c4f581957c5d8fff9a06fe8c3292a9'),
(25,84,'zorgkaart',4.70,4.00,'zij geeft voorlichting en advies over gezondheidsbevorderend gedrag.\nKwaliteitszorg en innovatie.','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','28-04-2014',1398675586,'735b16ce30d1e04647073f14e688a9db'),
(26,84,'zorgkaart',4.70,4.00,'Na een aantal behandelingen en begeleiding door Fysiotherapeute Katja Wories. Ik ben weer in Topvorm!\n\nKatja heeft oprechte belangstelling voor haar k...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','25-04-2014',1398426150,'d173c4dea43dc56271d589ed803dee8d'),
(27,84,'zorgkaart',4.70,4.00,'Zeer prettige praktijk waar professioneel personeel werkt die verstand van zaken hebben. Hier wordt mee gedacht aan uw eigen doel om dit zo snel mogel...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','25-04-2014',1398413293,'ef0c5cac628c61bd63590fbb07f38f7f'),
(28,84,'zorgkaart',4.70,4.00,'Na een bezoek aan de praktijk, zit ik weer lekker in mijn vel en ben ik verlost van mijn nekklachten. Ontvangst in de praktijk ervaar ik als zeer pret...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','24-04-2014',1398325344,'e6c2d9ff7f6222d5c7c5edc0f8ad32b3'),
(29,84,'zorgkaart',4.70,4.00,'Publiciteit zoeken door bijvoorbeeld folders of advertentie in de krant','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','23-04-2014',1398255042,'fb6f4bd5e880e0b2a96502ec6eb2caf3'),
(30,84,'zorgkaart',4.70,5.00,'Na een paar behandelingen was ik af van al mijn klachten. Ook met kinderen gaan ze heel goed om en zijn zeer vriendelijk. Ik ben heel blij dat ik ze k...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','23-04-2014',1398238391,'17f98e776e3b7d3ada105842e048cf32'),
(31,84,'zorgkaart',4.70,4.00,'Zeer te spreken over de behandeling, de heldere uitleg en de gedrevenheid van Katja.','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','22-04-2014',1398174761,'f32f41a7e49f9160cac7300fa9df740d'),
(32,84,'zorgkaart',4.70,4.00,'Ik ben onder behandeling geweest bij Katja Worries. Zij weet door gerichte vraagstelling snel de juiste prognose te stellen en een passende behandelin...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','22-04-2014',1398155260,'185e58dc33d0235440cfc1bc2882095c'),
(33,84,'zorgkaart',4.70,4.00,'Ik word hier erg goed geholpen en het gaat steeds beter! Ik ben super tevreden ','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','22-04-2014',1398151190,'e534abc483b71e846d941594cfa1d110'),
(34,84,'zorgkaart',4.70,5.00,'Ik ben onder behandeling bij Katja Worries. Een spontane dame die precies weet hoe ze te werk moet gaan. Ze is heel deskundig, klantgericht en heeft e...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','18-04-2014',1397826784,'a460be96baa156d61cfd5d8b3987b708'),
(35,84,'zorgkaart',4.70,5.00,'Ik wordt altijd goed geholpen. Netjes op tijd, er is persoonlijke aandacht. Perfect. Er wordt goed geluisterd naar mijn klachtomschrijving en daarvand...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','18-04-2014',1397825243,'9a0c404a7c782e13af089afcc9a5a365'),
(36,84,'zorgkaart',4.70,4.00,'Behandeling prima','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','18-04-2014',1397825073,'c4aba4f170f9b2ce3e25540a9e1bc3bf'),
(37,84,'zorgkaart',4.70,5.00,'Deze fysiotherapie is erg goed gespecialiseerd, toen ik last had van mijn lies kwam ik om het te laten behandelen en na de 1e afspraak was de klacht a...','https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812','18-04-2014',1397824433,'7df2c7bbb49f2efc69106312a4035a4e'),
(38,1,'telefoonboek',3.50,0.00,'','http://www.telefoonboek.nl/bedrijven/t3062478/heerhugowaard/fysiotherapie-butterhuizen/','',0,'804066a6a5042090a2a0b25c55f38e72'),
(39,64,'zorgkaart',2.50,2.00,'Ik heb mijzelf hier ingeschreven toen ik ging studeren in Enschede. Op het eerste oog een prima praktijk, tot ik eenmaal in aanraking kwam met medisch...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','09-10-2014',1412849220,'6d6c9b4526ee254e6b23a8050718fb2b'),
(40,64,'zorgkaart',2.50,4.00,'Na het overlijden van mijn dochtertje aan wiegendood belde dr. Lewis ons meteen, en heeft ook psychologische hulp voor mij en mijn vriend geregeld. En...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','23-09-2014',1411472100,'fa14814c9a5be4084fddac21c841ac08'),
(41,64,'zorgkaart',2.50,4.00,'Tegenwoordig ga ik naar warner stad en dat is een goede en leuke keal die tussen door ook nog wel grapen met me maakt','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','10-07-2014',1404991355,'77e58d3d7dedd89e4dde98e9ca16920b'),
(42,64,'zorgkaart',2.50,2.00,'Ik vind het een slechte behandeling,8 van de 10 keer kan ik niet bij mijn eigen huisarts terecht,korte info.wordt niet goed geluisterd naar de patient...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','02-07-2014',1404285811,'1a91511ab67124b574a397bacf3b522b'),
(43,64,'zorgkaart',2.50,3.00,'Over het algemeen zeer tevreden, al duurt het soms wat lang voor je terecht kunt op het spreekuur bij een bepaalde arts.','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','24-03-2014',1395672283,'a2b0d9c3365e62268268dbe287e65fa5'),
(44,64,'zorgkaart',2.50,4.00,'Ben zeer tevreden!','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','20-03-2014',1395303212,'09f0206231a5513d4060846f487ed551'),
(45,64,'zorgkaart',2.50,1.00,'Ten eerste wil ik geholpen worden door mijn huisarts en niet door een telefoniste. Dan kunnen ze wel gediplomeerd zijn or whataver.\nIk vind wel dat de...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','26-02-2014',1393403470,'3dcede96f84edf11b42f7815c3ef1274'),
(46,64,'zorgkaart',2.50,4.00,'Ik belde het zorgcentrum omdat ik last van mijn linker oog had. Op de benedenkant van mijn onderste oogrand zit een klein rood puntje dat veel weg hee...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','17-02-2014',1392645803,'aae7c0168476e88d4940c3ca3a2b1d5a'),
(47,64,'zorgkaart',2.50,2.00,'Ik heb al sinds 2010 geen vaste huisarts. Ik krijg telkens een ander en ze onderzoeken ook niet goed. De meeste wat ze doen is bloed onderzoek en dan ...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','30-01-2014',1391093656,'299658eba74dc30b020c667140ad39eb'),
(48,64,'zorgkaart',2.50,1.00,'Het Gezondheidscentrum Noord is bijna niet te bereiken of ze zijn aan de koffie of aan de lunch of er is werkoverleg, je wordt er niet goed van.\nDe co...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','03-01-2014',1388753282,'aa0b64dcfb68e1bb8403369a7a5bb87e'),
(49,64,'zorgkaart',2.50,2.00,'Zeer ontevreden over deze huisartensenpraktijk.Een greep uit zaken die ik afgelopen maanden ben tegengekomen:\n- Recept wordt uitgeschreven bij de verk...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','09-10-2013',1381328772,'a78b3d4b89cc36876c19d74c2f2c4946'),
(50,64,'zorgkaart',2.50,2.00,'Elke keer als we de praktijk nodig hebben is deze gesloten vanwege vakantie of het ontbreken van personeel of noem maar op. De bereikbaarheid van de p...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','07-06-2013',1370613154,'929cc57a112430729e252b9a50b8fd47'),
(51,64,'zorgkaart',2.50,2.00,'ik reageer namens mijn moeder, mijn moeder is 77 jaar en begrijpt niks van het antwoord apparaat, regelmatig heb ik haar huilend aan de telefoon omdat...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','14-05-2013',1368533276,'00a79fd8a59baba9d90aaa17c44f69ea'),
(52,64,'zorgkaart',2.50,4.00,'Ik zit nu ruim een jaar bij gezondheidscentrum Noord en het bevalt me erg goed omdat ik vind dat er goed naar me geluisterd wordt en ik altijd wel een...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','03-05-2013',1367584387,'c19a1ed0cbcc1fb3a3cc1852a3efd740'),
(53,64,'zorgkaart',2.50,4.00,'Ik vind de praktijk ontzettend vooruit gegaan! Goed luisteren, de artsen en assistentes  zijn bekwaam. Het is een professionele  praktijk. ','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','15-01-2013',1358238429,'daa91d2822407732bda235f3c59e62f1'),
(54,64,'zorgkaart',2.50,4.00,'Nadat Gezondheidscentrum Noord enige tijd gekend heeft met nogal wat personele wisselingen is de rust en daarmee de kwaliteit wedergekeert. Het centru...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','15-11-2012',1352986060,'3372bdb9f7dc5fade67c034d299f5533'),
(55,64,'zorgkaart',2.50,2.00,'De receptionisten luisteren niet en spelen vaak zelf voor doktertje vind ik, je moet het overdrijven voor je toegelaten wordt tot de huisarts. vooral ...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','16-10-2012',1350393940,'7f19a75cbe630683dee81077d3d563e5'),
(56,64,'zorgkaart',2.50,1.00,'Luisteren wel maar nemen niet altijd de juiste behandeling.\nZijn te zuinig met medicijnen en doorverwijzing.\nPas na lang aandringen kan er een doorver...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','15-06-2012',1339749615,'fb36a0d435e6fe656f08c1e00a3fdb93'),
(57,64,'zorgkaart',2.50,4.00,'Net in de buurt komen wonen en op zoek naar een huisarts, Kon gelijk afspraak maken en prima kennismakingsgesprek gehad. Huisarts werkt parttime omdat...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','13-06-2012',1339587490,'0c8cf0400bada2186241f37041a74187'),
(58,64,'zorgkaart',2.50,1.00,'Ik bel voor een afspraak met de huisarts die ik nog niet ken. Aangezien dit mijn vierde is binnen een paar jaar ik heb er een gesproken een tijd geled...','https://www.zorgkaartnederland.nl/zorginstelling/huisartsenpraktijk-gezondheidscentrum-noord-enschede-huisartsen-enschede-124193','25-05-2012',1337960484,'0421ff35fb6d4d517beacda791805da6'),
(59,64,'google',5.00,5.00,'Cloudrocket heeft in korte tijd een mooie, professionele website ontwikkeld voor mijn bedrijf Orange Tree.\nMen heeft goed meegedacht in de vertaling van de business-propositie naar een heldere communicatie via internet.\nCloudrocket neemt dingen niet zomaar aan, maar stelt vragen om ze goed te begrijpen. Dit houdt je als ondernemer scherp in de vertaling van je boodschap. ','http://plus.google.com/+Cloudrocketsoftware','07-05-2015',1431007703,'a7c8c56a4c00e5c9995b6883e20e1aaf'),
(60,64,'google',5.00,5.00,'Slimme gasten, denken goed mee en zijn nooit te beroerd om iets extra voor je te doen!','http://plus.google.com/+Cloudrocketsoftware','10-05-2015',1431263371,'86ff10e2d554c6784bb2432988443745'),
(61,65,'zorgkaart',4.05,3.00,'Met voorrang geholpen wegens vermoeden netvl.loslating. Snel naar Nijmegen voor operatie. Nu enkele nacontroles gehad in Zonnestraal en het beeld blij...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','07-09-2015',1441616160,'ea01677f73e1c7a5fa8a9f2a89c74632'),
(62,65,'zorgkaart',4.05,5.00,'Ongeveer 15 jaar geleden ben ik bij de oogarts terecht gekomen omdat ik al op zeer jonge leeftijd een leesbril nodig had. Inmiddels ben ik hier meerde...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','24-04-2015',1429885920,'96d2e7708ab568ea7c4af6bfb4d6c9d6'),
(63,65,'zorgkaart',4.05,1.00,'27-03 2015 afspraak gemaakt door huisarts, zou een termijn krijgen van zonnestraal. Na 2,5 week zelf gebeld, landelijknr 088, kreeg te horen da er nie...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','16-04-2015',1429179180,'178983945e43d89237249df44a5e2935'),
(64,65,'zorgkaart',4.05,4.00,'Vriendelijke en efficiënte ontvangst bij de balie, alle keren dat ik er kwam. Al mijn vragen werden (uitgebreid) beantwoord, er was zelfs ruimte voor ','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','23-02-2015',1424705040,'339043b4f5da4e866bda322d0087d024'),
(65,65,'zorgkaart',4.05,3.00,'Nacontrole staaroperaties nieuwe lens.om 4 uur op de afgesproken tijd aanwezig .in april in de Radboud geopereerd wegens netvliesloslating. Deze laats...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','23-12-2014',1419361800,'ba2cf8c1a9bb49df0d0775bbe516df19'),
(66,65,'zorgkaart',4.05,4.00,'In dit ziekenhuis loopt alles op rolletjes. Ook als je door omstandigheden een keer tien minuten te laat komt, dan maakt men daar geen punt van. Ieder...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418051700,'8737cecfe3c7c706a2fab21190d6cd20'),
(67,65,'zorgkaart',4.05,4.00,'Bij het van een afspraak valt op, dat werkelijk niets onmogelijk is. Men denkt met je mee en doet zijn uiterste best om het voor jou geschikte moment ...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418051280,'bf4c19058ae68a3774c521afd7fc12a7'),
(68,65,'zorgkaart',4.05,4.00,'Werkelijk alles klopt hier, van het maken van de afspraak (vlot en met een enkel telefoontje) tot de zeer zorgvuldige nazorg.\nEn daartussenin word je','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418050740,'4eab93d93b835e645b05d09ad47bd1dd'),
(69,65,'zorgkaart',4.05,4.00,'Het maken van afspraken gaat zeer accuraat en verzorgd. Je krijgt ook altijd een bevestiging thuis, dat is erg prettig.\nDe accommodatie is in vergeli','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418050440,'551a71745ae196097e6c45e9c05943c7'),
(70,65,'zorgkaart',4.05,4.00,'Als je een afspraak hebt gemaakt, dan wordt je per post een bevestiging gestuurd. Ik vind dat heel netjes. De hele informatievoorziening is in dit zie...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418050020,'6365095067311c96d04b38986c9d10e2'),
(71,65,'zorgkaart',4.05,4.00,'Afspraken maken: snel, prettig en efficiënt.\nMedewerkers: alle lof . Ze zijn vriendelijk, behulpzaam en hebben aandacht voor je.\nAccommodatie: prima','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418049540,'36131c4f5899a38d990e563f310407bb'),
(72,65,'zorgkaart',4.05,4.00,'Complimenten voor de manier waarop en afspraken maakt en voor het feit dat men altijd terugbelt als ze dat beloofd hebben.\nDe medewerkers zijn uiters','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418049180,'5cf4b79a1af18b500c2f3f6944070c79'),
(73,65,'zorgkaart',4.05,3.00,'Het is erg gemakkelijk om een afspraak te maken. Ik vind het wel jammer dat je vervolgafspraak voor over een half jaar niet meteen gepland kan worden....','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418048880,'78d9a00720c456052986ed861f196c3d'),
(74,65,'zorgkaart',4.05,3.00,'Afspraken maken is hier een kwestie een enkele minuut. Het gaat vlot en efficiënt.\nDe medewerkers zijn vriendelijk en hulpvaardig. In de vier jaar da...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418048460,'54b6175a909c29de498ea2ed3a1cb263'),
(75,65,'zorgkaart',4.05,4.00,'De medewerkers vallen hier in positieve zin op in vergelijking met andere ziekenhuizen. Ik kan dat vergelijken, want ik kom uit de verpleging. Ik erva...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418048160,'3c8a68f3a379e487960e071db97b4d07'),
(76,65,'zorgkaart',4.05,3.00,'Het maken van afspraken verloopt hier soepel, kennelijk zijn de telefonistes goed getraind.\nDe medewerkers zijn vooral erg rustig. Als er iets niet d','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418047860,'da00ebdad40f1e1ca51c52f5351db745'),
(77,65,'zorgkaart',4.05,3.00,'Afspraken leveren nooit moeilijkheden op. Het is meteen voor elkaar en meestal op zeer korte termijn. De medewerkers communiceren vlot en vriendelijk ...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418047440,'ef0dab234483dc751d300cee46fd1a9e'),
(78,65,'zorgkaart',4.05,4.00,'Ik ben misschien wat saai, maar ik kan werkelijk niets noemen wat verbetering behoeft.\nJe kunt op heel korte termijn terecht voor een afspraak en als','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418047140,'50fd68a5f43838319a6bee93d333359e'),
(79,65,'zorgkaart',4.05,4.00,'Er valt niets speciaal op, alles is goed geregeld, alsof het vanzelfsprekend is. Het loopt gladjes en flexibel. De medewerkers lijken mij goed gekwali...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418046780,'15a2aa944aaa7ccd0be515b8784b1416'),
(80,65,'zorgkaart',4.05,4.00,'Zoals uit mijn cijfers blijkt, kan ik geen enkel punt ter verbetering noemen. Het maken van een afspraak kan hier bijzonder snel. Vandaag bij voorbeel...','https://www.zorgkaartnederland.nl/zorginstelling/oogkliniek-oogziekenhuis-zonnestraal-doetinchem-doetinchem-3029032','08-12-2014',1418046360,'951d4d6214982b30324cfab86e83cbff'),
(81,84,'google',4.20,5.00,'Christopher and Bridget are so nice to talk to.  Just like two of my favorite Chefs, Julia and Jacques, Christopher and Bridget\'s charm is there sincerity.  Feels like you\'re talking to an old friend.','https://plus.google.com/108010168494125844792/posts','09-01-2014',1389301758,'0cc222c1f14e9585026db73d52c52562'),
(82,84,'google',4.20,1.00,'Signed up for a FREE 2 week trial membership. Got charged almost $70 dollars for it, and well within the trial period. Beware of giving them your credit card information!','https://plus.google.com/108010168494125844792/posts','13-12-2013',1386896238,'f1e29b43940e99fc68e9cdac2ccdd439'),
(83,84,'google',4.20,1.00,'These guys are crooks.  If you buy a book from them, they put in very small print that they are enrolling you in their annual book club.  They send you a book and then expect payment.  When payment isn\'t received, they send it to a collection agency and then mess up your credit.','https://plus.google.com/108010168494125844792/posts','22-07-2011',1311348059,'12bd010a86bbcde671f21d547de02ab9'),
(84,1,'zorgkaart',5.00,5.00,'Super fijne organisatie! woon nu een tijdje bij deze woonzorg en ben heel erg tevreden. Mooie kamers en leuke begeleiding! het is een vast team waardo...','https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716','28-10-2015',1445989380,'2e307363573cd5da080d17f4b2599708'),
(85,1,'telefoonboek',3.80,0.00,'','http://www.telefoonboek.nl/bedrijven/t3062478/heerhugowaard/fysiotherapie-butterhuizen/','',0,'80a938c3318798274305870f8cec3271'),
(86,1,'zorgkaart',5.00,5.00,'Omdat mijn vertrouwen in het verleden zeer vaak beschadigd is had ik geen hoop en vertrouwen meer in mensen of Hulp verlenging, zo was het ook toen ik...','https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716','28-10-2015',1446052620,'448d1628fa576e2e4950a56318f703fd'),
(87,61,'telefoonboek',3.10,0.00,'','http://www.telefoonboek.nl/bedrijven/t2272723/arnhem/wim-uw-kapper-op-locatie/','',0,'5b068a95442c7d5505b4166a77357ea5'),
(88,61,'google',4.00,3.00,'Over topvorm, redelijk tevreden. Door de eigenaresse (katja ) geholpen. Redelijk tot goed.\nErvaring met college . ja tamelijk ontevreden. Dubbele behandelingen. Veel minder goed behandeld.\nMisschien gebrek aan ervaring, ik weet het niet. Maar niet tevreden. Te laat op afspraken. Vieze behandelingstafel. Geen handdoek, Goed neem je die van jezelf mee.Geen probleem. Maar het gat waar je hoof naar beneden gericht in moet. Hoort gewoon schoon te zijn. Dit was het totaal niet.\nLig je in de viezigheid van een ander. Nou lekker hoor ! Nee Katja is oke met alles tip top maar de rest is een zware flop. Voor mij  nooit meer.\n','https://plus.google.com/108010168494125844792/posts','13-11-2015',1447433243,'140876f055e3d54fd1b710c669240d5f'),
(89,61,'telefoonboek',3.25,0.00,'','http://www.telefoonboek.nl/bedrijven/t2272723/arnhem/wim-uw-kapper-op-locatie/','',0,'dd7f542392a4b31946826638316847cb'),
(90,1,'zorgkaart',4.60,4.00,'Prima tandarts. Modern, efficient, vriendelijk en vooral goed.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','27-11-2015',1448639280,'83b6e4d0dc8f870f67d54bd58017f4ac'),
(91,1,'zorgkaart',4.60,4.00,'Super tandarts! Kundig de modernste technieken en heb het adres aan veel mensen doorgegeven en zijn net zo blij als ik!','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','27-11-2015',1448638920,'96ccc59ec6e9d7975836b56ed19fab78'),
(92,1,'zorgkaart',4.60,4.00,'Bij deze tandarts inmiddels alweer de vierde wortelkanaal behandeling ondergaan en wederom een perfecte behandeling. Tijdens de behandeling geen pijn ...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','27-11-2015',1448635200,'bb53ddc8f211da3a88b35633aa15062e'),
(93,1,'zorgkaart',4.60,5.00,'Goede deskundige informatie en behandelingen door vriendelijk team.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','27-11-2015',1448619600,'09743cd7d32103c57c9d94951b302cae'),
(94,1,'zorgkaart',4.60,5.00,'Goede ontvangst, tandarts met aandacht voor zijn klant, geweldige behandeltechnieken, goede tandverzorging, kortom ik wist niet dat bij een tandarts h','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','27-11-2015',1448608680,'7829075e0a7945d320138bba25c24960'),
(95,1,'zorgkaart',4.60,5.00,'Kwalitatief goede zorg door echte proffesionals. Men neemt de tijd en stelt je op je gemak.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','26-11-2015',1448564580,'76899d51ce11824e8e5f274acf5368f7'),
(96,1,'zorgkaart',4.60,5.00,'Ik heb heel wat tandartsen gezien en heel wat en heel verschillende behandelingen ondergaan. Ben na veel pijnklachten etc uiteindelijk na veel omzwerv','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','26-11-2015',1448560080,'3747a06e750ab8859c87ef75e015768d'),
(97,1,'zorgkaart',4.60,5.00,'De tandartsen en de medewerkers zijn allemaal heel klantvriendelijk, professioneel, zorgzaam en zorgvuldig. De praktijk is zo mooi, dat je je bijna in...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448534760,'aa3a472271add2226229dab2ae56663a'),
(98,1,'zorgkaart',4.60,4.00,'Fraai is ondanks mijn grote angst voor de tandarts een veilige plek geworden om behandeld te worden. Beide tandartsen gaan goed om met mijn angst, waa...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448531640,'625f9aa4f8bf27dbc9b2fca5d045a2fb'),
(99,1,'zorgkaart',4.60,5.00,'Wordt er altijd keurig geholpen. Het praktijk is zeer modern en designachtig ingericht. Prettige omgeving en medewerkers.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448525700,'1cfbbfe67abaa1274e7ad859074faf3f'),
(100,1,'zorgkaart',4.60,4.00,'Down to earth jongens met een eigentijdse aanpak. No nonsense, praktisch, toegankelijk. Afspraken krijg je bevestigd per e-mail en een dag van tevoren...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448525520,'e4c03aefd80b9b0069f8b270d77bf600'),
(101,1,'zorgkaart',4.60,5.00,'Eigentijdse, moderne praktijk, uitermate goed advies en communicatie. Prima uitleg over benodigde behandeling en je wordt op je gemak gesteld. Fraai t','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448520420,'fcf3c10ea44ce8041280566ca9ac39ee'),
(102,1,'zorgkaart',4.60,4.00,'Fraai Tandartsen is een prettige tandartsenpraktijk. Ik ben met name tevreden over het maken van afspraken en de manier waarop voorafgaand aan de afsp...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','26-11-2015',1448520360,'ed3cfff71e09c373291eac07afcd9cc0'),
(103,1,'zorgkaart',4.60,4.00,'Kanaalwortelbehandeling voor stifttand zorgvuldig en deskundig uitgevoerd.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448484960,'92a76d6ca505787daaa55bf45a40b258'),
(104,1,'zorgkaart',4.60,4.00,'Zeer deskundige medewerkers, voldoende uitleg, servicegericht, prima praktijk!','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448480700,'8fcaafe6937c8cf638a6e2609795c2dc'),
(105,1,'zorgkaart',4.60,4.00,'Er wordt goed naar je geluisterd en rekening gehouden met je wensen.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448479140,'9e85881ea8e841190bc4f5212a0626df'),
(106,1,'zorgkaart',4.60,4.00,'De jongens die hier werken zijn zeer deskundig en ervaren. Je wordt hartelijk ontvangen en ze stellen je op je gemak. De omgeving is netjes en schoon....','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448478780,'b69eb3483dc444eebe9e6f7214a4c70b'),
(107,1,'zorgkaart',4.60,5.00,'Ben kritisch.. Maar deze praktijk is echt. In woord en daad top. Ik kan de praktijk aanraden, zo hoort de zorg in Nederland te zijn. Een voorbeeld!','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448478360,'39e56998314d32b69cd92931d8e8b160'),
(108,1,'zorgkaart',4.60,5.00,'Altijd correct en klantvriendelijk en heel veel geduld met kinderen.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448477700,'48248df5e4d03c32746f4f93e70a4e72'),
(109,1,'zorgkaart',4.60,5.00,'Ik heb deze tandarts bezocht voor een her-endo behandeling. Wegens een fistel op mijn tandvlees vanwege een sluimerende ontsteking in een kies waarop ...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-11-2015',1448476920,'0b4fb530bdca6c877ee767c7e804d037'),
(110,1,'independer',4.55,4.95,'Alles prima voor elkaar daar; Toplocatie in alle haar facetten (bereikbaarheid, uitstraling, hygiene, moderne apparatuur etc.)  Kundig personeel  Goed georganiseerd Etc','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'daf6d7bfae1a03f3fb5cf6476b968842'),
(111,1,'independer',4.55,4.95,'Moderne praktijk inclusief gratis wifi.','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'d094b3538dacb4c74e675055f0a83af0'),
(112,1,'independer',4.55,4.95,'Moderne praktijk met een uitstekende dienstverlening','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'2513621ba51a638f84ff90cbf1bffd63'),
(113,85,'independer',4.30,4.55,'De mondhygi&#235;niste (Mw. S. Holtrop) is een fijne en vooral kundige mondhygi&#235;niste. Ze is erg vriendelijk en schroomt niet om gezellig een praatje te maken. De behandeling is prettig, het gebit wordt grondig op een professionele manier gereinigd. Verder is de praktijk erg modern en schoon. De medewerkers zijn vriendelijk, jong en denken graag met je mee. Kortom zeker een aanrader!','https://www.independer.nl/tandarts/regio/brabant-zuidoost/helmond/m3-mondzorg-helmond.aspx','',0,'7096c68556973c5f3171241b7f176cc1'),
(114,85,'independer',4.30,4.65,'Jaren een slechte tandarts gehad. De tandartsen van M3 hebben m&#39;n gebit compleet gerenoveerd, ben er echt super blij mee! Had hele lelijke voortanden, dit met vullingen recht, netjes en witter gemaakt... Nu op elke foto een mooie Prodent smile! Ben er tot op de dag van vandaag nog enorm blij mee!!','https://www.independer.nl/tandarts/regio/brabant-zuidoost/helmond/m3-mondzorg-helmond.aspx','',0,'0b9423078e425bb8f84864105771a14f'),
(115,85,'independer',4.30,4.40,'Jong, fris','https://www.independer.nl/tandarts/regio/brabant-zuidoost/helmond/m3-mondzorg-helmond.aspx','',0,'fce8ce9e9e165fc2abb30f0a1de62e70'),
(116,61,'google',5.00,5.00,'Over topvorm: professioneel, luisterend oor . Goede op resultaat gerichte behandelingen.\nZodat er vaak op korte termijn al resultaat behaald wordt. Geen overbodige langdurige behandelingen.\nProblemen na hernia operatie, opgepakt en zeer goed op weg geholpen. Ook na nek schouder  blessure. Kon ik snel terecht en was ik weer snel op de rails. Deze therapeuten weten zeer goed wat ze doen. En gaan verder , daar waar de reguliere fysio vaak ophoud. Dit door een andere benadering.\nKortom bekijken het lichaam in zijn geheel. En dat is de meerwaarde. ','https://plus.google.com/108010168494125844792/posts','14-12-2015',1450091221,'3d5218bd34d127f5ffc311ca9886ae18'),
(117,61,'telefoonboek',3.55,0.00,'','http://www.telefoonboek.nl/bedrijven/t2272723/arnhem/wim-uw-kapper-op-locatie/','',0,'4bcb564487c93aa566ee54090811cc74'),
(118,1,'independer',4.55,4.95,'Ik kom al jaren bij JE Kramer, ben zo tevreden over haar. Erg aardig en altijd zeer betrokken, ze steld mij altijd op mijn gemak. Erg kundig op haar gebied.','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'3cf597da0fd4539e3120aebc75c08835'),
(119,1,'independer',4.55,4.95,'Nette praktijk en mensen die weten waar ze mee bezig zijn','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'9aad543dc4a8da35c031c47d00977ee0'),
(120,1,'independer',4.55,4.30,'Na enige jaren van ontkenning van mijn klachten blijken twee grondige behandelingen van een kaakchirug benodigd en blijkt een andere kies onder een brug echt door midden gebarsten. Dan is een advies van paracetamol en een optie van psychische klachten niet echt een oplossing van het probleem. Inmiddels een bedreven en -als leek inschattend- uiterst ervaren arts gevonden. Extractie en gelijktijdige vervanging van een brug geven mij weer alle vertrouwen in benodigde vervolg restauraties.','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx','',0,'b897372788f6e1b03be5f208d4fdc8c4'),
(121,1,'google',2.80,1.00,'Geen klant vriendelijkheid!\n','https://plus.google.com/+Cloudrocketsoftware/about','19-01-2016',1453238784,'9ce57bdabcb1b4039435a7d4df4dc5cd'),
(122,1,'zorgkaart',4.60,4.00,'Gastvrij in moderne ruimte,geruststelling en ontspannen sfeer,eindresultaat wordt netjes getoond,prima zaak.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','28-01-2016',1453995120,'8f61958fe726ec20a2c7d041de13afad'),
(123,1,'zorgkaart',4.60,5.00,'Dit is een fantastische praktijk met zeer kundig personeel en ontzettend veel aandacht en klantvriendelijkheid. Erg flexibel, menselijk en nog nooit p...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','22-01-2016',1453467060,'df8c93c62b4758dad7e578c63d2d0331'),
(124,1,'zorgkaart',4.60,5.00,'Prima tandarts en lieve assistenten.Altijd een bevestiging van je afspraak en een melding een week van tevoren.Ze werken goed op tijd.Je gaat voor je ...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','21-01-2016',1453405440,'1751a2af4f77225bca295a864e3ed4b5'),
(125,1,'zorgkaart',4.60,4.00,'Iedereen was erg vriendelijk en de behandeling is met zorg uitgevoerd. Ben tevreden.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','21-01-2016',1453381380,'8cfcf9996b0d349edebe011efd83989a'),
(126,1,'zorgkaart',4.60,5.00,'Altijd een goede behandeling  van af het begin Zeer vriendelijk personeel die je daardoor op je gemak stelt voor ge behandeling','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','21-01-2016',1453365240,'246d06f76f5fe2b70d9881ee69c0912e'),
(127,1,'zorgkaart',4.60,4.00,'Absolute professionals.Relaxte sfeer.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453311000,'94b089ed92ef7e8ab6b1eda05ca61b11'),
(128,1,'zorgkaart',4.60,4.00,'Ik ben door mijn tandarts doorverwezen voor een zenuwbehandeling aan een van mijn kiezen. Dit is op een professionele wijze uitgevoerd.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453306740,'8038cf35b60ba8d6a6c598cbc19de336'),
(129,1,'zorgkaart',4.60,5.00,'Halfjaarlijkse controle maar zoals altijd word ik goed behandeld zowel door de tandarts als de assistente. Reiniging wordt zeer nauwkeurig gedaan, ik ...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453304460,'01427b070bddf405cca670a8930c7958'),
(130,1,'zorgkaart',4.60,4.00,'Prima geholpen, geen pijn, klachten verdwenen.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453303980,'2875cd10cb3e9765747b0c36cae09704'),
(131,1,'zorgkaart',4.60,4.00,'Mooie ,moderne en schone praktijk. Prima behandeling. Geen pijn gehad bij  de wortelkanaalbehandeling. Ik zou het iedereen aanraden, echt top!','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453303560,'1d22afa35a06d7d532f582a3da14d2d9'),
(132,1,'zorgkaart',4.60,4.00,'Zeer tevreden over beide tandartsen. Ik loop al 3 jaar bij hun bijna alle behandelingen gehad en nog steeds tevreden. Hoop dat ze de kwaliteit komende...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','20-01-2016',1453302780,'e6e186cf22703f7120463449252d1357'),
(133,1,'zorgkaart',4.60,5.00,'Kundige tandarts (dhr. Peulen) en vriendelijk personeel. Je kunt er snel terecht bij een eventuele klacht / zorg en wordt adequaat behandeld!','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/','08-01-2016',1452253980,'4f4fe21681387935761d976f8686b568'),
(134,61,'telefoonboek',3.05,0.00,'','http://www.telefoonboek.nl/bedrijven/t2272723/arnhem/wim-uw-kapper-op-locatie/','',0,'fadbd9f5b79b27ee597eada8ef543bb5'),
(135,1,'zorgkaart',4.60,4.00,'Professionele, schone, nette praktijk. Fijne ervaring.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','19-02-2016',1455890880,'f28a9febedd857c1bdd97591aa9fe94e'),
(136,1,'google',2.80,5.00,'Ik zit al jaren bij deze Kliniek Een verademing met de vorige praktijken. Zeer vriendelijk en heel kundig. Dr. Van der Lugt is werkelijk fantastisch. Al jaren geen kiespijn meer en een mooi gebit. Altijd uitleg en meedenken met de patient. TOP!!','https://plus.google.com/+Cloudrocketsoftware/about','04-03-2016',1457103922,'78bc9707021ad90320aeca1c93ae4546'),
(137,1,'zorgkaart',4.60,5.00,'voor het eerst een pijnloze en microscopische wortelbehandeling gehad.zonder absurd opgedreven prijzen.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','23-03-2016',1458741840,'077540f3070fb9a3332f1c96dec09de1'),
(138,1,'zorgkaart',4.60,4.00,'Al meer dan 8 jaar mijn vaste tandarts, ben zelfs van praktijk veranderd om bij S. Peulen client te blijven, bij oprichting van zijn eigen praktijk (F...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','20-03-2016',1458430500,'ff503da4de3602054e5af22b22599957'),
(139,1,'zorgkaart',4.60,4.00,'Snelle service, vriendelijk geholpen.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','14-03-2016',1457956680,'0efea3ee9d86c8aa3751af7743db6032'),
(140,1,'zorgkaart',4.60,5.00,'Vriendelijke en  moderne Tandarts, Krijg veel informatie tijdens en na behandelingen. Afspraken zijn altijd op tijd.Is kindvriendelijkWe komen al jare','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','10-03-2016',1457599320,'08a64231ee74767e7940248e0f85a1fd'),
(141,1,'zorgkaart',4.60,4.00,'Wordt goed geluisterd naar de evt klachten. Ingrepen worden indien mogelijk uitgesteld of opgelost door simpele/goedkopere ingrepen. Zo bespaar je kos...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','08-03-2016',1457433240,'07217406421f7f411b6ad4a6ba5ac31e'),
(142,1,'zorgkaart',4.60,3.00,'Moderne praktijk, goede voorzieningen. Duidelijk en snel maken van afspraak, behulpzame assistentes. Tandarts onzorgvuldig en komt ongeinteresseerd ov...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','08-03-2016',1457396640,'65381da29cfae0a9fd982bed70fc7980'),
(143,1,'zorgkaart',4.60,5.00,'Implantaat laten plaatsen. Erg bang aan het begin vanwege het onbekende, een schroef in mijn kaak klonk niet bepaald aanlokkelijk. Het is 100% meegeva','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457388480,'8d71bd1b7f830e2c71226765098a2e2b'),
(144,1,'zorgkaart',4.60,5.00,'Ik ben een moeilijk mens qua tandarts. Maar zij wisten mijn vertrouwen te winnen en het is ze goed gelukt. En verder leveren zij top werk. Ik ben een ','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457383380,'14892ad39a60ff1bdb0e3b118915da0d'),
(145,1,'zorgkaart',4.60,4.00,'Door mijn tandarts doorverwezen voor wortelkanaalbehandeling, daar is deze tandarts in gespecialiseerd. Prima behandeling gehad, andere dag van de pij...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457366100,'bac7fcfa6b74f0b22b09d625d0cdf712'),
(146,1,'zorgkaart',4.60,5.00,'Meester in zijn werk gewoon super goed.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457365860,'ad6fb6d88b4538db093fdd2090c94054'),
(147,1,'zorgkaart',4.60,4.00,'Op dit moment is mijn ervaring met deze praktijk nog pril, mijn indruk na een aantal bezoeken is nu al 100% positief. Ontvangst zeer vriendelijk (met ...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457362500,'b42688c97031ae8866a6f5aa437daf8a'),
(148,1,'zorgkaart',4.60,4.00,'Vriendelijk. Goede klantenservice. Transpirant. Levert werk van goede kwaliteit. Wij zijn zeer tevreden.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457362500,'8263a1f673f638c48a62fc10aea3a4e1'),
(149,1,'zorgkaart',4.60,4.00,'antwoord op alle vragen;geen onnodige behandelingen','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457361960,'f184420150340670ec4d4f32d0a2f2c3'),
(150,1,'zorgkaart',4.60,5.00,'Ga met plezier naar de tandarts, neemt de tijd en luistert, professioneel, precies, heel fijn team, goede onderlinge samenwerking!Moderne en schone om...','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457360880,'de27f07172264240913ced9676b6225b'),
(151,1,'zorgkaart',4.60,5.00,'Snel en vakkundig geholpen. Vriendelijk en goed personeel. Heel erg tevreden.','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','07-03-2016',1457359500,'31131fad18236f1b92e56e58d08a3ca5'),
(152,1,'zorgkaart',4.60,4.00,'Ik ben zeer vriendelijk en kundig geholpen. Aandacht voor mij als cliënt met angst. Er is met aandacht gekeken naar de klachten en overleg geweest. Ze','https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715','25-03-2016',1458891420,'b70beca6f63322a4f33a0d5f7a06fc30');

/*Table structure for table `sent` */

DROP TABLE IF EXISTS `sent`;

CREATE TABLE `sent` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sname` varchar(255) NOT NULL,
  `doctor` int(11) unsigned NOT NULL,
  `location` int(10) unsigned NOT NULL,
  `treatment` varchar(255) NOT NULL,
  `birth` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date` int(11) NOT NULL,
  `last` int(11) NOT NULL,
  `status` tinyint(4) unsigned NOT NULL,
  `stars` tinyint(4) unsigned NOT NULL,
  `feedback` text NOT NULL,
  `reply` text NOT NULL,
  `reply_time` int(10) unsigned NOT NULL,
  `facebook` tinyint(4) unsigned NOT NULL,
  `google` tinyint(4) unsigned NOT NULL,
  `zorgkaart` tinyint(4) unsigned NOT NULL,
  `telefoonboek` tinyint(4) unsigned NOT NULL,
  `vergelijkmondzorg` tinyint(4) unsigned NOT NULL,
  `independer` tinyint(4) unsigned NOT NULL,
  `kliniekoverzicht` tinyint(4) unsigned NOT NULL,
  `own` tinyint(4) unsigned NOT NULL,
  `start` int(11) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `marked_as_read` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=717 DEFAULT CHARSET=utf8;

/*Data for the table `sent` */

insert  into `sent`(`id`,`users_id`,`title`,`name`,`sname`,`doctor`,`location`,`treatment`,`birth`,`email`,`date`,`last`,`status`,`stars`,`feedback`,`reply`,`reply_time`,`facebook`,`google`,`zorgkaart`,`telefoonboek`,`vergelijkmondzorg`,`independer`,`kliniekoverzicht`,`own`,`start`,`ip`,`marked_as_read`) values 
(1,1,'','','',0,0,'','','nickvandenberg31@me.com',1419606301,1419606380,2,3,'Dit is een testbericht.','Dit is een reply',0,0,0,0,0,0,0,0,0,0,'',0),
(2,12,'','','',0,0,'','','nickvandenberg31@me.com',1419607441,1419607653,2,4,'Thanks voor de fijne behandeling! Dit is een test.','',0,0,0,0,0,0,0,0,0,0,'',0),
(3,12,'','','',0,0,'','','nickvandenberg31@hotmail.com',1419608201,1419610996,2,4,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(5,12,'','','',0,0,'','','support@cloudrocket.co',1419608201,1419608525,2,2,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(6,1,'','','',0,0,'','','nickvandenberg31@me.com',1419610518,1419610542,2,3,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(7,12,'','','',0,0,'','','sales@cloudrocket.co',1419631721,1419631930,2,2,'Dit is een tweede testbericht.','',0,0,0,0,0,0,0,0,0,0,'',0),
(8,12,'','','',0,0,'','','hallo@cloudrocket.co',1419632064,1419632099,2,5,'Testbericht. Feedback voor de praktijk.','',0,0,0,0,0,0,0,0,0,0,'',0),
(10,1,'','','',0,0,'','','hallo@cloudrocket.co',1419632188,1419632323,2,5,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(13,1,'','','',0,0,'','','wmj_krusemann@hotmail.com',1419696703,1419697167,2,5,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(15,1,'','','',0,0,'','','hallo@cloudrocket.co',1419937138,1419942882,2,5,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(16,1,'','','',0,0,'','','support@cloudrocket.co',1419937138,1419937268,2,5,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(17,1,'','','',0,0,'','','nickvandenberg31@me.com',1419953770,1419953822,2,5,'Het was een prettige behandeling. Bedankt.','Geachte  4444444,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: [GOOGLE PROFIEL], [FACEBOOK PROFIEL], [ZORGKAART PROFIEL], [INDEPENDER PROFIEL].<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,0,'',0),
(60,1,'','','',0,0,'','','nickvandenberg31@me.com',1422203996,1422204075,2,5,'','',0,0,0,0,0,0,0,0,0,1422204048,'',0),
(21,1,'','','',0,0,'','','nickvandenberg31@me.com',1420465912,1420465934,2,2,'','',0,0,0,0,0,0,0,0,0,0,'',1),
(59,1,'','','',0,0,'','','deejayy@yandex.ua',1430650261,1430651818,2,3,'','',0,0,0,0,0,0,0,0,0,1430651818,'',0),
(58,1,'','','',0,0,'','','info@div-art.com',1422185759,1422185845,2,4,'','',0,0,0,0,0,0,0,0,0,1422185845,'',0),
(25,1,'','','',0,0,'','','nickvandenberg31@me.com',1420659505,1420660088,2,2,'De behandeling was slecht! Jullie hebben al mijn tanden eruit getrokken. Test','Vervelend om te horen.',0,0,0,0,0,0,0,0,0,0,'',0),
(26,1,'','','',0,0,'','','m.rahem@icloud.com',1420661296,1420661379,2,3,'','Hoi Mojda ,\n\nIk ben keihard aan \'t werk. Maar volgens mij werkt \'t nu redelijk goed.\n\nMet vriendelijke groet,\n\nNick, met rode ogen en hoofdpijn.',0,0,0,0,0,0,0,0,0,0,'',0),
(27,1,'','','',0,0,'','','nickvandenberg31@me.com',1420661358,1420803429,2,5,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(57,1,'','','',0,0,'','','nickvandenberg31@me.com',1422015740,1422015762,2,3,'','',0,0,0,0,0,0,0,0,0,1422015762,'',0),
(56,1,'','','',0,0,'','','nickvandenberg31@me.com',1421687506,1421687903,2,4,'','',0,0,0,0,0,0,0,0,0,1421687553,'',0),
(49,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1421320926,1421321058,2,1,'Volgende keer wat sneller aan de beurt zijn...','',0,0,0,0,0,0,0,0,0,1421320989,'',1),
(47,1,'','','',0,0,'','','nickvandenberg31@me.com',1420996720,1420996748,2,4,'','',0,0,0,0,0,0,0,0,0,1420996733,'',0),
(63,1,'','','',0,0,'','','support@cloudrocket.co',1422216221,1422216606,2,4,'','',0,0,0,0,0,0,0,0,0,1422216606,'',0),
(64,1,'','','',0,0,'','','nickvandenberg31@hotmail.com',1422216224,1422216597,2,5,'','',0,0,0,0,0,0,0,0,0,1422216597,'',0),
(65,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1422216313,1422216419,2,5,'','',0,0,0,0,0,0,0,0,0,1422216419,'',0),
(67,1,'','','',0,0,'','','nickvandenberg31@me.com',1422454661,1422454989,2,4,'','',0,0,0,0,0,0,0,0,0,1422454688,'',0),
(68,1,'','','',0,0,'','','deejayy@yandex.ua',1422511499,1422598782,2,3,'ewerwerwerwewewer','Geachte  44444,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">https://plus.google.com/+Cloudrocketsoftware/about</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,1,1,1,0,0,0,0,0,1422511519,'',0),
(69,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1422541035,1422541068,2,5,'','',0,0,1,0,0,0,0,0,0,1422541058,'',0),
(70,1,'','','',0,0,'','','info@woonzorgeindhoven.nl',1422559564,1422559695,2,5,'Hi jello bello','',0,0,0,0,0,0,0,0,0,1422559622,'',1),
(76,1,'','','',0,0,'','','support@cloudrocket.co',1422648950,1422649730,2,3,'','',0,0,0,0,0,0,0,0,0,1422649730,'',0),
(80,1,'','','',0,0,'','','deejayy@yandex.ua',1422790275,1422792756,2,4,'','',0,1,1,1,0,0,0,0,0,1422790289,'',0),
(81,1,'','Niek','Klaassen',0,0,'','','info@div-art.com',1422795320,1422795464,2,3,'','',0,1,0,0,0,0,0,0,0,1422795464,'',0),
(82,1,'','James','Jones',0,0,'','','deejayy@yandex.ua',1422795324,1422795439,2,2,'123','Beste  James Jones,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448881075,0,0,0,0,0,0,0,0,1422795432,'',0),
(83,1,'','Rick','Richardson',0,0,'','','div-art.com@yandex.ua',1422795327,1422795449,2,5,'123123123','Beste  Rick Richardson,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448881015,0,1,0,0,0,0,0,0,1422795445,'',0),
(85,1,'','','',0,0,'','','nickvandenberg31@me.com',1422833737,1422833946,2,5,'','',0,1,1,1,0,0,0,0,0,1422833830,'',0),
(86,1,'','Jan','de Groot',0,0,'','','hallo@cloudrocket.co',1422871196,1422893170,2,5,'','',0,0,0,0,0,0,0,0,0,1422893170,'',0),
(87,1,'','Nick','van den Berg',0,0,'','','nickvandenberg31@gmail.com',1422871201,1422871973,2,1,'','',0,0,0,0,0,0,0,0,0,1422871973,'',1),
(88,1,'','Wouter','Krusemann',0,0,'','','wmj_krusemann@hotmail.com',1422871205,1422871241,2,3,'','',0,0,0,0,0,0,0,0,0,1422871241,'',0),
(89,1,'','Rick','Janssen',0,0,'','','support@cloudrocket.co',1422871208,1422871707,2,3,'','',0,0,1,0,0,0,0,0,0,1422871547,'',0),
(136,1,'','','',0,0,'','','nickvandenberg31@me.com',1425857326,1425857341,2,3,'','',0,0,0,0,0,0,0,0,0,1425857341,'',0),
(135,1,'','','',0,0,'','','nickvandenberg31@me.com',1425424714,1425424755,2,4,'','',0,0,0,0,0,0,0,0,0,1425424755,'',0),
(95,1,'','','',0,0,'','','nickvandenberg31@me.com',1422960825,1422960945,2,4,'','',0,0,1,0,0,0,0,0,0,1422960856,'',0),
(97,1,'','','',0,0,'','','t.vanlieshout@online-retailer.nl',1422979658,1422979723,2,4,'','',0,0,0,0,0,0,0,0,0,1422979723,'',0),
(98,1,'','','',0,0,'','','nickvandenberg31@me.com',1422982711,1422982734,2,3,'','',0,0,0,0,0,0,0,0,0,1422982734,'',0),
(104,1,'','','',0,0,'','','wmj_krusemann@hotmail.com',1423254816,1423254931,2,1,'','',0,0,0,0,0,0,0,0,0,1423254917,'',1),
(105,1,'','','',0,0,'','','nickvandenberg31@me.com',1423263529,1423263581,2,4,'','',0,0,0,0,0,0,0,0,0,1423263581,'',0),
(106,1,'','','',0,0,'','','nickvandenberg31@me.com',1423264217,1423264468,2,1,'','',0,0,0,0,0,0,0,0,0,1423264468,'',1),
(108,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1423264223,1423264252,2,2,'','Beste   Test,\nTest \nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1449002576,0,0,0,0,0,0,0,0,1423264252,'',0),
(109,1,'','','',0,0,'','','nickvandenberg31@hotmail.com',1423264226,1423264310,2,2,'','Beste Nick,\n\nIk hoor graag wat er mis is gegaan.\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1449002568,0,0,0,0,0,0,0,0,1423264310,'',0),
(110,1,'','','',0,0,'','','development@cloudrocket.co',1423264229,1423264448,2,1,'','Beste  test ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1449001943,0,0,0,0,0,0,0,0,1423264448,'',0),
(112,1,'','','',0,0,'','','sales@cloudrocket.co',1423264234,1423264280,2,1,'','Beste   ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448881783,0,0,0,0,0,0,0,0,1423264280,'',0),
(113,1,'','','',0,0,'','','nickvandenberg31@me.com',1423588813,1423590884,2,3,'','',0,0,0,0,0,0,0,0,0,1423590884,'',0),
(134,1,'','','',0,0,'','','wmj_krusemann@hotmail.com',1430650261,1430660273,2,5,'','',0,0,0,0,0,0,0,0,0,1430660262,'',0),
(137,1,'','','',0,0,'','','nickvandenberg31@me.com',1426954364,1426954541,2,3,'','',0,0,0,1,0,0,0,0,0,1426954541,'',0),
(138,38,'','','',0,0,'','','deejayy@yandex.ua',1430650261,1430651396,2,4,'','',0,0,0,0,0,0,0,0,0,1430651396,'',0),
(139,38,'','','',0,0,'','','deejayy@yandex.ua',1430650261,1430651798,2,3,'','',0,0,0,0,0,0,0,0,0,1430651798,'',0),
(167,1,'','','',0,0,'','','deejayy@yandex.ua',1439449261,1439450326,2,2,'','Beste   ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448880900,0,0,0,0,0,0,0,0,1439450326,'',0),
(148,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1430135652,1430135992,2,5,'','',0,0,1,0,0,0,0,0,0,1430135992,'',0),
(149,1,'','','',0,0,'','','nickvandenberg31@me.com',1430299236,1430299347,2,5,'','',0,0,0,0,0,0,0,0,0,1430299283,'',0),
(153,1,'','','',0,0,'','','deejayy@yandex.ua',1430650261,1430651698,2,3,'','',0,0,0,0,0,0,0,0,0,1430651698,'',0),
(157,1,'','','',0,0,'','','deejayy@yandex.ua',1431419327,1431419368,2,4,'','',0,0,0,0,0,0,0,0,0,1431419368,'',0),
(161,1,'','','',0,0,'','','support@cloudrocket.co',1431620386,1431620446,2,4,'','',0,0,0,0,0,0,0,0,0,1431620438,'',0),
(168,1,'','','',0,0,'','','div-art.com@yandex.ua',1439449261,1439450297,2,4,'','',0,0,0,0,0,0,0,0,0,1439450297,'',0),
(169,1,'','Dan','Balan',2,0,'','','info@div-art.com',1438335400,1438335456,2,4,'','Geachte  Balan,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: [GOOGLE PROFIEL], <a href=\"\" target=\"_blank\">Facebook</a>, <a href=\"\" target=\"_blank\">Zorgkaart</a>, <a href=\"\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1438335456,'',0),
(170,1,'','','',0,0,'','','nickvandenberg31@me.com',1438352581,1438355886,2,2,'','Beste  Nickkie,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448881770,0,0,0,0,0,0,0,0,1438352683,'',0),
(174,1,'','','',0,0,'','','deejayy@yandex.ua',1439123685,1439124142,2,4,'','',0,1,0,0,0,0,0,0,0,1439124142,'',0),
(183,1,'','','',0,0,'','','nickvandenberg31@me.com',1439541351,1439541504,2,3,'','Geachte heer/mevrouw,,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,1,0,0,0,0,0,0,1439541504,'',0),
(182,1,'','','',0,0,'','','deejayy@yandex.ua',1439539890,1439539943,2,4,'','',0,0,0,0,0,0,0,0,0,1439539943,'',0),
(185,1,'Mr','John','Doe',3,0,'','','deejayy@yandex.ua',1440835403,1440835527,2,5,'','Geachte  Doe,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: [GOOGLE PROFIEL], <a href=\"\" target=\"_blank\">Facebook</a>, <a href=\"\" target=\"_blank\">Zorgkaart</a>, <a href=\"\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1440835527,'',0),
(186,1,'Mr','John','Doe',3,0,'','','deejayy@yandex.ua',1440841000,1440841039,2,5,'','assad\nasd\nasd\nasdasdasd\nsdffsdfsdssdf',0,0,0,0,0,0,0,0,0,1440841039,'',0),
(187,1,'','','',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(188,1,'','','',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(189,1,'','','',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(192,1,'','','',0,0,'','','',1441041947,1441041947,2,2,'','',0,0,0,0,0,0,0,0,0,1441041947,'188.0.66.89',0),
(193,1,'','','',3,0,'','','',1441043042,1441043042,2,2,'','',0,0,0,0,0,0,0,0,0,1441043042,'188.0.66.89',0),
(194,1,'','Nick','van den Berg',3,0,'','','nickvandenberg31@me.com',1442127661,1442427881,2,3,'','Hallo\n\nDit is een reactie op uw feedback.\nDit is een tweede regel.\n\nMvg,\n\nNick',0,0,0,0,0,0,0,0,0,1442427669,'',0),
(224,1,'','','',0,0,'','','info@div-art.com',1444978861,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(264,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(197,1,'','','',3,0,'','','info@div-art.com',1441179115,1441180807,2,1,'','asdasdasd\nasdasdasd\nsdas\nasdadasdasda\nasdadasd',0,0,0,0,0,0,0,0,0,1441179153,'',0),
(208,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1443772931,1443773010,2,4,'','zcxczxcz zxczxc zxc zxczczc',0,0,0,0,0,0,0,0,0,1443773010,'',0),
(199,1,'Dhr.','Nick','van den Berg',3,0,'','','nickvandenberg31@me.com',1441471396,1441471943,2,5,'','Test',0,1,0,1,0,0,0,0,0,1441471503,'',0),
(200,1,'Mevr.','Mojda','Rahem',0,0,'','','m.rahem@icloud.com',1446969661,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(201,1,'Dhr.','Rick','Janssen',0,0,'','','hallo@cloudrocket.co',1446278462,1446286141,2,4,'','Geachte  Janssen,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1446286132,'',0),
(204,1,'','Nick','van den Berg',3,0,'','','nickvandenberg31@me.com',1442225584,1442229421,2,2,'','Test',0,0,0,0,0,0,0,0,0,1442225846,'',0),
(205,1,'','Nick','van den Berg',0,0,'','','nickvandenberg31@me.com',1447056061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(206,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1442337439,1442337505,2,4,'','Test reply',0,0,0,0,0,0,0,0,0,1442337505,'',0),
(209,1,'','','',0,0,'','','',1443777169,1443777169,2,3,'','',0,0,0,0,0,0,0,0,0,1443777169,'176.105.194.168',0),
(349,1,'','','',0,0,'','','deejayy@yandex.ua',1446629725,1446630938,2,2,'','Beste   ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448880762,0,0,0,0,0,0,0,0,1446630917,'',0),
(328,1,'','','',0,0,'','','info@div-art.com',1444912100,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(215,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1443849062,1443851340,2,3,'','Test',0,1,1,1,0,0,0,0,0,1443851340,'',0),
(216,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1443850147,1443873791,2,4,'','Hallo',0,0,0,0,0,0,0,0,0,1443873791,'',0),
(217,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(218,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(220,1,'','','',0,0,'','','info@div-art.com',1443851836,1443851958,2,4,'','',0,0,0,0,0,0,0,0,0,1443851958,'',0),
(221,1,'','','',0,0,'','','info@div-art.com',1443852167,1443853321,2,4,'','',0,0,0,0,0,0,0,0,0,1443853321,'',0),
(222,1,'','','',0,0,'','','',1443854768,1443854843,2,2,'','',0,0,0,0,0,0,0,0,0,1443854768,'188.0.76.192',0),
(329,1,'','','',0,0,'','','info@div-art.com',1444912180,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(330,1,'','','',0,0,'','','deejayy@yandex.ua',1444923141,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(225,1,'','','',0,0,'','','info@div-art.com',1443864705,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(226,1,'','','',0,0,'','','info@div-art.com',1443864810,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(263,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(228,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1443872917,1443873412,2,3,'','Test2',0,0,0,0,0,0,0,0,0,1443873412,'',0),
(229,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(230,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892461,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(232,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(233,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(234,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(235,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(257,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(258,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(260,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(261,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(256,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(255,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(239,1,'','','',0,0,'','','info@div-art.com',1443875352,1443875390,2,3,'','zfsdfsdfsfsf',0,0,0,0,0,0,0,0,0,1443875390,'',0),
(240,1,'','','',0,0,'','','info@div-art.com',1443876871,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(254,1,'Mr','John','Doe',0,0,'','','deejayy@yandex.ua',1444719661,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(253,1,'','','',0,0,'','','deejayy@yandex.ua',1444978861,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(252,61,'','','',0,0,'','','nickvandenberg31@me.com',1444227481,1444227528,2,4,'','Testbefwege',0,0,0,1,0,0,0,0,0,1444227519,'',0),
(251,1,'','','',0,0,'','','deejayy@yandex.ua',1444225768,1444225873,3,4,'','',0,0,0,0,0,0,0,0,0,1444225873,'',0),
(259,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444806061,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(245,61,'','','',0,0,'','','info@cloudrocket.co',1443890488,1443899364,3,3,'','',0,0,0,0,0,0,0,0,0,1443899364,'',0),
(246,1,'','Nick','van den Berg',0,0,'','','nickvandenberg31@me.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(247,1,'','Nick','van den Berg',0,0,'','','nickvandenberg31@me.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(248,1,'','Nick','van den Berg',0,0,'','','nickvandenberg31@me.com',1443902534,1443903702,2,3,'','fsdfsdfsdf',0,0,0,0,0,0,0,0,0,1443903702,'',0),
(265,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(266,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(267,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(268,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(269,61,'','','',0,0,'','','nickvandenberg31@me.com',1444557953,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(270,61,'','','',0,0,'','','info@cloudrocket.co',1447056061,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(271,61,'','','',0,0,'','','',1444558062,1444558735,2,4,'','',0,0,0,0,0,0,0,0,0,1444558062,'83.117.219.115',0),
(272,61,'Dhr','Nick','van den Berg',0,0,'','','nickvandenberg31@me.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(273,61,'','','',0,0,'','','nickvandenberg31@gmail.com',1447056061,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(274,1,'','','',0,0,'','','nickvandenberg31@me.com',1444564399,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(275,1,'Mr','John','Doe',3,0,'','','info@div-art.com',1444576088,1444576752,2,3,'','Geachte  Doe,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1444576561,'',0),
(276,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444892462,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(277,1,'','','',0,0,'','','info@div-art.com',1444576816,1444576858,3,3,'','',0,0,0,0,0,0,0,0,0,1444576858,'',0),
(278,61,'','','',0,0,'','','info@cloudrocket.co',1444579225,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(279,61,'Dhr','Nick','van den Berg',0,0,'','','nickvandenberg31@gmail.com',1444579248,1444579560,2,2,'Ik ben ontvoerden.','Dat is niet zo mooi Nick.\n\nGr,\n\nNick.',0,0,1,1,0,0,0,0,0,1444579281,'',0),
(280,61,'','','',0,0,'','','nickvandenberg31@hotmail.com',1447056061,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(281,1,'','','',0,0,'','','deejayy@yandex.ua',1444637261,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(282,1,'','','',0,0,'','','deejayy@yandex.ua',1444650150,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(283,1,'','','',0,0,'','','deejayy@yandex.ua',1444650292,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(284,1,'','','',0,0,'','','deejayy@yandex.ua',1444650511,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(285,1,'','','',0,0,'','','deejayy@yandex.ua',1444650723,1444650753,3,4,'','',0,0,0,0,0,0,0,0,0,1444650753,'',0),
(286,1,'','','',0,0,'','','deejayy@yandex.ua',1444651550,1444651606,3,0,'','',0,0,0,0,0,0,0,0,0,1444651606,'',0),
(287,1,'','','',0,0,'','','deejayy@yandex.ua',1444651656,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(288,1,'','','',0,0,'','','deejayy@yandex.ua',1444651709,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(289,61,'','','',0,0,'','','nickvandenberg31@me.com',1444655764,1444655788,2,3,'','',0,0,0,0,0,0,0,0,0,1444655784,'',0),
(290,1,'','','',0,0,'','','nickvandenberg31@me.com',1444745971,1444749081,3,0,'','',0,0,0,0,0,0,0,0,0,1444749081,'',0),
(291,61,'','','',0,0,'','','nickvandenberg31@me.com',1444746137,1444746172,3,5,'','',0,0,0,0,0,0,0,0,0,1444746172,'',0),
(292,61,'','','',0,0,'','','',1444746677,1444746677,2,3,'','',0,0,0,0,0,0,0,0,0,1444746677,'188.207.110.48',0),
(293,61,'Dhr.','Nick','van den Berg',0,0,'','','nickvandenberg31@gmail.com',1444753075,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(294,61,'Dhr.','Nick','van den Berg',0,0,'','','nickvandenberg31@gmail.com',1444753174,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(295,1,'','','',3,0,'','','',1444754975,1444754985,2,2,'','',0,0,0,0,0,0,0,0,0,1444754975,'5.1.29.57',0),
(296,1,'','','',0,0,'','','',1444755080,1444908838,2,2,'Testing','',0,0,0,0,0,0,0,0,0,1444755080,'5.1.29.57',0),
(297,1,'','','',0,0,'','','info@div-art.com',1444756122,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(298,1,'','','',0,0,'','','info@div-art.com',1444756501,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(299,1,'','','',0,0,'','','deejayy@yandex.ua',1444757131,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(300,1,'','','',0,0,'','','info@div-art.com',1444757487,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(301,1,'','','',0,0,'','','deejayy@yandex.ua',1444758482,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(302,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444758611,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(303,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444758611,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(304,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444759261,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(305,1,'Mr','Test','Last',0,0,'','','div-art.com@outlook.com',1444759261,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(306,61,'Dhr.','Nick','van den Berg',0,0,'','','nickvandenberg31@gmail.com',1444759617,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(307,61,'','','',0,0,'','','nickvandenberg31@me.com',1444759716,1444759837,2,5,'','Bedankt!',0,0,0,0,0,0,0,0,0,1444759820,'',0),
(308,61,'','','',0,0,'','','nickvandenberg31@me.com',1444759855,1444760060,2,2,'Ik ben niet goed behandeld.','Laten we erover in gesprek gaan.',0,0,0,0,0,0,0,0,0,1444759886,'',0),
(309,61,'','','',0,0,'','','nickvandenberg31@me.com',1444760130,1444760178,2,2,'nickvandenberg31@me.com','Test',0,0,0,0,0,0,0,0,0,1444760164,'',0),
(310,1,'Dhr.','Nick','van den Berg',3,0,'','','nickvandenberg31@gmail.com',1444760581,1444760722,2,2,'Ik vond het niet prettig.','Oke.',0,0,0,0,0,0,0,0,0,1444760708,'',0),
(311,1,'','','',0,0,'','','nickvandenberg31@me.com',1444760912,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(321,1,'','','',0,0,'','','info@div-art.com',1444771108,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(322,1,'','','',0,0,'','','info@div-art.com',1444771285,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(323,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1444771319,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(350,88,'','','',0,0,'','','nickvandenberg31@gmail.com',1447266213,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(325,1,'','','',0,0,'','','nickvandenberg31@me.com',1444772837,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(326,1,'','','',0,0,'','','nickvandenberg31@me.com',1444773100,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(327,1,'','','',0,0,'','','',1444773228,1444774281,2,2,'','',0,0,0,0,0,0,0,0,0,1444773228,'83.117.219.115',0),
(348,61,'','','',0,0,'','','nickvandenberg31@me.com',1446132173,1446132253,3,5,'','',0,0,0,0,0,0,0,0,0,1446132253,'',0),
(347,1,'','','',0,0,'','','info@div-art.com',1446045150,1446045742,2,3,'','',0,0,0,0,0,0,0,0,0,1446045211,'',0),
(346,1,'','','',0,0,'','','info@div-art.com',1447056061,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(345,1,'','','',0,0,'','','info@div-art.com',1446038967,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(344,1,'Mr','John','Doe',0,0,'','','info@div-art.com',1445424542,1445425311,2,2,'','Beste Mr John Doe,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448880659,0,0,0,0,0,0,0,0,1445425306,'',0),
(343,85,'','','',0,0,'','','nickvandenberg31@me.com',1445195284,1445195310,3,3,'','',0,0,0,0,0,0,0,0,0,1445195310,'',0),
(342,61,'','','',0,0,'','','hallo@cloudrocket.co',1445097186,1445097230,3,4,'','',0,0,0,1,0,0,0,0,0,1445097230,'',0),
(351,88,'','','',0,0,'','','',1447327983,1447327983,2,2,'','',0,0,0,0,0,0,0,0,0,1447327983,'83.117.219.115',0),
(352,88,'','','',0,0,'','','hallo@cloudrocket.co',1447329233,1447329280,2,3,'','',0,0,0,0,0,0,0,0,0,1447329270,'',0),
(353,88,'','','',0,0,'','','hallo@cloudrocket.co',1447329385,1447329440,3,2,'','',0,0,0,0,0,0,0,0,0,1447329440,'',0),
(354,1,'','','',0,0,'','','deejayy@yandex.ua',1447332847,1447334219,2,5,'','11111111111,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1447332886,'',0),
(355,88,'','','',0,0,'','','hallo@cloudrocket.co',1447336091,1447336267,2,3,'','',0,0,0,0,0,0,0,0,0,1447336259,'',0),
(356,88,'','','',0,0,'','','info@div-art.com',1447336342,1447337069,2,2,'','',0,0,0,0,0,0,0,0,0,1447337069,'',0),
(357,88,'','','',0,0,'','','development@cloudrocket.co',1447336351,1447679777,2,0,'','',0,0,0,0,0,0,0,0,0,1447679772,'',0),
(358,1,'','','',0,0,'','','nickvandenberg31@me.com',1447337276,1447338019,2,0,'','',0,0,0,0,0,0,0,0,0,1447337907,'',0),
(359,1,'','','',0,0,'','','deejayy@yandex.ua',1447680276,1447680506,2,4,'','',0,0,0,0,0,0,0,0,0,1447680480,'',0),
(360,1,'','','',0,0,'','','hallo@cloudrocket.co',1447686492,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(361,1,'','','',0,0,'','','nickvandenberg31@me.com',1447686540,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(362,1,'','','',0,0,'','','development@cloudrocket.co',1447686561,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(363,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1447687013,1447687056,2,2,'','Beste   ,\n\nBedankt voor je reactie.\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1448880443,0,0,0,0,0,0,0,0,1447687046,'',0),
(364,1,'','','',0,0,'','','deejayy@yandex.ua',1448276837,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(365,1,'Mr','Test','Test',0,0,'','','deejayy@yandex.ua',1448277600,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(366,1,'Mr','TT','HH',0,0,'','','info@div-art.com',1448277600,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(367,1,'Mr','Test','Test',0,0,'','','deejayy@yandex.ua',1448277802,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(368,1,'Mr','TT','HH',0,0,'','','info@div-art.com',1448277802,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(369,1,'Mr','TT','HH',0,0,'','','info@div-art.com',1448277946,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(370,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1448279756,1448281220,2,4,'','Geachte  Geachte heer/mevrouw,,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,0,0,0,1448281217,'',0),
(371,1,'','','',0,0,'','','development@cloudrocket.co',1448373992,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(372,1,'','','',0,0,'','','nickvandenberg31@gmail.com',1448374055,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(373,1,'mevr.','Test','Achternaam',0,0,'','','hallo@cloudrocket.co',1448374891,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(374,1,'','','',0,0,'','','deejayy@yandex.ua',1448461245,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(375,1,'','','',0,0,'','','development@cloudrocket.co',1448811088,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(376,1,'','','',0,0,'','','deejayy@yandex.ua',1448866993,1451231723,2,4,'','',0,0,0,0,0,0,0,0,0,1451231721,'',0),
(377,1,'Dhr.','Nick','van den Berg',0,0,'','t34437','nickvandenberg31@me.com',1448882472,1448882712,2,4,'','Geachte  van den Berg,<br /><br />We willen u bij deze bedanken voor de gegeven beoordeling. We gebruiken de beoordelingen van onze patiënten om de kwaliteit van de praktijk te verbeteren. Uw beoordeling is daarbij van groot belang.<br /><br />Als u de beoordeling nog niet aan anderen heeft doorverteld, zou u dat dan alsnog willen doen? Het kost slechts enkele minuten en u zou ons er erg mee helpen. U kunt ons beoordelen op: <a href=\"https://plus.google.com/+Cloudrocketsoftware/about\" target=\"_blank\">Google</a>, <a href=\"https://www.facebook.com/woonzorgeindhoven\" target=\"_blank\">Facebook</a>, <a href=\"https://www.zorgkaartnederland.nl/zorginstelling/woonvoorziening-voor-verstandelijk-gehandicapten-woonzorg-eindhoven-eindhoven-3058716\" target=\"_blank\">Zorgkaart</a>, <a href=\"http://www.telefoonboek.nl/bedrijven/t3062478/heerhugowaard/fysiotherapie-butterhuizen/\" target=\"_blank\">Telefoonboek</a>, <a href=\"https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx\" target=\"_blank\">Independer</a>, <a href=\"http://div-art.com\" target=\"_blank\">Onze website beoordelen</a>.<br /><br />Met vriendelijke groet,<br /><br />Fysiotherapeut Marendijk',0,0,0,0,0,0,1,0,0,1448882707,'',0),
(378,1,'Mr','Dan','Daniels',0,0,'','04-05-1987','deejayy@yandex.ua',1448895465,1448895650,2,4,'','Beste Mr Dan Daniels,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1449002523,0,0,0,0,0,1,0,0,1448895647,'',0),
(379,85,'','','',0,0,'','','nickvandenberg31@me.com',1449603261,1449603532,2,3,'','',0,0,0,0,0,0,1,0,0,1449603529,'',0),
(380,85,'','','',0,0,'','05-07-59','development@cloudrocket.co',1449686221,1449687094,2,4,'','',0,0,0,0,0,0,1,0,0,1449687090,'',0),
(381,85,'','','',0,0,'','05-07-59','development@cloudrocket.co',1449686625,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(383,1,'','Wim van Oort (17-09-1967)','',0,0,'','','wvanoort@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(384,1,'','Wendy Prinsen (17-10-1977)','',0,0,'','','debereboot@hotmail.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(385,1,'','W. Rovers-van Heesch (12-09-1948)','',0,0,'','','adsl698684@tiscali.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(386,1,'','M.J.F.A. van Lent (10-12-1972)','',0,0,'','','radioblackout@live.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(387,1,'','H.W.M. van der Lee (06-01-1971)','',0,0,'','','famvanderlee@ziggo.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(388,1,'','L.H. Gerrits (29-08-1957)','',0,0,'','','gerrits.lh@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(389,1,'','Femke Schapendonk (03-04-2002)','',0,0,'','','nancy.schapendonk@ziggo.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(390,1,'','Johnny Pronk (27-06-1989)','',0,0,'','','johnny_pronk@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(391,1,'','H. Reinders (04-09-1970)','',0,0,'','','henkreinders@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(392,1,'','Peter van Prooijen (03-10-1973)','',0,0,'','','peter.prooijen@versatel.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(393,1,'','Mieke Weterings (08-08-1982)','',0,0,'','','mieke_weterings@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(394,1,'','A.J.P. Steenbergen (15-06-1960)','',0,0,'','','asteenbergen@kabelfoon.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(395,1,'','Patrick Molenaar (11-04-1973)','',0,0,'','','pr_molenaar@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(396,1,'','G.H.M. Schoonenberg (02-07-1954)','',0,0,'','','cgschoonenberg@xs4all.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(397,1,'','Saskia van Erp (16-04-1967)','',0,0,'','','info@studiovitaloss.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(398,1,'','Bas Janssen (15-06-1971)','',0,0,'','','stojo.janssen@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(399,1,'','J.J. van den Berg (18-08-1945)','',0,0,'','','jannie.vd.berg@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(400,1,'','Wes de Loijer (26-01-2007)','',0,0,'','','m.summeren@zonnet.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(401,1,'','Hans Mulder (08-12-1945)','',0,0,'','','hansmulder@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(402,1,'','H.H. Stultiens (23-03-1950)','',0,0,'','','h.stultiens@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(403,1,'','Marcel van Dinther (19-04-1983)','',0,0,'','','vandinther@live.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(404,1,'','Y.M. van Engeland (06-11-1968)','',0,0,'','','vanengeland2@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(405,1,'','Marc Ophoff (27-10-1969)','',0,0,'','','dleijtens@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(406,1,'','M.T.A.J. Duffhues (31-08-1970)','',0,0,'','','rianne.duffhues@ziggo.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(407,1,'','J.L.H. van der Heijden (15-05-1931)','',0,0,'','','vanderheijdenr@telfort.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(408,1,'','S.C.M. Tuerlings (06-10-1940)','',0,0,'','','fieketuerlings@ziggo.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(409,1,'','Sjoerd de Bijl (27-08-1999)','',0,0,'','','daisydebijl@live.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(410,1,'','Linda van Erp (22-07-1990)','',0,0,'','','lindavanerp@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(411,1,'','Lichelle Janssen (21-06-1993)','',0,0,'','','lichelle__x@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(412,1,'','Medina Osmanovic (02-04-1982)','',0,0,'','','mosmanovic02@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(413,1,'','G. van Deursen (06-04-1958)','',0,0,'','','beamer@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(414,1,'','Marjoleine van Bruchem (18-08-1981)','',0,0,'','','marjoleine1981@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(415,1,'','M.J.H. de Klein (21-03-1970)','',0,0,'','','marcodeklein@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(416,1,'','M. Coolen (30-11-1962)','',0,0,'','','a.coolen@hotmail.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(417,1,'','J.A.S. Beljon (20-06-1944)','',0,0,'','','jben@beljon.net',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(418,1,'','Richard Tamminga (09-01-1975)','',0,0,'','','marousjka_slaats@msn.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(419,1,'','W.P.J. Bross (21-09-1967)','',0,0,'','','a.kortrink@kpnplanet.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(420,1,'','W.P.M. Smits (27-11-1949)','',0,0,'','','geen1@mail.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(421,1,'','J.H van Heeswijk (06-09-1957)','',0,0,'','','jh.kupers@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(422,1,'','J.C Klösters (12-08-1949)','',0,0,'','','m.klosters@kpnmail.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(423,1,'','J.M. Ultzen (05-08-1966)','',0,0,'','','jm.ultzen@hccnet.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(424,1,'','J.G.M. de Groot (26-06-1955)','',0,0,'','','jgmvdlinden@hotmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(425,1,'','Damian Munster (04-07-1997)','',0,0,'','','ddmontage@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(426,1,'','Marjon Modderman (10-01-1963)','',0,0,'','','modderman.m@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(427,1,'','A. Lauzon (05-08-1960)','',0,0,'','','driss48@live.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(428,1,'','Tamara Meijer (18-09-1973)','',0,0,'','','tamaraozan@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(429,1,'','R.V. Versteegh (18-01-1984)','',0,0,'','','rvversteegh@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(430,1,'','Gerard Broeders (11-06-1966)','',0,0,'','','gerbroeders@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(431,1,'','J.E.M. Timmermans (04-11-1961)','',0,0,'','','annelies.timmermans@home.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(432,1,'','E.W. van Tongeren-Meijerman (27-04-1956)','',0,0,'','','ew.van.tongeren@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(433,1,'','Josephine Coers (15-07-1998)','',0,0,'','','josephinecoers@yahoo.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(434,1,'','Don de Reuver (06-07-1991)','',0,0,'','','dondereuver@gmail.com',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(435,1,'','J. van Hees de Reuver (15-04-1953)','',0,0,'','','hees.w@hotmail.nl',1451229730,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(436,1,'','Wim van Oort (17-09-1967)','',0,0,'','','wvanoort@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(437,1,'','Wendy Prinsen (17-10-1977)','',0,0,'','','debereboot@hotmail.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(438,1,'','W. Rovers-van Heesch (12-09-1948)','',0,0,'','','adsl698684@tiscali.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(439,1,'','M.J.F.A. van Lent (10-12-1972)','',0,0,'','','radioblackout@live.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(440,1,'','H.W.M. van der Lee (06-01-1971)','',0,0,'','','famvanderlee@ziggo.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(441,1,'','L.H. Gerrits (29-08-1957)','',0,0,'','','gerrits.lh@gmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(442,1,'','Femke Schapendonk (03-04-2002)','',0,0,'','','nancy.schapendonk@ziggo.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(443,1,'','Johnny Pronk (27-06-1989)','',0,0,'','','johnny_pronk@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(444,1,'','H. Reinders (04-09-1970)','',0,0,'','','henkreinders@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(445,1,'','Peter van Prooijen (03-10-1973)','',0,0,'','','peter.prooijen@versatel.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(446,1,'','Mieke Weterings (08-08-1982)','',0,0,'','','mieke_weterings@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(447,1,'','A.J.P. Steenbergen (15-06-1960)','',0,0,'','','asteenbergen@kabelfoon.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(448,1,'','Patrick Molenaar (11-04-1973)','',0,0,'','','pr_molenaar@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(449,1,'','G.H.M. Schoonenberg (02-07-1954)','',0,0,'','','cgschoonenberg@xs4all.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(450,1,'','Saskia van Erp (16-04-1967)','',0,0,'','','info@studiovitaloss.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(451,1,'','Bas Janssen (15-06-1971)','',0,0,'','','stojo.janssen@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(452,1,'','J.J. van den Berg (18-08-1945)','',0,0,'','','jannie.vd.berg@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(453,1,'','Wes de Loijer (26-01-2007)','',0,0,'','','m.summeren@zonnet.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(454,1,'','Hans Mulder (08-12-1945)','',0,0,'','','hansmulder@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(455,1,'','H.H. Stultiens (23-03-1950)','',0,0,'','','h.stultiens@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(456,1,'','Marcel van Dinther (19-04-1983)','',0,0,'','','vandinther@live.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(457,1,'','Y.M. van Engeland (06-11-1968)','',0,0,'','','vanengeland2@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(458,1,'','Marc Ophoff (27-10-1969)','',0,0,'','','dleijtens@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(459,1,'','M.T.A.J. Duffhues (31-08-1970)','',0,0,'','','rianne.duffhues@ziggo.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(460,1,'','J.L.H. van der Heijden (15-05-1931)','',0,0,'','','vanderheijdenr@telfort.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(461,1,'','S.C.M. Tuerlings (06-10-1940)','',0,0,'','','fieketuerlings@ziggo.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(462,1,'','Sjoerd de Bijl (27-08-1999)','',0,0,'','','daisydebijl@live.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(463,1,'','Linda van Erp (22-07-1990)','',0,0,'','','lindavanerp@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(464,1,'','Lichelle Janssen (21-06-1993)','',0,0,'','','lichelle__x@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(465,1,'','Medina Osmanovic (02-04-1982)','',0,0,'','','mosmanovic02@gmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(466,1,'','G. van Deursen (06-04-1958)','',0,0,'','','beamer@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(467,1,'','Marjoleine van Bruchem (18-08-1981)','',0,0,'','','marjoleine1981@gmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(468,1,'','M.J.H. de Klein (21-03-1970)','',0,0,'','','marcodeklein@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(469,1,'','M. Coolen (30-11-1962)','',0,0,'','','a.coolen@hotmail.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(470,1,'','J.A.S. Beljon (20-06-1944)','',0,0,'','','jben@beljon.net',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(471,1,'','Richard Tamminga (09-01-1975)','',0,0,'','','marousjka_slaats@msn.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(472,1,'','W.P.J. Bross (21-09-1967)','',0,0,'','','a.kortrink@kpnplanet.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(473,1,'','W.P.M. Smits (27-11-1949)','',0,0,'','','geen1@mail.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(474,1,'','J.H van Heeswijk (06-09-1957)','',0,0,'','','jh.kupers@gmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(475,1,'','J.C Klösters (12-08-1949)','',0,0,'','','m.klosters@kpnmail.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(476,1,'','J.M. Ultzen (05-08-1966)','',0,0,'','','jm.ultzen@hccnet.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(477,1,'','J.G.M. de Groot (26-06-1955)','',0,0,'','','jgmvdlinden@hotmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(478,1,'','Damian Munster (04-07-1997)','',0,0,'','','ddmontage@home.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(479,1,'','Marjon Modderman (10-01-1963)','',0,0,'','','modderman.m@gmail.com',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(480,1,'','A. Lauzon (05-08-1960)','',0,0,'','','driss48@live.nl',1451230049,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(481,1,'','Tamara Meijer (18-09-1973)','',0,0,'','','tamaraozan@home.nl',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(482,1,'','R.V. Versteegh (18-01-1984)','',0,0,'','','rvversteegh@gmail.com',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(483,1,'','Gerard Broeders (11-06-1966)','',0,0,'','','gerbroeders@gmail.com',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(484,1,'','J.E.M. Timmermans (04-11-1961)','',0,0,'','','annelies.timmermans@home.nl',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(485,1,'','E.W. van Tongeren-Meijerman (27-04-1956)','',0,0,'','','ew.van.tongeren@gmail.com',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(486,1,'','Josephine Coers (15-07-1998)','',0,0,'','','josephinecoers@yahoo.com',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(487,1,'','Don de Reuver (06-07-1991)','',0,0,'','','dondereuver@gmail.com',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(488,1,'','J. van Hees de Reuver (15-04-1953)','',0,0,'','','hees.w@hotmail.nl',1451230050,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(489,1,'','Wim van Oort (17-09-1967)','',0,0,'','','wvanoort@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(490,1,'','Wendy Prinsen (17-10-1977)','',0,0,'','','debereboot@hotmail.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(491,1,'','W. Rovers-van Heesch (12-09-1948)','',0,0,'','','adsl698684@tiscali.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(492,1,'','M.J.F.A. van Lent (10-12-1972)','',0,0,'','','radioblackout@live.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(493,1,'','H.W.M. van der Lee (06-01-1971)','',0,0,'','','famvanderlee@ziggo.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(494,1,'','L.H. Gerrits (29-08-1957)','',0,0,'','','gerrits.lh@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(495,1,'','Femke Schapendonk (03-04-2002)','',0,0,'','','nancy.schapendonk@ziggo.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(496,1,'','Johnny Pronk (27-06-1989)','',0,0,'','','johnny_pronk@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(497,1,'','H. Reinders (04-09-1970)','',0,0,'','','henkreinders@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(498,1,'','Peter van Prooijen (03-10-1973)','',0,0,'','','peter.prooijen@versatel.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(499,1,'','Mieke Weterings (08-08-1982)','',0,0,'','','mieke_weterings@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(500,1,'','A.J.P. Steenbergen (15-06-1960)','',0,0,'','','asteenbergen@kabelfoon.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(501,1,'','Patrick Molenaar (11-04-1973)','',0,0,'','','pr_molenaar@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(502,1,'','G.H.M. Schoonenberg (02-07-1954)','',0,0,'','','cgschoonenberg@xs4all.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(503,1,'','Saskia van Erp (16-04-1967)','',0,0,'','','info@studiovitaloss.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(504,1,'','Bas Janssen (15-06-1971)','',0,0,'','','stojo.janssen@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(505,1,'','J.J. van den Berg (18-08-1945)','',0,0,'','','jannie.vd.berg@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(506,1,'','Wes de Loijer (26-01-2007)','',0,0,'','','m.summeren@zonnet.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(507,1,'','Hans Mulder (08-12-1945)','',0,0,'','','hansmulder@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(508,1,'','H.H. Stultiens (23-03-1950)','',0,0,'','','h.stultiens@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(509,1,'','Marcel van Dinther (19-04-1983)','',0,0,'','','vandinther@live.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(510,1,'','Y.M. van Engeland (06-11-1968)','',0,0,'','','vanengeland2@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(511,1,'','Marc Ophoff (27-10-1969)','',0,0,'','','dleijtens@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(512,1,'','M.T.A.J. Duffhues (31-08-1970)','',0,0,'','','rianne.duffhues@ziggo.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(513,1,'','J.L.H. van der Heijden (15-05-1931)','',0,0,'','','vanderheijdenr@telfort.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(514,1,'','S.C.M. Tuerlings (06-10-1940)','',0,0,'','','fieketuerlings@ziggo.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(515,1,'','Sjoerd de Bijl (27-08-1999)','',0,0,'','','daisydebijl@live.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(516,1,'','Linda van Erp (22-07-1990)','',0,0,'','','lindavanerp@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(517,1,'','Lichelle Janssen (21-06-1993)','',0,0,'','','lichelle__x@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(518,1,'','Medina Osmanovic (02-04-1982)','',0,0,'','','mosmanovic02@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(519,1,'','G. van Deursen (06-04-1958)','',0,0,'','','beamer@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(520,1,'','Marjoleine van Bruchem (18-08-1981)','',0,0,'','','marjoleine1981@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(521,1,'','M.J.H. de Klein (21-03-1970)','',0,0,'','','marcodeklein@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(522,1,'','M. Coolen (30-11-1962)','',0,0,'','','a.coolen@hotmail.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(523,1,'','J.A.S. Beljon (20-06-1944)','',0,0,'','','jben@beljon.net',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(524,1,'','Richard Tamminga (09-01-1975)','',0,0,'','','marousjka_slaats@msn.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(525,1,'','W.P.J. Bross (21-09-1967)','',0,0,'','','a.kortrink@kpnplanet.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(526,1,'','W.P.M. Smits (27-11-1949)','',0,0,'','','geen1@mail.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(527,1,'','J.H van Heeswijk (06-09-1957)','',0,0,'','','jh.kupers@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(528,1,'','J.C Klösters (12-08-1949)','',0,0,'','','m.klosters@kpnmail.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(529,1,'','J.M. Ultzen (05-08-1966)','',0,0,'','','jm.ultzen@hccnet.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(530,1,'','J.G.M. de Groot (26-06-1955)','',0,0,'','','jgmvdlinden@hotmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(531,1,'','Damian Munster (04-07-1997)','',0,0,'','','ddmontage@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(532,1,'','Marjon Modderman (10-01-1963)','',0,0,'','','modderman.m@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(533,1,'','A. Lauzon (05-08-1960)','',0,0,'','','driss48@live.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(534,1,'','Tamara Meijer (18-09-1973)','',0,0,'','','tamaraozan@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(535,1,'','R.V. Versteegh (18-01-1984)','',0,0,'','','rvversteegh@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(536,1,'','Gerard Broeders (11-06-1966)','',0,0,'','','gerbroeders@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(537,1,'','J.E.M. Timmermans (04-11-1961)','',0,0,'','','annelies.timmermans@home.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(538,1,'','E.W. van Tongeren-Meijerman (27-04-1956)','',0,0,'','','ew.van.tongeren@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(539,1,'','Josephine Coers (15-07-1998)','',0,0,'','','josephinecoers@yahoo.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(540,1,'','Don de Reuver (06-07-1991)','',0,0,'','','dondereuver@gmail.com',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(541,1,'','J. van Hees de Reuver (15-04-1953)','',0,0,'','','hees.w@hotmail.nl',1451230137,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(542,1,'','Wim van Oort (17-09-1967)','',0,0,'','','wvanoort@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(543,1,'','Wendy Prinsen (17-10-1977)','',0,0,'','','debereboot@hotmail.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(544,1,'','W. Rovers-van Heesch (12-09-1948)','',0,0,'','','adsl698684@tiscali.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(545,1,'','M.J.F.A. van Lent (10-12-1972)','',0,0,'','','radioblackout@live.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(546,1,'','H.W.M. van der Lee (06-01-1971)','',0,0,'','','famvanderlee@ziggo.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(547,1,'','L.H. Gerrits (29-08-1957)','',0,0,'','','gerrits.lh@gmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(548,1,'','Femke Schapendonk (03-04-2002)','',0,0,'','','nancy.schapendonk@ziggo.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(549,1,'','Johnny Pronk (27-06-1989)','',0,0,'','','johnny_pronk@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(550,1,'','H. Reinders (04-09-1970)','',0,0,'','','henkreinders@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(551,1,'','Peter van Prooijen (03-10-1973)','',0,0,'','','peter.prooijen@versatel.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(552,1,'','Mieke Weterings (08-08-1982)','',0,0,'','','mieke_weterings@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(553,1,'','A.J.P. Steenbergen (15-06-1960)','',0,0,'','','asteenbergen@kabelfoon.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(554,1,'','Patrick Molenaar (11-04-1973)','',0,0,'','','pr_molenaar@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(555,1,'','G.H.M. Schoonenberg (02-07-1954)','',0,0,'','','cgschoonenberg@xs4all.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(556,1,'','Saskia van Erp (16-04-1967)','',0,0,'','','info@studiovitaloss.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(557,1,'','Bas Janssen (15-06-1971)','',0,0,'','','stojo.janssen@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(558,1,'','J.J. van den Berg (18-08-1945)','',0,0,'','','jannie.vd.berg@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(559,1,'','Wes de Loijer (26-01-2007)','',0,0,'','','m.summeren@zonnet.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(560,1,'','Hans Mulder (08-12-1945)','',0,0,'','','hansmulder@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(561,1,'','H.H. Stultiens (23-03-1950)','',0,0,'','','h.stultiens@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(562,1,'','Marcel van Dinther (19-04-1983)','',0,0,'','','vandinther@live.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(563,1,'','Y.M. van Engeland (06-11-1968)','',0,0,'','','vanengeland2@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(564,1,'','Marc Ophoff (27-10-1969)','',0,0,'','','dleijtens@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(565,1,'','M.T.A.J. Duffhues (31-08-1970)','',0,0,'','','rianne.duffhues@ziggo.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(566,1,'','J.L.H. van der Heijden (15-05-1931)','',0,0,'','','vanderheijdenr@telfort.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(567,1,'','S.C.M. Tuerlings (06-10-1940)','',0,0,'','','fieketuerlings@ziggo.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(568,1,'','Sjoerd de Bijl (27-08-1999)','',0,0,'','','daisydebijl@live.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(569,1,'','Linda van Erp (22-07-1990)','',0,0,'','','lindavanerp@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(570,1,'','Lichelle Janssen (21-06-1993)','',0,0,'','','lichelle__x@hotmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(571,1,'','Medina Osmanovic (02-04-1982)','',0,0,'','','mosmanovic02@gmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(572,1,'','G. van Deursen (06-04-1958)','',0,0,'','','beamer@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(573,1,'','Marjoleine van Bruchem (18-08-1981)','',0,0,'','','marjoleine1981@gmail.com',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(574,1,'','M.J.H. de Klein (21-03-1970)','',0,0,'','','marcodeklein@home.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(575,1,'','M. Coolen (30-11-1962)','',0,0,'','','a.coolen@hotmail.nl',1451230288,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(576,1,'','J.A.S. Beljon (20-06-1944)','',0,0,'','','jben@beljon.net',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(577,1,'','Richard Tamminga (09-01-1975)','',0,0,'','','marousjka_slaats@msn.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(578,1,'','W.P.J. Bross (21-09-1967)','',0,0,'','','a.kortrink@kpnplanet.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(579,1,'','W.P.M. Smits (27-11-1949)','',0,0,'','','geen1@mail.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(580,1,'','J.H van Heeswijk (06-09-1957)','',0,0,'','','jh.kupers@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(581,1,'','J.C Klösters (12-08-1949)','',0,0,'','','m.klosters@kpnmail.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(582,1,'','J.M. Ultzen (05-08-1966)','',0,0,'','','jm.ultzen@hccnet.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(583,1,'','J.G.M. de Groot (26-06-1955)','',0,0,'','','jgmvdlinden@hotmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(584,1,'','Damian Munster (04-07-1997)','',0,0,'','','ddmontage@home.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(585,1,'','Marjon Modderman (10-01-1963)','',0,0,'','','modderman.m@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(586,1,'','A. Lauzon (05-08-1960)','',0,0,'','','driss48@live.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(587,1,'','Tamara Meijer (18-09-1973)','',0,0,'','','tamaraozan@home.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(588,1,'','R.V. Versteegh (18-01-1984)','',0,0,'','','rvversteegh@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(589,1,'','Gerard Broeders (11-06-1966)','',0,0,'','','gerbroeders@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(590,1,'','J.E.M. Timmermans (04-11-1961)','',0,0,'','','annelies.timmermans@home.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(591,1,'','E.W. van Tongeren-Meijerman (27-04-1956)','',0,0,'','','ew.van.tongeren@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(592,1,'','Josephine Coers (15-07-1998)','',0,0,'','','josephinecoers@yahoo.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(593,1,'','Don de Reuver (06-07-1991)','',0,0,'','','dondereuver@gmail.com',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(594,1,'','J. van Hees de Reuver (15-04-1953)','',0,0,'','','hees.w@hotmail.nl',1451230289,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(595,1,'','Wim van Oort (17-09-1967)','',0,0,'','','wvanoort@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(596,1,'','Wendy Prinsen (17-10-1977)','',0,0,'','','debereboot@hotmail.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(597,1,'','W. Rovers-van Heesch (12-09-1948)','',0,0,'','','adsl698684@tiscali.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(598,1,'','M.J.F.A. van Lent (10-12-1972)','',0,0,'','','radioblackout@live.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(599,1,'','H.W.M. van der Lee (06-01-1971)','',0,0,'','','famvanderlee@ziggo.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(600,1,'','L.H. Gerrits (29-08-1957)','',0,0,'','','gerrits.lh@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(601,1,'','Femke Schapendonk (03-04-2002)','',0,0,'','','nancy.schapendonk@ziggo.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(602,1,'','Johnny Pronk (27-06-1989)','',0,0,'','','johnny_pronk@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(603,1,'','H. Reinders (04-09-1970)','',0,0,'','','henkreinders@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(604,1,'','Peter van Prooijen (03-10-1973)','',0,0,'','','peter.prooijen@versatel.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(605,1,'','Mieke Weterings (08-08-1982)','',0,0,'','','mieke_weterings@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(606,1,'','A.J.P. Steenbergen (15-06-1960)','',0,0,'','','asteenbergen@kabelfoon.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(607,1,'','Patrick Molenaar (11-04-1973)','',0,0,'','','pr_molenaar@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(608,1,'','G.H.M. Schoonenberg (02-07-1954)','',0,0,'','','cgschoonenberg@xs4all.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(609,1,'','Saskia van Erp (16-04-1967)','',0,0,'','','info@studiovitaloss.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(610,1,'','Bas Janssen (15-06-1971)','',0,0,'','','stojo.janssen@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(611,1,'','J.J. van den Berg (18-08-1945)','',0,0,'','','jannie.vd.berg@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(612,1,'','Wes de Loijer (26-01-2007)','',0,0,'','','m.summeren@zonnet.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(613,1,'','Hans Mulder (08-12-1945)','',0,0,'','','hansmulder@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(614,1,'','H.H. Stultiens (23-03-1950)','',0,0,'','','h.stultiens@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(615,1,'','Marcel van Dinther (19-04-1983)','',0,0,'','','vandinther@live.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(616,1,'','Y.M. van Engeland (06-11-1968)','',0,0,'','','vanengeland2@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(617,1,'','Marc Ophoff (27-10-1969)','',0,0,'','','dleijtens@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(618,1,'','M.T.A.J. Duffhues (31-08-1970)','',0,0,'','','rianne.duffhues@ziggo.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(619,1,'','J.L.H. van der Heijden (15-05-1931)','',0,0,'','','vanderheijdenr@telfort.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(620,1,'','S.C.M. Tuerlings (06-10-1940)','',0,0,'','','fieketuerlings@ziggo.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(621,1,'','Sjoerd de Bijl (27-08-1999)','',0,0,'','','daisydebijl@live.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(622,1,'','Linda van Erp (22-07-1990)','',0,0,'','','lindavanerp@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(623,1,'','Lichelle Janssen (21-06-1993)','',0,0,'','','lichelle__x@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(624,1,'','Medina Osmanovic (02-04-1982)','',0,0,'','','mosmanovic02@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(625,1,'','G. van Deursen (06-04-1958)','',0,0,'','','beamer@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(626,1,'','Marjoleine van Bruchem (18-08-1981)','',0,0,'','','marjoleine1981@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(627,1,'','M.J.H. de Klein (21-03-1970)','',0,0,'','','marcodeklein@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(628,1,'','M. Coolen (30-11-1962)','',0,0,'','','a.coolen@hotmail.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(629,1,'','J.A.S. Beljon (20-06-1944)','',0,0,'','','jben@beljon.net',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(630,1,'','Richard Tamminga (09-01-1975)','',0,0,'','','marousjka_slaats@msn.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(631,1,'','W.P.J. Bross (21-09-1967)','',0,0,'','','a.kortrink@kpnplanet.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(632,1,'','W.P.M. Smits (27-11-1949)','',0,0,'','','geen1@mail.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(633,1,'','J.H van Heeswijk (06-09-1957)','',0,0,'','','jh.kupers@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(634,1,'','J.C Klösters (12-08-1949)','',0,0,'','','m.klosters@kpnmail.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(635,1,'','J.M. Ultzen (05-08-1966)','',0,0,'','','jm.ultzen@hccnet.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(636,1,'','J.G.M. de Groot (26-06-1955)','',0,0,'','','jgmvdlinden@hotmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(637,1,'','Damian Munster (04-07-1997)','',0,0,'','','ddmontage@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(638,1,'','Marjon Modderman (10-01-1963)','',0,0,'','','modderman.m@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(639,1,'','A. Lauzon (05-08-1960)','',0,0,'','','driss48@live.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(640,1,'','Tamara Meijer (18-09-1973)','',0,0,'','','tamaraozan@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(641,1,'','R.V. Versteegh (18-01-1984)','',0,0,'','','rvversteegh@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(642,1,'','Gerard Broeders (11-06-1966)','',0,0,'','','gerbroeders@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(643,1,'','J.E.M. Timmermans (04-11-1961)','',0,0,'','','annelies.timmermans@home.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(644,1,'','E.W. van Tongeren-Meijerman (27-04-1956)','',0,0,'','','ew.van.tongeren@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(645,1,'','Josephine Coers (15-07-1998)','',0,0,'','','josephinecoers@yahoo.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(646,1,'','Don de Reuver (06-07-1991)','',0,0,'','','dondereuver@gmail.com',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(647,1,'','J. van Hees de Reuver (15-04-1953)','',0,0,'','','hees.w@hotmail.nl',1451230459,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(662,1,'','','',0,0,'','','',1456399056,1456399056,2,4,'','',0,0,1,1,0,0,0,0,0,1456399056,'127.0.0.1',0),
(663,1,'','','',0,0,'','','deejayy@yandex.ua',1456402366,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(661,1,'','','',0,0,'','','deejayy@yandex.ua',1454852953,1454853671,2,2,'','',0,0,0,0,0,0,0,0,0,1454853667,'',1),
(664,1,'','','',0,0,'','','deejayy@yandex.ua',1456403907,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(651,1,'','','',0,0,'','','deejayy@yandex.ua',1454318445,1454330014,2,3,'1111','Beste  sdfsdfsdfsdfsf ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',1455092730,0,0,0,0,0,0,0,0,1454330014,'',0),
(653,1,'','','',0,0,'','','deejayy@yandex.ua',1454494501,1454496537,2,2,'','',0,0,0,0,0,0,0,0,0,1454496526,'',1),
(656,1,'','','',0,0,'','','deejayy@yandex.ua',1424668969,0,3,2,'','',0,0,0,0,0,0,0,0,0,0,'',1),
(657,1,'','','',0,0,'','','deejayy@yandex.ua',1424469015,1454671529,2,0,'','',0,0,0,0,0,0,0,0,0,1454671529,'',0),
(658,1,'','','',0,0,'','','div-art.com@yandex.ua',1454680159,1454680346,2,3,'','',0,0,0,0,0,0,0,0,0,1454680331,'',0),
(665,1,'','','',0,0,'','','deejayy@yandex.ua',1456406277,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(666,1,'','','',0,0,'','','deejayy@yandex.ua',1456406363,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(667,1,'','','',0,0,'','','deejayy@yandex.ua',1456414738,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(668,1,'','','',0,0,'','','deejayy@yandex.ua',1456415131,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(669,1,'','','',0,0,'','','deejayy@yandex.ua',1456415500,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(670,1,'','','',0,0,'','','deejayy@yandex.ua',1456834394,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(671,1,'','','',0,0,'','','deejayy@yandex.ua',1456834937,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(672,1,'','','',0,0,'','','',1456850576,1456850576,2,2,'','',0,0,0,0,0,0,0,0,0,1456850576,'127.0.0.1',0),
(673,1,'','Test','',0,0,'','12-12-2016','',1458138644,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(674,1,'','Test','',0,0,'','12-12-2016','test@google.com',1458138746,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(675,1,'','Test','',0,0,'','12-12-2016','test@google.com',1458138802,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(676,1,'','Test','',0,0,'','12-12-2016','test@google.com',1458204271,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(677,1,'','','',0,0,'','','id@div-art.com',1458314919,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(678,1,'','','',0,0,'','','id@div-art.com',1458315093,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(679,1,'','','',0,0,'','','',1458673385,1458673385,2,3,'','',0,0,0,0,0,0,0,0,0,1458673385,'127.0.0.1',0),
(680,1,'','','',0,0,'','','deejayy@yandex.ua',1458673456,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(681,1,'','','',0,0,'','','deeejayy@yandex.ua',1458734851,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(682,1,'','','',0,0,'','','deejayy@yandex.ua',1458735980,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(683,1,'','','',0,0,'','','deejayy@yandex.ua',1458737222,0,3,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(684,1,'Mr','Test','Last',0,0,'','12-02-1985','deejayy@yandex.ua',1458816569,1458817205,2,3,'','',0,0,1,1,0,0,0,0,0,1458817205,'',0),
(685,1,'','','',0,0,'','','',1459250802,1459250802,2,3,'','',0,0,0,0,0,0,0,0,0,1459250802,'127.0.0.1',0),
(686,1,'Mr','Tst','Hyr',0,0,'','13-02-2015','deejayy@yandex.ua',1459250895,1459273382,2,3,'','',0,0,0,0,0,0,0,0,0,1459273382,'',0),
(687,1,'De familie','N','Boumlal',0,0,'','','f.aatjuhh@hotmail.com',1459429672,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(688,1,'De familie','B','Boutahri',0,0,'','','taleb.fiducia@hotmail.com',1459429672,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(689,1,'De familie','A','Chahhchouhi',0,0,'','','chahchouhi@live.nl',1459429672,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(690,1,'De heer','E','Suprapto',0,0,'','','',1459429672,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(691,1,'De familie','N','Boumlal',0,0,'','','f.aatjuhh@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(692,1,'De familie','B','Boutahri',0,0,'','','taleb.fiducia@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(693,1,'De familie','A','Chahhchouhi',0,0,'','','chahchouhi@live.nl',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(694,1,'De heer','T','Kacagan',0,0,'','','laz_oglu@live.nl',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(695,1,'De familie','JPR','Koopman',0,0,'','','janpieterrkoopman@gmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(696,1,'De familie','G','Makkor',0,0,'','','mocrobabe@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(697,1,'De heer','E','Suprapto',0,0,'','','mubarikadfn@gmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(698,1,'De heer','K','Rado',0,0,'','','k.rado@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(699,1,'De familie','C','Remmerswaal',0,0,'','','carolineremmerswaal@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(700,1,'De familie','E','Rijnsburger',0,0,'','','erijnsburger@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(701,1,'De familie','R','Soekhlal',0,0,'','','geeta4@msn.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(702,1,'De heer','E','Suprapto',0,0,'','','edisuprapto@gmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(703,1,'De familie','K','Tis',0,0,'','','reda121998@hotmail.com',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(704,1,'De familie','M','Schouten',0,0,'','','mandyschouten@live.nl',1459430333,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(705,1,'Mr','Tstdfs','Hyr',39,0,'','13-02-2015','deejayy@yandex.ua',1459432256,1459432393,2,3,'','',0,0,0,0,0,0,0,0,0,1459432391,'',0),
(711,1,'','','',0,0,'','','',1459495267,1459495267,2,3,'','',0,0,0,0,0,0,0,0,0,1459495267,'127.0.0.1',0),
(712,1,'Mr','Tstdfs','Hyr',36,0,'','13-02-2015','deejayy@yandex.ua',1459518234,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(713,1,'Mr','Tst','Hyr',37,0,'','13-02-2014','deejayy@yandex.ru',1459518234,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(714,1,'Mr','Tstdfs','Hyr',38,0,'','13-02-2013','div-art.com@yandex.ua',1459518234,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(715,1,'Mr','Tstasdad','Hyr',39,0,'','13-02-2012','div-art.com@yandex.ru',1459518234,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0),
(716,1,'Mr','Tstdfs','Hyr',62,0,'','13-02-2011','id@div-art.com',1459518234,0,1,0,'','',0,0,0,0,0,0,0,0,0,0,'',0);

/*Table structure for table `sent_dates` */

DROP TABLE IF EXISTS `sent_dates`;

CREATE TABLE `sent_dates` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `sent_date` int(10) unsigned NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

/*Data for the table `sent_dates` */

insert  into `sent_dates`(`rows_id`,`users_id`,`sent_date`) values 
(1,64,1443871751),
(2,1,1443872917),
(3,1,1443873091),
(4,1,1443873365),
(5,64,1443873368),
(6,1,1443873602),
(7,1,1443873767),
(8,1,1443873917),
(9,1,1443873941),
(10,64,1443874904),
(11,64,1443878058),
(12,64,1443888106),
(13,1,1443902095),
(14,1,1443902338),
(15,1,1443902534),
(16,63,1443902843),
(17,1,1444403722),
(18,1,1444486817),
(19,1,1444487163),
(20,1,1444487457),
(21,1,1444487620),
(22,1,1444493659),
(23,1,1444551402),
(24,1,1444552163),
(25,1,1444552373),
(26,1,1444552491),
(27,1,1444553105),
(28,61,1444558635),
(29,1,1444576088),
(30,61,1444579248),
(31,61,1444753075),
(32,61,1444753174),
(33,1,1444758611),
(34,1,1444759261),
(35,61,1444759617),
(36,1,1444760581),
(37,75,1444764706),
(38,75,1444765728),
(39,75,1444765790),
(40,75,1444765976),
(41,75,1444766011),
(42,1,1444771319),
(43,1,1445424542),
(44,1,1448277600),
(45,1,1448277802),
(46,1,1448277946),
(47,1,1448374891),
(48,1,1448882472),
(49,1,1448895465),
(50,85,1449686221),
(51,85,1449686625),
(52,1,1451229730),
(53,1,1451230049),
(54,1,1451230137),
(55,1,1451230288),
(56,1,1451230459),
(57,1,1458138644),
(58,1,1458138746),
(59,1,1458138802),
(60,1,1458204271),
(61,1,1458816569),
(62,1,1459250895),
(63,1,1459429672),
(64,1,1459430333),
(65,1,1459432256),
(66,1,1459518234);

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `sessions_id` varchar(255) NOT NULL,
  `users_id` int(10) unsigned NOT NULL,
  `users_login` int(10) unsigned NOT NULL,
  `users_logout` int(10) unsigned NOT NULL,
  PRIMARY KEY (`sessions_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `sessions` */

insert  into `sessions`(`sessions_id`,`users_id`,`users_login`,`users_logout`) values 
('1448276503-1',1,1448276503,1448448820),
('1443862960-64',64,1443862960,1443887886),
('1445074622-1',1,1445074622,1445241100),
('1445188841-85',85,1445188841,1445250768),
('1443887890-64',64,1443887890,1443888137),
('1443888142-64',64,1443888142,1443889563),
('1443889595-64',64,1443889595,1443890199),
('1443900942-63',63,1443900942,1443901746),
('1443902705-64',64,1443902705,1443902723),
('1443902732-63',63,1443902732,1443902961),
('1443902967-64',64,1443902967,1443903059),
('1443955389-64',64,1443955389,1443955544),
('1443955573-63',63,1443955573,1443955652),
('1443956468-65',65,1443956468,1443957766),
('1443972521-63',63,1443972521,1443976195),
('1445250736-85',85,1445250736,1445254322),
('1443979277-65',65,1443979277,1443979623),
('1448009347-1',1,1448009347,1448009416),
('1447680213-1',1,1447680213,1447680566),
('1447338671-85',85,1447338671,1447340282),
('1447338563-85',85,1447338563,1447338648),
('1446980264-1',1,1446980264,1447411369),
('1446541457-1',1,1446541457,1446632114),
('1444761602-74',74,1444761602,1444816571),
('1444763810-75',75,1444763810,1444766846),
('1444767707-76',76,1444767707,1444768079),
('1444768430-77',77,1444768430,1444768491),
('1444768431-77',77,1444768431,1444768474),
('1444768526-77',77,1444768526,1444768728),
('1446212592-1',1,1446212592,1446217617),
('1446038936-1',1,1446038936,1446054024),
('1445424525-1',1,1445424525,1445500486),
('1445250708-85',85,1445250708,1445250771),
('1448448827-1',1,1448448827,1448448832),
('1448461208-1',1,1448461208,1448612801),
('1448865948-1',1,1448865948,1448867598),
('1448879299-1',1,1448879299,1448984716),
('1449472176-1',1,1449472176,1449482506),
('1449482538-1',1,1449482538,1449736499),
('1451229194-1',1,1451229194,1451234853),
('1452018888-1',1,1452018888,1452020059),
('1455030998-1',1,1455030998,1455131356),
('1455793213-1',1,1455793213,1455795592),
('1456402315-1',1,1456402315,1456415560),
('1456828466-1',1,1456828466,1456828533),
('1456829612-1',1,1456829612,1456830445),
('1456832732-1',1,1456832732,1456850794),
('1458047649-1',1,1458047649,1458224994),
('1458224665-1',1,1458224665,1458224828),
('1458672111-1',1,1458672111,1458922032),
('1459247702-1',1,1459247702,1459432786),
('1459433018-1',1,1459433018,1459522118),
('1459838202-1',1,1459838202,1459841639),
('1459854468-1',1,1459854468,1459854584);

/*Table structure for table `sheet_variables` */

DROP TABLE IF EXISTS `sheet_variables`;

CREATE TABLE `sheet_variables` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `field` varchar(255) NOT NULL,
  `users_field` varchar(255) NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `sheet_variables` */

insert  into `sheet_variables`(`rows_id`,`users_id`,`field`,`users_field`) values 
(3,1,'name','voorletters_debiteur'),
(4,1,'sname','naam_debiteur'),
(5,1,'email','e-mail'),
(9,1,'title','titel_debiteur'),
(11,1,'doctor','zorgverlenernummer2');

/*Table structure for table `tasks` */

DROP TABLE IF EXISTS `tasks`;

CREATE TABLE `tasks` (
  `tasks_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tasks_name` varchar(255) NOT NULL,
  `tasks_date` int(10) unsigned NOT NULL,
  PRIMARY KEY (`tasks_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `tasks` */

insert  into `tasks`(`tasks_id`,`tasks_name`,`tasks_date`) values 
(1,'resend',1427410800);

/*Table structure for table `unsubscribes` */

DROP TABLE IF EXISTS `unsubscribes`;

CREATE TABLE `unsubscribes` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `time` int(10) unsigned NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `unsubscribes` */

/*Table structure for table `updates` */

DROP TABLE IF EXISTS `updates`;

CREATE TABLE `updates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `type` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1024 DEFAULT CHARSET=utf8;

/*Data for the table `updates` */

insert  into `updates`(`id`,`title`,`text`,`image`,`type`) values 
(1017,'Verzamel anonieme beoordelingen','U kunt een unieke link genereren die u kunt gebruiken op uw website of promotiemateriaal. Met deze link stelt u iedere bezoeker in staat om een beoordeling achter te laten.','',0),
(1016,'Gebruik de huisstijl van uw praktijk','U kunt de e-mail personaliseren door een logo te uploaden en een bijpassende kleur te kiezen. Zo ogen uw e-mails professioneler dan ooit!','',0),
(1018,'Gebruik uw eigen doorverwijzingen','Om uw patiënten door te sturen naar bijvoorbeeld een branche-enquête kunt u uw eigen doorverwijzing tonen op de beoordelingspagina.','',0),
(1013,'Aangepaste beoordelingstekst en variabelen','Om uw e-mails verder te personaliseren kunt u vanaf nu uw eigen tekst gebruiken  en daarbij variabelen invoeren. Zo kunt u bijvoorbeeld uw patiënten persoonlijk bij de naam adresseren. Zo bereikt u dat nóg meer patiënten uw praktijk zullen beoordelen!','http://www.patientenreview.nl/overig/update-images/ml5c.jpg',1),
(10,'Nieuwe online profielen','U kunt vanaf nu online profielen toevoegen voor Independer, Vergelijk Mondzorg en Kliniekoverzicht. Bovendien kunt u de weergavevolgorde bepalen van de kanalen die uw patiënten te zien krijgen.','http://www.patientenreview.nl/overig/update-images/ml5a.jpg',1),
(11,'Beoordelingen voor individuele zorgverleners','U kunt nu beoordelingen verzamelen voor individuele zorgverleners. Dit kunt u doen door zorgverleners aan uw abonnement te koppelen. Patiëntenreview Pro stelt u bovendien in staat om de prestaties van uw praktijk en van uw zorgverleners te monitoren en te vergelijken met het landelijk gemiddelde!','http://www.patientenreview.nl/overig/update-images/ml5b.jpg',1),
(1019,'Activeer een promotiecampagne','U kunt een extra blok plaatsen in uw e-mail om patiënten te stimuleren u te beoordelen met bijvoorbeeld een verloting.','',0),
(1020,'Upgrade naar Pro om gebruik te maken van alle nieuwe functies','Met Patiëntenreview Pro krijgt u toegang tot eerdergenoemde functies. Bovendien kunt u tot drie zorgverleners gratis aan uw abonnement koppelen!','',0),
(1021,'Widgets voor uw website','Door een widget aan te maken kunt u vanaf nu ook uw eigen website gebruiken om beoordelingen van uw patiënten te stimuleren. U kunt bovendien de kleur en tekst naar uw eigen wens aanpassen. De widget is beschikbaar in het instellingenmenu.','http://www.patientenreview.nl/overig/update-images/ml5-1a.jpg',1),
(1022,'Bevestiging van beoordeling','Omdat beoordelingen soms onjuist werden opgevangen vragen we vanaf nu uw patiënten een negatieve beoordeling te bevestigen, alvorens deze wordt geregistreerd.','http://www.patientenreview.nl/overig/update-images/ml5-1b.jpg',1),
(1023,'Bevestiging van beoordeling Test','Omdat beoordelingen soms onjuist werden opgevangen vragen we vanaf nu uw patiënten een negatieve beoordeling te bevestigen, alvorens deze wordt geregistreerd.','http://www.patientenreview.nl/overig/update-images/ml5-1b.jpg',1);

/*Table structure for table `updates_users` */

DROP TABLE IF EXISTS `updates_users`;

CREATE TABLE `updates_users` (
  `rows_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(10) unsigned NOT NULL,
  `updates_id` int(10) unsigned NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`rows_id`)
) ENGINE=MyISAM AUTO_INCREMENT=179 DEFAULT CHARSET=utf8;

/*Data for the table `updates_users` */

insert  into `updates_users`(`rows_id`,`users_id`,`updates_id`,`date`) values 
(175,1,1022,0),
(174,1,1021,0),
(43,1,3,0),
(44,1,4,0),
(45,63,1,0),
(46,63,2,0),
(47,63,3,0),
(48,63,4,0),
(49,1,1,0),
(50,1,2,0),
(51,1,3,0),
(52,1,4,0),
(53,1,1,0),
(54,1,2,0),
(55,1,3,0),
(56,1,4,0),
(57,64,1,0),
(58,64,2,0),
(59,64,3,0),
(60,64,4,0),
(61,1,1,0),
(62,1,2,0),
(63,1,3,0),
(64,1,4,0),
(65,64,5,0),
(66,63,5,0),
(67,64,10,0),
(68,64,11,0),
(69,64,1013,0),
(70,64,1016,0),
(71,64,1017,0),
(72,64,1018,0),
(73,64,1019,0),
(74,64,1020,0),
(75,63,10,0),
(76,63,11,0),
(77,63,1013,0),
(78,63,1016,0),
(79,63,1017,0),
(80,63,1018,0),
(81,63,1019,0),
(82,63,1020,0),
(83,65,1017,0),
(84,65,1016,0),
(85,65,1018,0),
(86,65,1013,0),
(87,65,10,0),
(88,65,11,0),
(89,65,1019,0),
(90,65,1020,0),
(91,1,1017,0),
(92,1,1016,0),
(93,1,1018,0),
(94,1,1013,0),
(95,1,10,0),
(96,1,11,0),
(97,1,1019,0),
(98,1,1020,0),
(99,74,1017,0),
(100,74,1016,0),
(101,74,1018,0),
(102,74,1013,0),
(103,74,10,0),
(104,74,11,0),
(105,74,1019,0),
(106,74,1020,0),
(107,0,10,0),
(108,0,11,0),
(109,0,1013,0),
(110,0,1016,0),
(111,0,1017,0),
(112,0,1018,0),
(113,0,1019,0),
(114,0,1020,0),
(115,75,1017,0),
(116,75,1016,0),
(117,75,1018,0),
(118,75,1013,0),
(119,75,10,0),
(120,75,11,0),
(121,75,1019,0),
(122,75,1020,0),
(123,76,1017,0),
(124,76,1016,0),
(125,76,1018,0),
(126,76,1013,0),
(127,76,10,0),
(128,76,11,0),
(129,76,1019,0),
(130,76,1020,0),
(131,77,1017,0),
(132,77,1016,0),
(133,77,1018,0),
(134,77,1013,0),
(135,77,10,0),
(136,77,11,0),
(137,77,1019,0),
(138,77,1020,0),
(139,1,1017,0),
(140,1,1016,0),
(141,1,1018,0),
(142,1,1013,0),
(143,1,10,0),
(144,1,11,0),
(145,1,1019,0),
(146,1,1020,0),
(147,1,1017,0),
(148,1,1016,0),
(149,1,1018,0),
(150,1,1013,0),
(151,1,10,0),
(152,1,11,0),
(153,1,1019,0),
(154,1,1020,0),
(155,85,1017,0),
(165,85,10,0),
(166,85,11,0),
(167,85,1013,0),
(168,85,1016,0),
(169,85,1018,0),
(170,85,1019,0),
(171,85,1020,0),
(172,85,1021,0),
(173,85,1022,0),
(178,1,1023,0);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_reply` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `use_locations` tinyint(4) unsigned NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(4) unsigned NOT NULL,
  `activation` int(11) NOT NULL,
  `suspension` int(11) NOT NULL,
  `last_reply` text NOT NULL,
  `last_send` int(11) NOT NULL,
  `patients_reminder` tinyint(4) unsigned NOT NULL DEFAULT '1',
  `reminder_checked` tinyint(4) unsigned NOT NULL,
  `reminder_period` tinyint(4) unsigned NOT NULL,
  `reminder_time` int(11) NOT NULL,
  `reminder_day` tinyint(4) unsigned NOT NULL,
  `reminder_last` int(11) unsigned NOT NULL,
  `facebook_pos` int(11) unsigned NOT NULL,
  `facebook_checked` tinyint(4) unsigned NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `facebook_token` varchar(255) NOT NULL,
  `facebook_last` int(11) unsigned NOT NULL,
  `zorgkaart_pos` int(11) unsigned NOT NULL,
  `zorgkaart_checked` tinyint(4) unsigned NOT NULL,
  `zorgkaart` varchar(255) NOT NULL,
  `zorgkaart_last` int(11) unsigned NOT NULL,
  `telefoonboek_pos` int(11) unsigned NOT NULL,
  `telefoonboek_checked` tinyint(4) unsigned NOT NULL,
  `telefoonboek` varchar(255) NOT NULL,
  `telefoonboek_last` int(11) DEFAULT NULL,
  `vergelijkmondzorg_pos` int(11) unsigned NOT NULL,
  `vergelijkmondzorg_checked` tinyint(4) unsigned NOT NULL,
  `vergelijkmondzorg` varchar(255) NOT NULL,
  `vergelijkmondzorg_last` int(11) unsigned NOT NULL,
  `independer_pos` int(11) unsigned NOT NULL,
  `independer_checked` tinyint(4) unsigned NOT NULL,
  `independer` varchar(255) NOT NULL,
  `independer_scrap` varchar(255) NOT NULL,
  `independer_last` int(11) unsigned NOT NULL,
  `kliniekoverzicht_pos` int(11) unsigned NOT NULL,
  `kliniekoverzicht_checked` tinyint(4) unsigned NOT NULL,
  `kliniekoverzicht` varchar(255) NOT NULL,
  `kliniekoverzicht_last` int(11) unsigned NOT NULL,
  `own_pos` int(11) unsigned NOT NULL,
  `own_checked` tinyint(4) unsigned NOT NULL,
  `own` varchar(255) NOT NULL,
  `own_name` varchar(255) NOT NULL,
  `own_last` int(255) unsigned NOT NULL,
  `google_pos` int(11) unsigned NOT NULL,
  `google_checked` tinyint(4) unsigned NOT NULL,
  `google` varchar(255) NOT NULL,
  `google_place_id` varchar(255) NOT NULL,
  `google_last` int(11) unsigned NOT NULL,
  `subject` varchar(255) NOT NULL,
  `promo_checked` tinyint(4) unsigned NOT NULL,
  `short_checked` tinyint(4) unsigned NOT NULL,
  `short` text NOT NULL,
  `stars_type` tinyint(4) unsigned NOT NULL DEFAULT '1',
  `stars_text` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `sites` tinyint(4) unsigned NOT NULL,
  `average_last` double(4,2) NOT NULL,
  `average_now` double(4,2) NOT NULL,
  `average_online_last` double(4,2) NOT NULL,
  `average_online_now` double(4,2) NOT NULL,
  `account_amount` double(10,2) unsigned NOT NULL,
  `doctors_amount` double(10,2) unsigned NOT NULL,
  `doctors_number` tinyint(4) unsigned NOT NULL,
  `signup` int(11) NOT NULL,
  `login` int(11) NOT NULL,
  `now` int(11) NOT NULL,
  `last` int(11) NOT NULL,
  `reset` int(11) unsigned NOT NULL,
  `trial_end` int(11) NOT NULL,
  `admin_stop` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `account_stop` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `account` tinyint(4) unsigned NOT NULL DEFAULT '2',
  `account_type` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `organization` tinyint(4) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`email`,`email_reply`,`phone`,`address`,`postcode`,`city`,`use_locations`,`password`,`status`,`activation`,`suspension`,`last_reply`,`last_send`,`patients_reminder`,`reminder_checked`,`reminder_period`,`reminder_time`,`reminder_day`,`reminder_last`,`facebook_pos`,`facebook_checked`,`facebook`,`facebook_token`,`facebook_last`,`zorgkaart_pos`,`zorgkaart_checked`,`zorgkaart`,`zorgkaart_last`,`telefoonboek_pos`,`telefoonboek_checked`,`telefoonboek`,`telefoonboek_last`,`vergelijkmondzorg_pos`,`vergelijkmondzorg_checked`,`vergelijkmondzorg`,`vergelijkmondzorg_last`,`independer_pos`,`independer_checked`,`independer`,`independer_scrap`,`independer_last`,`kliniekoverzicht_pos`,`kliniekoverzicht_checked`,`kliniekoverzicht`,`kliniekoverzicht_last`,`own_pos`,`own_checked`,`own`,`own_name`,`own_last`,`google_pos`,`google_checked`,`google`,`google_place_id`,`google_last`,`subject`,`promo_checked`,`short_checked`,`short`,`stars_type`,`stars_text`,`logo`,`color`,`sites`,`average_last`,`average_now`,`average_online_last`,`average_online_now`,`account_amount`,`doctors_amount`,`doctors_number`,`signup`,`login`,`now`,`last`,`reset`,`trial_end`,`admin_stop`,`account_stop`,`account`,`account_type`,`organization`) values 
(1,'Fysiotherapeut Marendijk','info@div-art.com','div-art.com@yandex.ua','','Merelstraat 53','5431AK','Alblasserdam',0,'20EAfcH0JSFQY',1,1448887644,1460581200,'Beste  sdfsdfsdfsdfsf ,\n\nMet vriendelijke groet,\n\nFysiotherapeut Marendijk',0,1,1,1,2728320,0,31,2,1,'https://www.facebook.com/woonzorgeindhoven','',0,4,1,'https://www.zorgkaartnederland.nl/zorginstelling/tandartsenpraktijk-fraai-tandartsen-rotterdam-3040715/waardeer',1459461600,6,0,'http://www.telefoonboek.nl/bedrijven/t3062478/heerhugowaard/fysiotherapie-butterhuizen/',1454972400,7,0,'',0,5,1,'https://www.independer.nl/tandarts/tandartsenpraktijk-fick-lobach/geef-review-stap1.aspx','https://www.independer.nl/tandarts/regio/brabant-noord/vught/tandartsenpraktijk-fick-lobach.aspx',1459461600,8,0,'',0,3,0,'http://div-art.com','Onze website beoordelen',0,1,1,'https://plus.google.com/+Cloudrocketsoftware/about','ChIJvR1HUUmxxUcRxdt4Gf_lJ7c',1459461600,'Hoe was uw behandeling bij [COMPANY NAME TAG] sdfsdfsdf',1,1,'div-art',0,'Klik hier om te beoordelen','','#bc0f0f',0,3.00,3.00,3.00,3.00,450.00,60.00,3,0,1459838202,1459854468,1459854524,0,1459976400,0,0,1,1,1),
(3,'Beheerdersaccount','admin@patientenreview.nl','','','','','',0,'6aCX1c9CgDUA.',2,0,0,'',0,1,0,0,0,0,0,0,0,'','',0,0,0,'',0,0,0,'',NULL,0,0,'',0,0,0,'','',0,0,0,'',0,0,0,'','',0,0,0,'','',0,'',0,0,'',0,'','','',0,3.50,3.30,1.50,0.00,0.00,0.00,0,0,1439717877,1440057106,1444579168,0,1442327074,0,0,0,0,0),
(61,'Topvorm Fysiotherapie','info@cloudrocket.co','nickvandenberg31@me.com','036-7370260','Randstad 2126','1314BM','Almere',0,'95pv4b1X2.C62',1,1443906000,1475580659,'Bedankt!',0,1,1,0,2690040,5,25,4,0,'','',0,8,0,'https://www.zorgkaartnederland.nl/zorginstelling/fysiotherapiepraktijk-topvorm-fysiotherapie-almere-3048812',1445032800,1,1,'http://www.telefoonboek.nl/bedrijven/t2272723/arnhem/wim-uw-kapper-op-locatie/',1459461600,5,0,'',0,6,1,'','',0,7,0,'',0,2,1,'http://www.cloudrocket.co','Wilt u onze enquête invullen?',0,3,1,'https://plus.google.com/108010168494125844792/posts','ChIJPZbUIRwXxkcRzyFI1uAJosg',1459461600,'',0,1,'topvorm-fysiotherapie',0,'Klik hier om te beoordelen','./logos/14438904627721.png','#f57b25',0,0.00,3.00,0.00,3.50,0.00,0.00,0,1442748535,0,1442748585,1448887503,1444225067,1443958259,0,1,1,1,0),
(88,'Testpraktijkje','nickvandenberg31@hotmail.com','','','','','',0,'c3a7zrPcfrz1Q',1,1447242068,1478864468,'',0,1,0,0,2719860,0,0,0,0,'','',0,0,0,'',0,0,0,'',NULL,0,0,'',0,0,0,'','',0,0,0,'',0,0,0,'','',0,0,0,'','',0,'',0,1,'werwewer',0,'Klik hier om te beoordelen','','#b51f1f',0,0.00,3.00,0.00,0.00,0.00,0.00,0,1446032477,0,0,1447336823,0,1447242068,0,0,1,0,0),
(86,'Test23','development@cloudrocket.co','','','','','',0,'0cD2.n7PPuJpA',1,1447241754,1478864154,'',0,1,0,0,0,0,0,0,0,'','',0,0,0,'',0,0,0,'',NULL,0,0,'',0,0,0,'','',0,0,0,'',0,0,0,'','',0,0,0,'','',0,'',0,0,'',1,'','','',0,0.00,0.00,0.00,0.00,0.00,0.00,0,1446032165,0,0,1446032172,0,1447241754,0,0,1,0,0),
(87,'rewer','nickvandenberg31@gmail.com','','','','','',0,'23vSyAlquLYG.',1,1447241984,1478864384,'',0,1,0,0,0,0,0,0,0,'','',0,0,0,'',0,0,0,'',NULL,0,0,'',0,0,0,'','',0,0,0,'',0,0,0,'','',0,0,0,'','',0,'',0,0,'',1,'','','',0,0.00,0.00,0.00,0.00,0.00,0.00,0,1446032393,0,0,1446032400,0,1447241984,0,0,1,0,0),
(85,'Nick\'s praktijk','hallo@cloudrocket.co','','','','','',0,'71WtxKgIsTJJI',1,1446398441,1478020841,'',0,1,1,0,2038000,1,0,2,0,'','',0,3,0,'',0,0,0,'',NULL,0,0,'',0,4,1,'https://www.independer.nl/tandarts/m3-mondzorg-helmond/geef-review-stap1.aspx','https://www.independer.nl/tandarts/regio/brabant-zuidoost/helmond/m3-mondzorg-helmond.aspx',1459461600,0,0,'',0,0,0,'','',0,1,0,'','',0,'',0,0,'',1,'','','',0,0.00,3.50,0.00,0.00,0.00,0.00,0,1445188798,1447338563,1447338671,1449698405,0,1446398441,0,0,1,0,0);

/*Table structure for table `widgets` */

DROP TABLE IF EXISTS `widgets`;

CREATE TABLE `widgets` (
  `widgets_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `users_id` int(11) unsigned NOT NULL,
  `widgets_type` tinyint(4) unsigned NOT NULL,
  `widgets_color` varchar(255) NOT NULL,
  `widgets_bg` tinyint(4) unsigned NOT NULL,
  `widgets_button` varchar(255) NOT NULL,
  `widgets_text1` varchar(255) NOT NULL,
  `widgets_text2` varchar(255) NOT NULL,
  `widgets_textb` varchar(255) NOT NULL,
  PRIMARY KEY (`widgets_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `widgets` */

insert  into `widgets`(`widgets_id`,`users_id`,`widgets_type`,`widgets_color`,`widgets_bg`,`widgets_button`,`widgets_text1`,`widgets_text2`,`widgets_textb`) values 
(1,1,0,'#2291e0',1,'#000000','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(2,61,0,'#f26a30',1,'#000000','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(3,61,1,'#f26a30',1,'#000000','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(4,61,1,'#f26a30',1,'#000000','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(5,61,1,'#f26a30',1,'#000000','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(6,88,0,'#3b3b3b',1,'#e47645','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons'),
(7,88,0,'#0F75BC',1,'#e47645','Dit is hoe patiënten ons beoordelen','Wilt u ons ook beoordelen?','Beoordeel ons');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
