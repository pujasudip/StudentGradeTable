DROP TABLE if exists `gradetable`;

CREATE TABLE `gradetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `course` varchar(30) NOT NULL,
  `grade` int(11) NOT NULL,
   PRIMARY KEY (id)
);

INSERT INTO `gradetable` (`name`, `course`, `grade`) 
VALUES 
('Sudip Baral', 'Hist-101', '79'),
('Puja Baral', 'Bio-223', '98'),
('Punam Giri', 'Eng-123', '67'),
('Anu Pokhrel', 'EE-451', '99'),
('Binam Soyal', 'RO-434', '76'),
('Eshara Bral', 'Phy-351', '90'),
('Noble Pal', 'Calc-712', '57'),
('Ganga Jha', 'DS-434', '87'),
('Sikha Deol', 'DB-349', '59'),
('Aish Khanal', 'DS-534', '78'),
('Anchal Sharma', 'ACC-106', '66');


DROP TABLE if exists `student_session`;

CREATE TABLE `student_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `session_id` varchar(30) NOT NULL,
  `last_accessed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action_done` text NOT NULL,
  PRIMARY KEY (id)
)