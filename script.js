const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggleText = document.getElementById('theme-toggle-text');

function aplicarTema(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeToggleDarkIcon.classList.add('hidden');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleText.textContent = 'Light mode';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleText.textContent = 'Dark mode';
    }
}

function inicializarTema() {
    const temaSalvo = localStorage.getItem('theme');
    const preferenciaSistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaSalvo === 'dark' || (!temaSalvo && preferenciaSistemaEscuro)) {
        aplicarTema(true);
    } else {
        aplicarTema(false);
    }
}

themeToggleBtn.addEventListener('click', () => {
    const estaNoModoEscuro = document.documentElement.classList.contains('dark');
    aplicarTema(!estaNoModoEscuro);
});

inicializarTema();

const tabCard = document.getElementById('tab-card');
const tabPix = document.getElementById('tab-pix');
const tabBoleto = document.getElementById('tab-boleto');

const contentCard = document.getElementById('payment-card-content');
const contentPix = document.getElementById('payment-pix-content');
const contentBoleto = document.getElementById('payment-boleto-content');

const discountLabel = document.getElementById('discount-label');
const discountVal = document.getElementById('discount-val');
const totalVal = document.getElementById('total-val');
const installmentsText = document.getElementById('installments-text');
const btnSubmitText = document.getElementById('btn-submit-text');

const classesAbaAtiva = ['border-2', 'border-zinc-900', 'dark:border-zinc-100', 'bg-zinc-50', 'dark:bg-zinc-800/80', 'text-zinc-900', 'dark:text-white'];
const classesAbaInativa = ['border', 'border-zinc-200', 'dark:border-zinc-800', 'text-zinc-600', 'dark:text-zinc-400', 'hover:bg-zinc-50', 'dark:hover:bg-zinc-800/40'];

function selecionarPagamento(metodo) {
    [tabCard, tabPix, tabBoleto].forEach(tab => {
        tab.classList.remove(...classesAbaAtiva);
        tab.classList.add(...classesAbaInativa);
    });

    contentCard.classList.add('hidden');
    contentPix.classList.add('hidden');
    contentBoleto.classList.add('hidden');

    if (metodo === 'card') {
        tabCard.classList.add(...classesAbaAtiva);
        tabCard.classList.remove(...classesAbaInativa);
        contentCard.classList.remove('hidden');

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

        discountLabel.textContent = 'Desconto (Cupom 10%)';
        discountVal.textContent = '- R$ 28,90';
        totalVal.textContent = 'R$ 260,10';
        installmentsText.textContent = 'pagamento em cota única';
        btnSubmitText.textContent = 'Gerar Boleto • R$ 260,10';
    }
}


function copiarPix() {
    const pixInput = document.getElementById('pix-key');
    const copyText = document.getElementById('copy-text');
    
    navigator.clipboard.writeText(pixInput.value).then(() => {
        copyText.textContent = 'Copiado! ✓';
        setTimeout(() => {
            copyText.textContent = 'Copiar';
        }, 2000);
    });
}


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
