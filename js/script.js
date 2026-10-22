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

    // ===== Busca de CEP (API ViaCEP) =====
    const campoCep = document.querySelector('#cep');
    const cepStatus = document.querySelector('#cep-status');

    // Mostra uma mensagem de feedback abaixo do campo CEP
    function mostrarStatusCep(texto, tipo) {
        cepStatus.textContent = texto;
        cepStatus.className = 'cep-status ' + tipo; // 'carregando' | 'sucesso' | 'erro'
    }

    // Preenche (ou limpa) os campos de endereco no DOM
    function preencherEndereco(dados) {
        document.querySelector('#rua').value = dados.logradouro || '';
        document.querySelector('#bairro').value = dados.bairro || '';
        document.querySelector('#cidade').value = dados.localidade || '';
        document.querySelector('#uf').value = dados.uf || '';
    }

    async function buscarCEP(cep) {
        // Remove tudo que nao for numero (aceita "01001-000" ou "01001000")
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            preencherEndereco({});
            mostrarStatusCep('⚠️ Digite um CEP com 8 números.', 'erro');
            return;
        }

        mostrarStatusCep('Buscando CEP...', 'carregando');

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            if (!resposta.ok) throw new Error('Falha na requisição: ' + resposta.status);

            const dados = await resposta.json();

            // O ViaCEP responde 200 com {"erro": true} quando o CEP nao existe
            if (dados.erro) throw new Error('CEP não encontrado');

            preencherEndereco(dados);
            mostrarStatusCep('✅ Endereço encontrado! Complete com o número.', 'sucesso');
            document.querySelector('#mensagem').focus();
        } catch (erro) {
            console.error('Erro ao buscar CEP:', erro);
            preencherEndereco({});
            mostrarStatusCep('❌ Não foi possível buscar o CEP. Verifique o número ou preencha o endereço manualmente.', 'erro');
        }
    }

    if (campoCep && cepStatus) {
        // Formata como 00000-000 enquanto digita
        campoCep.addEventListener('input', function () {
            const numeros = campoCep.value.replace(/\D/g, '').slice(0, 8);
            campoCep.value = numeros.length > 5 ? numeros.slice(0, 5) + '-' + numeros.slice(5) : numeros;
            if (numeros.length === 8) buscarCEP(numeros);
        });

        // Tambem busca ao sair do campo (caso o usuario cole ou digite incompleto)
        campoCep.addEventListener('blur', function () {
            if (campoCep.value.trim() !== '') buscarCEP(campoCep.value);
        });
    }

    // ===== Pedido: resumo de valor + envio ao servidor (PHP/MySQL) =====
    const formContato = document.querySelector('#form-contato');
    const mensagemStatus = document.querySelector('#mensagem-status');

    if (formContato && mensagemStatus) {
        const selProduto = document.querySelector('#produto');
        const inpQtd = document.querySelector('#quantidade');
        const resumo = document.querySelector('#resumo-pedido');
        const btn = document.querySelector('#btn-enviar');
        const moeda = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        let precos = {};   // codigo -> preco (vindo do banco, só para exibição)

        function atualizarResumo() {
            const p = precos[selProduto.value];
            const q = parseInt(inpQtd.value, 10) || 0;
            if (!p || q < 1) { resumo.textContent = 'Selecione um produto para ver o valor.'; return; }
            resumo.textContent = `${q} × ${moeda(p)} = ${moeda(p * q)} (pagamento na entrega)`;
        }

        // Carrega preços atuais do banco; se o PHP não estiver rodando, o servidor recusará o envio de qualquer forma
        fetch('../php/produtos.php').then(r => r.json()).then(lista => {
            lista.forEach(item => {
                precos[item.codigo] = parseFloat(item.preco);
                const opt = selProduto.querySelector(`option[value="${item.codigo}"]`);
                if (opt) opt.textContent = `${item.nome} - ${moeda(parseFloat(item.preco))}`;
            });
            atualizarResumo();
        }).catch(() => console.warn('Preços indisponíveis (PHP/MySQL não está em execução?).'));

        selProduto.addEventListener('change', atualizarResumo);
        inpQtd.addEventListener('input', atualizarResumo);

        // Máscara de telefone (11) 99999-9999
        const campoTel = document.querySelector('#telefone');
        campoTel.addEventListener('input', function () {
            const n = campoTel.value.replace(/\D/g, '').slice(0, 11);
            campoTel.value = n.length > 10 ? `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`
                           : n.length > 6 ? `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`
                           : n.length > 2 ? `(${n.slice(0,2)}) ${n.slice(2)}` : n;
        });

        function mostrar(texto, tipo) {
            mensagemStatus.classList.remove('oculto', 'sucesso', 'erro');
            mensagemStatus.classList.add(tipo);
            mensagemStatus.textContent = texto;
        }

        formContato.addEventListener('submit', async function (evento) {
            evento.preventDefault();
            const v = id => document.querySelector('#' + id).value.trim();
            const digitos = v('telefone').replace(/\D/g, '');

            if (!v('nome') || !digitos || !v('produto') || !v('pagamento') || !v('cep') ||
                !v('rua') || !v('numero') || !v('bairro') || !v('cidade') || !v('uf')) {
                return mostrar('⚠️ Preencha todos os campos obrigatórios (nome, telefone, produto, pagamento e endereço completo).', 'erro');
            }
            if (digitos.length < 10) return mostrar('⚠️ Telefone inválido. Use DDD + número.', 'erro');

            btn.disabled = true;
            btn.textContent = 'Enviando...';
            try {
                const resp = await fetch(formContato.action, { method: 'POST', body: new FormData(formContato) });
                const dados = await resp.json();
                if (!resp.ok || !dados.ok) throw new Error(dados.erro || 'Erro ao registrar o pedido.');

                mostrar(`✅ Pedido #${dados.id} recebido! ${dados.quantidade}× ${dados.produto} — total R$ ${dados.total}, pago na entrega. Entraremos em contato pelo telefone informado.`, 'sucesso');
                formContato.reset();
                inpQtd.value = 1;
                atualizarResumo();
                if (cepStatus) { cepStatus.textContent = ''; cepStatus.className = 'cep-status'; }
            } catch (erro) {
                console.error(erro);
                mostrar('❌ ' + (erro instanceof SyntaxError
                    ? 'Servidor indisponível. Abra o site por um servidor com PHP (ex.: XAMPP), não direto do arquivo.'
                    : erro.message), 'erro');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Enviar Pedido';
            }
        });
    }
});
