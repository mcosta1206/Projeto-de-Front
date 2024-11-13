import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envio dos dados para a API de login
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erro ao fazer login.");
        return;
      }

      // Se a resposta for ok, obtemos o token
      const data = await res.json();
      localStorage.setItem("token", data.token); // Armazena o token no localStorage
      router.push("/dashboard"); // Redireciona para o dashboard ou página principal
    } catch (err) {
      // Melhor tratamento de erro para depuração
      console.error("Erro no processo de login:", err); // Exibe o erro completo no console
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`); // Se for um erro padrão, exibe a mensagem
      } else {
        setError("Erro desconhecido. Tente novamente."); // Caso contrário, exibe uma mensagem genérica
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Exibe mensagem de erro */}
      <form onSubmit={handleSubmit}>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
