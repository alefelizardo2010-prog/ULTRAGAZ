<?php
require_once "../config/conexap.php";

$id = $_GET["id"] ?? null;

if ($id) {
    $sql = "DELETE FROM mensagens_contato WHERE id = :id";
    $stmt = $conexao->prepare($sql);
    $stmt->execute([":id" => $id]);
}

header("Location: listar.php");
exit;
?>