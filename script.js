// =============================================================================
// MINIMAL STORE - CONTROLE DE TEMA (LIGHT / DARK) E CHECKOUT
// =============================================================================

// -----------------------------------------------------------------------------
// 1. GERENCIAMENTO DO TEMA (MODO CLARO E MODO ESCURO)
// -----------------------------------------------------------------------------

// Elementos da interface relacionados ao tema
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggleText = document.getElementById('theme-toggle-text');

/**
 * Função para aplicar o tema visual na página (HTML) e atualizar o botão
 * @param {boolean} isDark - true para modo escuro, false para modo claro
 */
function aplicarTema(isDark) {
    if (isDark) {
        // Adiciona a classe 'dark' no elemento raiz <html> (Tailwind detecta essa classe)
        document.documentElement.classList.add('dark');
        // Salva a escolha do usuário na memória do navegador
        localStorage.setItem('theme', 'dark');
        
        // Atualiza o botão para indicar a opção de voltar para o modo claro
        themeToggleDarkIcon.classList.add('hidden');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleText.textContent = 'Light mode';
    } else {
        // Remove a classe 'dark' do elemento raiz <html>
        document.documentElement.classList.remove('dark');
        // Salva a escolha do usuário na memória do navegador
        localStorage.setItem('theme', 'light');
        
        // Atualiza o botão para indicar a opção de ir para o modo escuro
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleText.textContent = 'Dark mode';
    }
}

/**
 * Inicializa o tema ao carregar a página:
 * 1º Verifica se o usuário já salvou uma preferência no localStorage
 * 2º Caso não tenha salvo, verifica a preferência de cor do próprio sistema operacional
 */
function inicializarTema() {
    const temaSalvo = localStorage.getItem('theme');
    const preferenciaSistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaSalvo === 'dark' || (!temaSalvo && preferenciaSistemaEscuro)) {
        aplicarTema(true);
    } else {
        aplicarTema(false);
    }
}

// Evento de clique no botão de alternar tema
themeToggleBtn.addEventListener('click', () => {
    const estaNoModoEscuro = document.documentElement.classList.contains('dark');
    // Inverte o modo atual
    aplicarTema(!estaNoModoEscuro);
});

// Executa a inicialização do tema
inicializarTema();


// -----------------------------------------------------------------------------
// 2. GERENCIAMENTO DAS FORMAS DE PAGAMENTO (CARTÃO / PIX / BOLETO)
// -----------------------------------------------------------------------------

// Referência aos botões das abas
const tabCard = document.getElementById('tab-card');
const tabPix = document.getElementById('tab-pix');
const tabBoleto = document.getElementById('tab-boleto');

// Referência aos containers de conteúdo de cada forma de pagamento
const contentCard = document.getElementById('payment-card-content');
const contentPix = document.getElementById('payment-pix-content');
const contentBoleto = document.getElementById('payment-boleto-content');

// Referências aos valores no resumo da compra
const discountLabel = document.getElementById('discount-label');
const discountVal = document.getElementById('discount-val');
const totalVal = document.getElementById('total-val');
const installmentsText = document.getElementById('installments-text');
const btnSubmitText = document.getElementById('btn-submit-text');

// Classes Tailwind para aba Ativa e aba Inativa
const classesAbaAtiva = ['border-2', 'border-zinc-900', 'dark:border-zinc-100', 'bg-zinc-50', 'dark:bg-zinc-800/80', 'text-zinc-900', 'dark:text-white'];
const classesAbaInativa = ['border', 'border-zinc-200', 'dark:border-zinc-800', 'text-zinc-600', 'dark:text-zinc-400', 'hover:bg-zinc-50', 'dark:hover:bg-zinc-800/40'];

/**
 * Alterna a forma de pagamento exibida e atualiza os valores do resumo
 * @param {'card' | 'pix' | 'boleto'} metodo - Método selecionado
 */
function selecionarPagamento(metodo) {
    // 1. Reseta o visual de todas as abas
    [tabCard, tabPix, tabBoleto].forEach(tab => {
        tab.classList.remove(...classesAbaAtiva);
        tab.classList.add(...classesAbaInativa);
    });

    // 2. Esconde todos os blocos de conteúdo
    contentCard.classList.add('hidden');
    contentPix.classList.add('hidden');
    contentBoleto.classList.add('hidden');

    // 3. Ativa a aba e o bloco correspondente ao método escolhido
    if (metodo === 'card') {
        tabCard.classList.add(...classesAbaAtiva);
        tabCard.classList.remove(...classesAbaInativa);
        contentCard.classList.remove('hidden');

        // Valores para Cartão de Crédito (com cupom PRIMEIRA10 de 10%)
        discountLabel.textContent = 'Desconto (Cupom 10%)';
        discountVal.textContent = '- R$ 28,90';
        totalVal.textContent = 'R$ 260,10';
        installmentsText.textContent = 'em até 3x de R$ 86,70 sem juros';
        btnSubmitText.textContent = 'Finalizar Pedido • R$ 260,10';
    } 
    else if (metodo === 'pix') {
        tabPix.classList.add(...classesAbaAtiva);
        tabPix.classList.remove(...classesAbaInativa);
        contentPix.classList.remove('hidden');

        // Valores para PIX (com 5% OFF à vista)
        discountLabel.textContent = 'Desconto PIX (5% OFF)';
        discountVal.textContent = '- R$ 14,45';
        totalVal.textContent = 'R$ 274,55';
        installmentsText.textContent = 'à vista no PIX com aprovação imediata';
        btnSubmitText.textContent = 'Gerar Código PIX • R$ 274,55';
    } 
    else if (metodo === 'boleto') {
        tabBoleto.classList.add(...classesAbaAtiva);
        tabBoleto.classList.remove(...classesAbaInativa);
        contentBoleto.classList.remove('hidden');

        // Valores para Boleto
        discountLabel.textContent = 'Desconto (Cupom 10%)';
        discountVal.textContent = '- R$ 28,90';
        totalVal.textContent = 'R$ 260,10';
        installmentsText.textContent = 'pagamento em cota única';
        btnSubmitText.textContent = 'Gerar Boleto • R$ 260,10';
    }
}


// -----------------------------------------------------------------------------
// 3. FUNÇÃO PARA COPIAR A CHAVE PIX
// -----------------------------------------------------------------------------

function copiarPix() {
    const pixInput = document.getElementById('pix-key');
    const copyText = document.getElementById('copy-text');
    
    // Copia o texto para a área de transferência do usuário
    navigator.clipboard.writeText(pixInput.value).then(() => {
        // Altera o texto do botão temporariamente para dar feedback visual
        copyText.textContent = 'Copiado! ✓';
        setTimeout(() => {
            copyText.textContent = 'Copiar';
        }, 2000);
    });
}


// -----------------------------------------------------------------------------
// 4. FUNÇÃO PARA APLICAR CUPOM DE DESCONTO
// -----------------------------------------------------------------------------

function aplicarCupom() {
    const couponInput = document.getElementById('coupon-input');
    const cupom = couponInput.value.trim().toUpperCase();

    if (cupom === 'PRIMEIRA10') {
        alert('Cupom PRIMEIRA10 aplicado com sucesso! (10% de desconto)');
        selecionarPagamento('card');
    } else if (cupom === '') {
        alert('Por favor, digite um código de cupom.');
    } else {
        alert(`Cupom "${cupom}" não encontrado ou expirado.`);
    }
}
