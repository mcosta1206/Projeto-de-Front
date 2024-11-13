import bcrypt from "bcryptjs";
import { db } from "../../utils/db";  // Assumindo que você tem um arquivo de banco de dados

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Verifica se email e senha foram passados
    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await db.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Senha criptografada:", hashedPassword); // Log para depuração

      // Cria o novo usuário
      const newUser = await db.createUser({ email, password: hashedPassword });
      console.log("Novo usuário criado:", newUser); // Log para depuração

      // Retorna sucesso
      return res.status(201).json({ message: "Usuário registrado com sucesso!" });

    } catch (error) {
      // Caso um erro ocorra, exibe no console e retorna uma mensagem genérica
      console.error("Erro ao registrar o usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor. Tente novamente mais tarde." });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido." });
  }
}

