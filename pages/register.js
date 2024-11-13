import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas são iguais
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Envia os dados para a API de registro
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // Exibe uma mensagem de erro vinda da API
        const data = await res.json();
        setError(data.message || "Erro ao cadastrar usuário.");
        return;
      }

      // Redireciona para a página de login após o cadastro
      router.push("/login");
    } catch (err) {
      // Captura e exibe o erro para depuração
      console.error("Erro ao realizar o cadastro:", err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Erro desconhecido.");
      }
    }
  };

  return (
    <div>
      <h1>Cadastro de Usuário</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        <label>
          Confirmar Senha:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
