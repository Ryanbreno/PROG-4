USE prog4;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL
);

INSERT INTO user (name, email) VALUES ('Ryan Breno', 'ryan@email.com');
INSERT INTO user (name, email) VALUES ('João Silva', 'joao@email.com');

SELECT * FROM user;