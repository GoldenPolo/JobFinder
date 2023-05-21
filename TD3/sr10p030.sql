-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 21, 2023 at 06:01 PM
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
(1, 1, '2023-04-01', 'piecesDoss1'),
(4, 1, '2023-04-03', 'piecesDoss2');

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
(1, 2, 2, 0);

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
  `description` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FichePoste`
--

INSERT INTO `FichePoste` (`id`, `intitule`, `statut`, `responsable`, `type`, `lieu`, `rythme`, `salaireMin`, `salaireMax`, `description`) VALUES
(1, 'intitule1', 'statut1', 'responsable1', 'type1', 'lieu1', 'rythme1', 900, 1200, 'description1'),
(2, 'intitule2', 'statut2', 'responsable2', 'type2', 'lieu2', 'rythme2', 2000, 4000, 'description2');

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
(1, 'publiee', '2023-03-20', 'indications1', 3, 1, 1, '2023-05-21'),
(2, 'publiee', '2023-04-02', 'indications2', 2, 2, 1, '2023-05-18');

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
(2, 'nomOrga2', 'typeOrga2', 'siegeOrga2', 'attente');

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
(1, 'candidat@mail.fr', 'mdp', 'candidat', 'nom1', 'prenom1', 'numtel1', '2023-03-20', 1, NULL),
(2, 'recruteur@mail.fr', 'mdp', 'recruteur', 'nom2', 'prenom2', 'numtel2', '2023-01-12', 1, 1),
(3, 'admin@mail.fr', 'mdp', 'admin', 'nom3', 'prenom4', 'numtel3', '2022-01-12', 1, 1),
(4, 'email4', 'mdp', 'candidat', 'nom4', 'prenom4', 'numtel4', '2022-01-16', 1, NULL);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `FichePoste`
--
ALTER TABLE `FichePoste`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
