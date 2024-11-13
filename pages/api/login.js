import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../utils/db";  // Mesmo caso, usando banco de dados

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    // Verifica se o usuário existe
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } else {
    res.status(405).json({ message: "Método não permitido." });
  }
}
