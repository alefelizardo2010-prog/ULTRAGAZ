<?php
require_once "../config/conexap.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = trim($_POST["nome"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mensagem = trim($_POST["mensagem"] ?? "");

    if (!empty($nome) && !empty($email) && !empty($mensagem)) {
        $sql = "INSERT INTO mensagens_contato (nome, email, mensagem) VALUES (:nome, :email, :mensagem)";
        $stmt = $conexao->prepare($sql);
        $stmt->execute([
            ":nome" => $nome,
            ":email" => $email,
            ":mensagem" => $mensagem
        ]);

        header("Location: listar.php");
        exit;
    } else {
        echo "Por favor, preencha todos os campos. <a href='../pages/contato.html'>Voltar</a>";
    }
}
?>