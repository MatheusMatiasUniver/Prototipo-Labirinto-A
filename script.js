const canvas = document.getElementById('mazeCanvas');
const contexto = canvas.getContext('2d');

const btnAutomatico = document.getElementById('autoBtn');
const btnPassoAPasso = document.getElementById('stepBtn');
const btnReiniciar = document.getElementById('resetBtn');
const btnModoEdicao = document.getElementById('editBtn');
const btnGerarCodigo = document.getElementById('generateCodeBtn');

const NUM_COLUNAS = 25;
const NUM_LINHAS = 25;
const TAMANHO_CELULA = 20;

canvas.width = NUM_COLUNAS * TAMANHO_CELULA;
canvas.height = NUM_LINHAS * TAMANHO_CELULA;

let grade = [];
let listaAberta = [];
let listaFechada = [];
let caminhoFinal = [];
let noInicial, noFinal;

let modoAutomatico = false;
let jogoFinalizado = false;
let modoEdicao = false;

let modeloDoLabirinto = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


class No {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.g = 0; // CUSTO REAL: Quantos passos já demos para chegar até este nó.
        this.h = 0; // HEURÍSTICA: Nossa estimativa de quantos passos faltam para chegar ao fim.
        this.f = 0; // PONTUAÇÃO FINAL: A soma de g + h. O A* sempre escolhe o nó com o menor 'f'.

        this.pai = null; // De qual nó viemos para chegar aqui? Usado para reconstruir o caminho no final.
    }
}

//A função Heurística. Distância em linha reta, ignorando paredes.
function heuristica(noA, noB) {
    return Math.abs(noA.x - noB.x) + Math.abs(noA.y - noB.y);
}

function obterVizinhos(no) {
    let vizinhos = [];
    const direcoes = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];

    for (let dir of direcoes) {
        let x = no.x + dir.x;
        let y = no.y + dir.y;

        if (x >= 0 && x < NUM_COLUNAS && y >= 0 && y < NUM_LINHAS && grade[y][x] === 0) {
            vizinhos.push(new No(x, y));
        }
    }
    return vizinhos;
}

function executarPassoDoAlgoritmo() {
    if (jogoFinalizado) return;

    if (listaAberta.length > 0) {
        
        // A DECISÃO INTELIGENTE: ENCONTRAR O NÓ MAIS PROMISSOR
        // Procura na 'listaAberta' qual nó tem a menor pontuação 'f'.
        let indiceDoMelhor = 0;
        for (let i = 1; i < listaAberta.length; i++) {
            if (listaAberta[i].f < listaAberta[indiceDoMelhor].f) {
                indiceDoMelhor = i;
            }
        }
        let noAtual = listaAberta[indiceDoMelhor]; // Este é o nó mais promissor.

        // VERIFICA SE CHEGOU AO FIM
        if (noAtual.x === noFinal.x && noAtual.y === noFinal.y) {
            // Se chegou reconstrói o caminho de trás para frente, usando o 'pai' de cada nó.
            let temp = noAtual;
            caminhoFinal.push(temp);
            while (temp.pai) {
                caminhoFinal.push(temp.pai);
                temp = temp.pai;
            }
            console.log("Caminho encontrado!");
            jogoFinalizado = true;
            desenhar();
            return;
        }

        // Move o nó atual da lista de "a visitar" (aberta) para a de "já visitados" (fechada).
        listaAberta.splice(indiceDoMelhor, 1);
        listaFechada.push(noAtual);

        // ANALISA OS VIZINHOS DO NÓ ATUAL
        let vizinhos = obterVizinhos(noAtual);
        for (let vizinho of vizinhos) {
            // Ignora o vizinho se ele já está na lista fechada
            if (listaFechada.find(n => n.x === vizinho.x && n.y === vizinho.y)) {
                continue;
            }

            // Calcula o custo para chegar neste vizinho através do nó atual.
            let custoG = noAtual.g + 1;
            let noExistenteNaListaAberta = listaAberta.find(n => n.x === vizinho.x && n.y === vizinho.y);

            if (!noExistenteNaListaAberta) { // Se é um nó completamente novo
                vizinho.g = custoG;
                vizinho.h = heuristica(vizinho, noFinal);
                vizinho.f = vizinho.g + vizinho.h;
                vizinho.pai = noAtual;
                listaAberta.push(vizinho);
            } else if (custoG < noExistenteNaListaAberta.g) { // Se já conhecíamos este nó, mas encontramos um caminho MELHOR para ele...
                noExistenteNaListaAberta.g = custoG;
                noExistenteNaListaAberta.f = noExistenteNaListaAberta.g + noExistenteNaListaAberta.h;
                noExistenteNaListaAberta.pai = noAtual;
            }
        }
    } else {
        console.log("Nenhum caminho encontrado.");
        jogoFinalizado = true;
        desenhar();
        return;
    }

    desenhar();

    if (modoAutomatico) {
        requestAnimationFrame(executarPassoDoAlgoritmo);
    }
}

function desenhar() {
    contexto.fillStyle = '#fff';
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < NUM_LINHAS; y++) {
        for (let x = 0; x < NUM_COLUNAS; x++) {
            if (grade[y][x] === 1) {
                contexto.fillStyle = '#212121'; // Paredes
                contexto.fillRect(x * TAMANHO_CELULA, y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
            }
        }
    }
    for (let no of listaFechada) {
        contexto.fillStyle = '#ffcc80'; // Nós já visitados
        contexto.fillRect(no.x * TAMANHO_CELULA, no.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    }
    for (let no of listaAberta) {
        contexto.fillStyle = '#81d4fa'; // Nós a visitar
        contexto.fillRect(no.x * TAMANHO_CELULA, no.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    }
    for (let no of caminhoFinal) {
        contexto.fillStyle = '#42a5f5'; // Caminho final
        contexto.fillRect(no.x * TAMANHO_CELULA, no.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    }
    contexto.fillStyle = '#4caf50'; // Início
    contexto.fillRect(noInicial.x * TAMANHO_CELULA, noInicial.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    contexto.fillStyle = '#f44336'; // Fim
    contexto.fillRect(noFinal.x * TAMANHO_CELULA, noFinal.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
}

btnAutomatico.addEventListener('click', () => {
    if (jogoFinalizado || modoEdicao) return;
    modoAutomatico = true;
    executarPassoDoAlgoritmo();
});

btnPassoAPasso.addEventListener('click', () => {
    if (jogoFinalizado || modoEdicao) return;
    modoAutomatico = false;
    executarPassoDoAlgoritmo();
});

btnReiniciar.addEventListener('click', () => {
    reiniciarAlgoritmo();
});

btnModoEdicao.addEventListener('click', () => {
    modoEdicao = !modoEdicao;
    if (modoEdicao) {
        reiniciarAlgoritmo();
        btnModoEdicao.textContent = '✏️ Modo Edição (ON)';
        btnModoEdicao.classList.add('active');
        canvas.classList.add('edit-mode');
        alert('Modo Edição ATIVADO. Clique nas células para criar ou remover paredes.');
    } else {
        btnModoEdicao.textContent = '✏️ Modo Edição (OFF)';
        btnModoEdicao.classList.remove('active');
        canvas.classList.remove('edit-mode');
        modeloDoLabirinto = JSON.parse(JSON.stringify(grade));
    }
});

canvas.addEventListener('click', (evento) => {
    if (!modoEdicao) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;
    const x = Math.floor(mouseX / TAMANHO_CELULA);
    const y = Math.floor(mouseY / TAMANHO_CELULA);
    if ((x === noInicial.x && y === noInicial.y) || (x === noFinal.x && y === noFinal.y)) return;
    grade[y][x] = 1 - grade[y][x];
    desenhar();
});

btnGerarCodigo.addEventListener('click', () => {
    let codigo = 'let modeloDoLabirinto = [\\n';
    for (let y = 0; y < NUM_LINHAS; y++) {
        codigo += '    [' + grade[y].join(', ') + '],\\n';
    }
    codigo += '];';
    prompt('Copie este código e cole no seu arquivo para salvar o labirinto:', codigo);
});

function reiniciarAlgoritmo() {
    console.log("Reiniciando algoritmo...");
    grade = JSON.parse(JSON.stringify(modeloDoLabirinto));
    listaAberta = [];
    listaFechada = [];
    caminhoFinal = [];
    noInicial = new No(0, 0);
    noFinal = new No(NUM_COLUNAS - 1, NUM_LINHAS - 1);
    listaAberta.push(noInicial);
    
    jogoFinalizado = false;
    modoAutomatico = false;

    if (!modoEdicao) {
        btnModoEdicao.textContent = '✏️ Modo Edição (OFF)';
        btnModoEdicao.classList.remove('active');
        canvas.classList.remove('edit-mode');
    }

    desenhar();
}

reiniciarAlgoritmo();
