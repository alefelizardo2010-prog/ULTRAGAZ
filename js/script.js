document.addEventListener('DOMContentLoaded', function () {
    console.log("JavaScript da Ultragaz carregado com sucesso!");

    const miniaturas = document.querySelectorAll('.card-miniatura');
    const destaqueImg = document.querySelector('#imagem-destaque');
    const destaqueTitulo = document.querySelector('#titulo-destaque');
    const destaqueDesc = document.querySelector('#descricao-destaque');

    // Verifica se os elementos da galeria existem na página atual
    if (miniaturas.length > 0 && destaqueImg && destaqueTitulo && destaqueDesc) {
        miniaturas.forEach(function (miniatura) {
            miniatura.addEventListener('click', function () {
                
                // 1. Remove a classe 'ativo' de todas as miniaturas
                miniaturas.forEach(function (item) {
                    item.classList.remove('ativo');
                });

                // 2. Adiciona a classe 'ativo' apenas na miniatura clicada
                miniatura.classList.add('ativo');

                // 3. Captura os dados dos atributos data-*
                const novoTitulo = miniatura.getAttribute('data-titulo');
                const novaDesc = miniatura.getAttribute('data-desc');
                const novaImg = miniatura.getAttribute('data-img');

                // 4. Atualiza a tela dinamicamente usando textContent e src
                destaqueTitulo.textContent = novoTitulo;
                destaqueDesc.textContent = novaDesc;
                destaqueImg.src = novaImg;

                console.log(`Produto alterado para: ${novoTitulo}`);
            });
        });
    }

    const formContato = document.querySelector('#form-contato');
    const mensagemStatus = document.querySelector('#mensagem-status');

    if (formContato && mensagemStatus) {
        formContato.addEventListener('submit', function (evento) {
            // Impede o recarregamento padrao da pagina
            evento.preventDefault();

            // Captura os valores digitados
            const nome = document.querySelector('#nome').value.trim();
            const telefone = document.querySelector('#telefone').value.trim();
            const produto = document.querySelector('#produto').value;
            const mensagem = document.querySelector('#mensagem').value.trim();

            // Limpa classes anteriores da mensagem
            mensagemStatus.classList.remove('oculto', 'sucesso', 'erro');

            // Validação simples
            if (nome === '' || telefone === '' || produto === '' || mensagem === '') {
                // Exibe erro
                mensagemStatus.textContent = '⚠️ Por favor, preencha todos os campos do formulário!';
                mensagemStatus.classList.add('erro');
            } else {
                // Exibe sucesso
                mensagemStatus.textContent = `✅ Obrigado, ${nome}! Seu pedido do ${produto.toUpperCase()} foi recebido com sucesso. Entraremos em contato pelo telefone registrado.`;
                mensagemStatus.classList.add('sucesso');

                // Limpa o formulário após envio bem-sucedido
                formContato.reset();
            }
        });
    }
});