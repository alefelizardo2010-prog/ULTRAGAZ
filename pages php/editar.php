<?php
require_once "../config/conexap.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    header("Location: listar.php");
    exit;
}

$sql = "SELECT * FROM mensagens_contato WHERE id = :id";
$stmt = $conexao->prepare($sql);
$stmt->execute([":id" => $id]);
$contato = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$contato) {
    header("Location: listar.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Editar Contato</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <h2>Editar Registro #<?= htmlspecialchars($contato["id"]) ?></h2>
    <form action="atualizar.php" method="POST">
        <input type="hidden" name="id" value="<?= htmlspecialchars($contato["id"]) ?>">

        <label for="nome">Nome:</label><br>
        <input type="text" id="nome" name="nome" value="<?= htmlspecialchars($contato["nome"]) ?>" required><br><br>

        <label for="email">E-mail:</label><br>
        <input type="email" id="email" name="email" value="<?= htmlspecialchars($contato["email"]) ?>" required><br><br>

        <label for="mensagem">Mensagem:</label><br>
        <textarea id="mensagem" name="mensagem" rows="5" required><?= htmlspecialchars($contato["mensagem"]) ?></textarea><br><br>

        <button type="submit">Atualizar</button>
        <a href="listar.php">Cancelar</a>
    </form>
</body>
</html>