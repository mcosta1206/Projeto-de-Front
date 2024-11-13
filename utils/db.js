import { createConnection } from "mysql"; // ou "sqlite3" se estiver usando SQLite

// Configuração do banco de dados (ajuste conforme seu banco de dados)
const db = createConnection({
  host: "localhost",
  user: "root",  // seu usuário
  password: "",  // sua senha
  database: "myapp",  // seu banco de dados
});

// Função para buscar o usuário pelo e-mail
export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // Retorna o primeiro resultado
    });
  });
};

// Função para criar um novo usuário
export const createUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err, result) => {
      if (err) return reject(err);
      resolve({ email, id: result.insertId }); // Retorna os dados do novo usuário
    });
  });
};
