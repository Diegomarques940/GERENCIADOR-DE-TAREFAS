// Função para obter a data atual formatada
const obterDataAtual = () => {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    return mes >= 10 ? `${dia}/${mes}/${ano}` : `${dia}/0${mes}/${ano}`;
}

// Recupera tarefas do localStorage
const obterTarefasDoLocalStorage = () => {
    const dados = JSON.parse(window.localStorage.getItem("tarefas"));
    return dados ? dados : [];
}

// Adiciona tarefas ao localStorage
const salvarTarefasNoLocalStorage = (tarefas) => {
    window.localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Animação para remover tarefa com delay
const removerTarefaComAnimacao = (idTarefa) => new Promise((resolve) => {
    const elemento = document.getElementById(idTarefa);
    setTimeout(() => {
        resolve(elemento.remove());
    }, 900);
})

// Marca tarefa como concluída visualmente e logicamente
const marcarTarefaComoConcluida = async (idTarefa, idTitulo, idBotao) => {
    const item = document.getElementById(idTarefa);
    const titulo = document.getElementById(idTitulo);
    const botao = document.getElementById(idBotao);
    const icone = document.createElement("img");
    icone.src = "/img/icone.svg";

    titulo.style = "text-decoration: line-through; color: rgb(143,152,168)";
    item.removeChild(botao);
    item.appendChild(icone);

    const tarefas = obterTarefasDoLocalStorage();
    tarefas[idTarefa - 1].concluida = true;
    salvarTarefasNoLocalStorage(tarefas);
    atualizarContadorTarefasConcluidas(tarefas);
}

// Cria visualmente um cartão de tarefa
const criarCartaoTarefa = (tarefa) => {
    const item = document.createElement("li");
    const containerInfo = document.createElement("div");
    const titulo = document.createElement("h2");
    const etiquetaData = document.createElement("div");
    const etiqueta = document.createElement("span");
    const data = document.createElement("p");
    const botao = document.createElement("button");

    const idTarefa = tarefa.id;
    const idBotao = `botao-concluir-${idTarefa}`;
    const idTitulo = `titulo-${idTarefa}`;

    item.id = idTarefa;
    item.className = "cartao-tarefa";
    containerInfo.className = "info-tarefa";
    titulo.className = "titulo-tarefa";
    etiquetaData.className = "etiqueta-data";
    botao.className = "botao-concluir";

    titulo.id = idTitulo;
    botao.id = idBotao;

    titulo.textContent = tarefa.nome;
    etiqueta.textContent = tarefa.etiqueta;
    data.textContent = `Criado em: ${tarefa.dataCriacao}`;
    botao.textContent = "Concluir";
    botao.onclick = () => marcarTarefaComoConcluida(idTarefa, idTitulo, idBotao);

    item.appendChild(containerInfo);
    containerInfo.appendChild(titulo);
    containerInfo.appendChild(etiquetaData);
    etiquetaData.appendChild(etiqueta);
    etiquetaData.appendChild(data);
    item.appendChild(botao);

    return item;
}

// Insere um novo item na lista
const inserirItemNaLista = (tarefa) => {
    const lista = document.getElementById("lista-tarefas");
    const cartao = criarCartaoTarefa(tarefa);
    lista.appendChild(cartao);
    return lista;
}

// Extrai dados do formulário e adiciona nova tarefa
const processarFormulario = (evento) => {
    evento.preventDefault();

    const tarefas = obterTarefasDoLocalStorage();
    const id = tarefas.length === 0 ? 1 : tarefas.length + 1;
    const nome = evento.target.elements[0].value;
    const etiqueta = evento.target.elements[1].value;
    const dataCriacao = obterDataAtual();
    const concluida = false;

    const novaTarefa = { id, nome, etiqueta, dataCriacao, concluida };
    const tarefasAtualizadas = tarefas.length === 0 ? [novaTarefa] : [...tarefas, novaTarefa];

    salvarTarefasNoLocalStorage(tarefasAtualizadas);
    inserirItemNaLista(novaTarefa);
}

// Cria contador de tarefas concluídas no rodapé
const atualizarContadorTarefasConcluidas = (tarefas) => {
    const rodape = document.getElementById("rodape");
    let contadorTexto = document.getElementById("contador-tarefas");

    if (!contadorTexto) {
        contadorTexto = document.createElement("p");
        contadorTexto.id = "contador-tarefas";
    }

    const totalConcluidas = tarefas.filter(({ concluida }) => concluida).length;
    contadorTexto.textContent = `${totalConcluidas} tarefas concluídas`;
    rodape.appendChild(contadorTexto);
    return rodape;
}

// Inicialização do app ao carregar
window.onload = function () {
    const form = document.getElementById("formulario-tarefa");
    form.addEventListener("submit", processarFormulario);

    const tarefas = obterTarefasDoLocalStorage();
    tarefas.forEach((tarefa) => {
        if (!tarefa.concluida) inserirItemNaLista(tarefa);
    });

    atualizarContadorTarefasConcluidas(tarefas);
} 
