DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);
CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT FK_PARTY FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
voter_id INTEGER NOT NULL,
candidate_id INTEGER NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
/* specifies that the values inserted into the voter_id field must be unique. For example, 
   whoever has a voter_id of 1 can only appear in this table once */
CONSTRAINT uc_voter UNIQUE (voter_id),
/* relates this table votes through voter_id to the table voters through id.
   DELETE CASCADE indicates that deleting the reference key (in voters) will also delete the 
   entire row from this table */
CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
/* Similart as above   */
CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);