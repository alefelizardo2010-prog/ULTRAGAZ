<?php
require_once "../config/conexap.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"] ?? null;
    $nome = trim($_POST["nome"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mensagem = trim($_POST["mensagem"] ?? "");

    if ($id && !empty($nome) && !empty($email) && !empty($mensagem)) {
        $sql = "UPDATE mensagens_contato SET nome = :nome, email = :email, mensagem = :mensagem WHERE id = :id";
        $stmt = $conexao->prepare($sql);
        $stmt->execute([
            ":nome" => $nome,
            ":email" => $email,
            ":mensagem" => $mensagem,
            ":id" => $id
        ]);
    }
}

header("Location: listar.php");
exit;
?>