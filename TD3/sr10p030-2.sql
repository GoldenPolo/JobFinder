-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 10, 2023 at 05:21 PM
-- Server version: 10.3.38-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sr10p030`
--

-- --------------------------------------------------------

--
-- Table structure for table `Candidature`
--

CREATE TABLE `Candidature` (
  `candidat` int(11) NOT NULL,
  `offre` int(11) NOT NULL,
  `date` date NOT NULL,
  `piecesDossier` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Candidature`
--

INSERT INTO `Candidature` (`candidat`, `offre`, `date`, `piecesDossier`) VALUES
(1, 1, '2023-06-08', '1-1-'),
(1, 2, '2023-06-08', '2-1-'),
(4, 1, '2023-04-03', 'piecesDoss2'),
(5, 1, '2023-05-31', '1-5-'),
(9, 2, '2023-06-08', '2-9-');

-- --------------------------------------------------------

--
-- Table structure for table `DemandeAjoutOrganisation`
--

CREATE TABLE `DemandeAjoutOrganisation` (
  `id` int(11) NOT NULL,
  `utilisateur` int(11) NOT NULL,
  `organisation` int(11) NOT NULL,
  `validee` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `DemandeAjoutOrganisation`
--

INSERT INTO `DemandeAjoutOrganisation` (`id`, `utilisateur`, `organisation`, `validee`) VALUES
(1, 2, 2, 0),
(6, 1, 987, 0),
(8, 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `FichePoste`
--

CREATE TABLE `FichePoste` (
  `id` int(11) NOT NULL,
  `intitule` tinytext NOT NULL,
  `statut` tinytext NOT NULL,
  `responsable` tinytext NOT NULL,
  `type` tinytext NOT NULL,
  `lieu` tinytext NOT NULL,
  `rythme` tinytext NOT NULL,
  `salaireMin` int(11) NOT NULL,
  `salaireMax` int(11) NOT NULL,
  `description` mediumtext NOT NULL,
  `orga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FichePoste`
--

INSERT INTO `FichePoste` (`id`, `intitule`, `statut`, `responsable`, `type`, `lieu`, `rythme`, `salaireMin`, `salaireMax`, `description`, `orga`) VALUES
(1, 'intitule1', 'cadre', 'responsable1', 'sante', 'lieu1', 'rythme1', 900, 1200, 'description1', 1),
(2, 'intitule2', 'statut2', 'responsable2', 'type2', 'lieu2', 'rythme2', 2000, 4000, 'description2', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Offre`
--

CREATE TABLE `Offre` (
  `id` int(11) NOT NULL,
  `etat` enum('nonPubliee','publiee','expiree') NOT NULL,
  `dateValidite` date NOT NULL,
  `indications` mediumtext NOT NULL,
  `nombrePiecesDemandees` int(11) NOT NULL,
  `fichePoste` int(11) NOT NULL,
  `organisation` int(11) NOT NULL,
  `datePublication` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Offre`
--

INSERT INTO `Offre` (`id`, `etat`, `dateValidite`, `indications`, `nombrePiecesDemandees`, `fichePoste`, `organisation`, `datePublication`) VALUES
(1, 'publiee', '2023-03-20', '                                                                                                indications1\r\n                            \r\n                            \r\n                            \r\n                            \r\n                            \r\n                            \r\n                            \r\n                            ', 3, 1, 1, '2023-05-21'),
(2, 'publiee', '2023-04-02', '                                indications22\r\n                            ', 2, 2, 1, '2023-05-18');

-- --------------------------------------------------------

--
-- Table structure for table `Organisation`
--

CREATE TABLE `Organisation` (
  `siren` int(11) NOT NULL,
  `nom` tinytext NOT NULL,
  `type` tinytext NOT NULL,
  `siege` tinytext NOT NULL,
  `statut` enum('validee','refusee','attente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Organisation`
--

INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege`, `statut`) VALUES
(1, 'nomOrga1', 'typeOrga1', 'siegeOrga1', 'validee'),
(2, 'nomOrga2', 'typeOrga2', 'siegeOrga2', 'validee'),
(3, 'orga3', 'type3', 'adresse3', 'validee'),
(987, 'Pol', 'Asso', 'Compiègne', 'validee'),
(12345, 'te', 'ge', 'ge', 'refusee'),
(98765, 'POIJ', 'Asso', 'Compi', 'refusee'),
(987678, 'PolRest', 'Asso', 'Compiègne', 'refusee'),
(1090920, 'PolTest', 'Asso', 'Compiègne', 'refusee');

-- --------------------------------------------------------

--
-- Table structure for table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id` int(11) NOT NULL,
  `email` tinytext NOT NULL,
  `motDePasse` tinytext NOT NULL,
  `type` enum('candidat','recruteur','admin') NOT NULL,
  `nom` tinytext NOT NULL,
  `prenom` tinytext NOT NULL,
  `telephone` tinytext NOT NULL,
  `dateCreation` date NOT NULL,
  `estActif` tinyint(1) NOT NULL,
  `organisation` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Utilisateur`
--

INSERT INTO `Utilisateur` (`id`, `email`, `motDePasse`, `type`, `nom`, `prenom`, `telephone`, `dateCreation`, `estActif`, `organisation`) VALUES
(1, 'candidat@mail.fr', '$2a$10$YN7KohtuxFSUADx29gdsROp/.urZSNW4OAyc8DTHkmg5ms4zSjMJq', 'candidat', 'nom1', 'prenom1', '0610924307', '2023-03-20', 1, NULL),
(2, 'recruteur@mail.fr', '$2a$10$YN7KohtuxFSUADx29gdsROp/.urZSNW4OAyc8DTHkmg5ms4zSjMJq', 'recruteur', 'nom2', 'prenom2', 'numtel2', '2023-01-12', 1, 1),
(3, 'admin@mail.fr', '$2a$10$YN7KohtuxFSUADx29gdsROp/.urZSNW4OAyc8DTHkmg5ms4zSjMJq', 'admin', 'nom3', 'prenom4', 'numtel3', '2022-01-12', 1, 1),
(9, 'pol@pol.fr', '$2a$10$62a27qWvQK6i1nFZY32cpO43F4dOJ0bXF33XFuxggwc0V8JF/qZtK', 'candidat', 'Corty', 'Pol', '0610924307', '2023-06-07', 1, 1),
(22, 'pol@pol.com', '$2a$10$62a27qWvQK6i1nFZY32cpO43F4dOJ0bXF33XFuxggwc0V8JF/qZtK', 'candidat', 'o', 'p', '0000000000', '2023-06-08', 1, NULL),
(23, 'oi@pol.com', '$2a$10$62a27qWvQK6i1nFZY32cpO43F4dOJ0bXF33XFuxggwc0V8JF/qZtK', 'candidat', 'p', 'p', '0000000000', '2023-06-08', 1, NULL),
(24, 'pol@polpol.com', '$2b$10$c/tGrZK1vaFkqxHC5FwU8OQluxJ.OJYkEPWAldGdZjYMskodqKQZC', 'candidat', 'pol', 'pol', '0000000000', '2023-06-10', 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Candidature`
--
ALTER TABLE `Candidature`
  ADD PRIMARY KEY (`candidat`,`offre`);

--
-- Indexes for table `DemandeAjoutOrganisation`
--
ALTER TABLE `DemandeAjoutOrganisation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utilisateur` (`utilisateur`,`organisation`);

--
-- Indexes for table `FichePoste`
--
ALTER TABLE `FichePoste`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orga` (`orga`);

--
-- Indexes for table `Offre`
--
ALTER TABLE `Offre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Organisation`
--
ALTER TABLE `Organisation`
  ADD PRIMARY KEY (`siren`);

--
-- Indexes for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `DemandeAjoutOrganisation`
--
ALTER TABLE `DemandeAjoutOrganisation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `FichePoste`
--
ALTER TABLE `FichePoste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Offre`
--
ALTER TABLE `Offre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `FichePoste`
--
ALTER TABLE `FichePoste`
  ADD CONSTRAINT `FichePoste_ibfk_1` FOREIGN KEY (`orga`) REFERENCES `Organisation` (`siren`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
