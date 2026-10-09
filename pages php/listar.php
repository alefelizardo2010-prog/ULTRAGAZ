<?php
require_once "../config/conexap.php";

$sql = "SELECT * FROM mensagens_contato ORDER BY id DESC";
$stmt = $conexao->query($sql);
$mensagens = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de Contatos</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <h2>Mensagens Recebidas</h2>
    <p><a href="../pages/contato.html">Novo Contato</a> | <a href="../index.html">Página Inicial</a></p>

    <?php if (empty($mensagens)): ?>
        <p>Nenhum registro encontrado.</p>
    <?php else: ?>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Mensagem</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($mensagens as $msg): ?>
                    <tr>
                        <td><?= htmlspecialchars($msg["id"]) ?></td>
                        <td><?= htmlspecialchars($msg["nome"]) ?></td>
                        <td><?= htmlspecialchars($msg["email"]) ?></td>
                        <td><?= htmlspecialchars($msg["mensagem"]) ?></td>
                        <td><?= htmlspecialchars($msg["data_envio"] ?? "") ?></td>
                        <td>
                            <a href="editar.php?id=<?= $msg["id"] ?>">Editar</a> | 
                            <a href="excluir.php?id=<?= $msg["id"] ?>" onclick="return confirm('Deseja realmente excluir?')">Excluir</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</body>
</html>