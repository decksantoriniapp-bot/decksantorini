const dataEstoque = {
    "Bebidas": {
        "Refrigerantes": [
            "COCA NORMAL", "COCA ZERO", "GUARANÁ NORMAL", "GUARANÁ ZERO", 
            "TÔNICA", "TÔNICA ZERO", "Schwepes citrus", "Fanta laranja"
        ],
        "Sucos e Águas": [
            "SUCO UVA MITTO", "YAI CHA", "ÁGUA PLATINA 1 L", "ÁGUA GÁS", 
            "ÁGUA SEM GÁS", "SUCO CEREJA"
        ],
        "Energéticos": [
            "ENERGÉTICO MELANCIA", "ENERGÉTICO TROPICAL"
        ],
        "Cervejas": [
            "HEINEKEN", "BLUE MOON", "HEINEKEN 0 0", "CORONA", "STELLA", 
            "ALMAZA", "Cerpa"
        ],
        "Destilados e Licores": [
            "VODKA", "TEQUILA", "GIN", "OUZO", "METAXA", "CACHAÇA SALINAS", 
            "MASTIC", "BARCADI PRATA", "STOCK PÊSSEGO", "STOCK CURAÇAU BLUE", 
            "BLACK LABEL", "STOCK CASSIS", "VERMOUTH", "CAMPARI", "APEROL", 
            "LICOR 43", "CONTINI", "TSIPOURO", "GENTLEMAN JACK"
        ],
        "Xaropes e Frutas": [
            "MONIN MAÇA VERDE", "MONIN AMORA", "MONIN CEREJA", "MONIN GRENADINE", 
            "MONIN FRAMBOESA", "Monin mirtilo", "Kaly cranberry", "Kaly melancia", 
            "Melancia", "Laranja"
        ],
        "Cafés e Outros": [
            "CAFÉ DILI"
        ],
        "Vinhos": [
            "Canava chrissou", "Black cubed", "Lexis Gris", "malagousia", 
            "chardonnay", "Nemea", "atropina TINTO", "Atropia ROSE", 
            "Atropia BRANCO", "MOSCOPHILERO", "Enotria Cabernet Sauvignon"
        ]
    },
    "Cozinha": {
        "Aguardando Cadastro": [
            "Em breve"
        ]
    }
};

const URL_DO_SCRIPT = "URL_AQUI"; // Será preenchido depois

let abaAtual = "Bebidas";

const tabs = document.querySelectorAll('.tab-btn');
const catSelect = document.getElementById('categoria');
const prodSelect = document.getElementById('produto');
const form = document.getElementById('estoque-form');
const btnSubmit = document.getElementById('submit-btn');
const btnText = btnSubmit.querySelector('span');
const btnLoader = btnSubmit.querySelector('.loader');
const statusMessage = document.getElementById('status-message');

function popularCategorias() {
    catSelect.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';
    prodSelect.innerHTML = '<option value="" disabled selected>Selecione a categoria primeiro...</option>';
    prodSelect.disabled = true;

    const categorias = Object.keys(dataEstoque[abaAtual]);
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        catSelect.appendChild(option);
    });
}

function popularProdutos() {
    const categoriaSelecionada = catSelect.value;
    prodSelect.innerHTML = '<option value="" disabled selected>Selecione o produto...</option>';
    
    if(categoriaSelecionada) {
        const produtos = dataEstoque[abaAtual][categoriaSelecionada];
        produtos.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod;
            option.textContent = prod;
            prodSelect.appendChild(option);
        });
        prodSelect.disabled = false;
    }
}

// Event Listeners
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        abaAtual = tab.dataset.tab;
        popularCategorias();
    });
});

catSelect.addEventListener('change', popularProdutos);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoria = catSelect.value;
    const produto = prodSelect.value;
    const quantidade = document.getElementById('quantidade').value;
    const responsavel = document.getElementById('responsavel').value;

    if(!produto || !categoria) {
        mostrarStatus('Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    const payload = {
        aba: abaAtual,
        categoria: categoria,
        produto: produto,
        quantidade: quantidade,
        responsavel: responsavel,
        data: new Date().toLocaleString('pt-BR')
    };

    setLoading(true);

    try {
        if(URL_DO_SCRIPT === "URL_AQUI") {
            // Simulação caso não tenha a URL ainda
            await new Promise(r => setTimeout(r, 1000));
            console.log("Dados que seriam enviados:", payload);
            mostrarStatus('Modo de teste: Dados registrados com sucesso!', 'success');
        } else {
            const response = await fetch(URL_DO_SCRIPT, {
                method: 'POST',
                mode: 'no-cors', // O GAS requer no-cors para não dar erro bloqueante, mas não retorna res.json()
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            mostrarStatus('Contagem enviada com sucesso!', 'success');
        }
        
        // Limpar os campos específicos (mantemos o responsável para agilizar múltiplas contagens)
        document.getElementById('quantidade').value = '';
        prodSelect.selectedIndex = 0;
        
    } catch (error) {
        mostrarStatus('Erro ao enviar. Tente novamente.', 'error');
        console.error(error);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if(isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        btnSubmit.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnSubmit.disabled = false;
    }
}

function mostrarStatus(mensagem, tipo) {
    statusMessage.textContent = mensagem;
    statusMessage.className = `status-${tipo}`;
    statusMessage.classList.remove('hidden');
    
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 4000);
}

// Inicializar
popularCategorias();
