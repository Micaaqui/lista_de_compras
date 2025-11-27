const inputItem = document.getElementById("input-item");
const listaDeCompras = document.getElementById("lista-de-compras");
const form = document.querySelector("form");
let contador = 0;

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (inputItem.value === ""){
        alert("Por favor insira um item!");
        return;
    }

    const itemDaLista = document.createElement("li");
    const containerItemDaLista = document.createElement("div");
    containerItemDaLista.classList.add("lista-item-container");
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.id = "checkbox-" + contador++;
    const nomeItem = document.createElement("p");
    nomeItem.innerText = inputItem.value;

    inputCheckbox.addEventListener("click", function(){
        if (inputCheckbox.checked){
            nomeItem.style.textDecoration = "line-through";
        } else {
            nomeItem.style.textDecoration = "none"
        }
    })

    containerItemDaLista.appendChild(inputCheckbox);
    containerItemDaLista.appendChild(nomeItem);
    
    // acoes: editar e deletar
    const acoesContainer = document.createElement("div");
    acoesContainer.classList.add("acoes-container");

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.classList.add("botao-editar");
    // usar imagens próprias para ícones (edit/delete) e SVG inline para salvar
    const iconPencil = `<img src="./assets/edit.svg" alt="Editar" />`;
    botaoEditar.innerHTML = iconPencil;
    botaoEditar.title = "Editar";
    botaoEditar.setAttribute("aria-label", "Editar item");
    // estado de edição (usa atributo para não depender do texto que pode ser traduzido)
    botaoEditar.dataset.editing = "false";

    const botaoDeletar = document.createElement("button");
    botaoDeletar.type = "button";
    botaoDeletar.classList.add("botao-deletar");
    const iconTrash = `<img src="./assets/delete.svg" alt="Deletar" />`;
    botaoDeletar.innerHTML = iconTrash;
    botaoDeletar.title = "Deletar";
    botaoDeletar.setAttribute("aria-label", "Deletar item");

    acoesContainer.appendChild(botaoEditar);
    acoesContainer.appendChild(botaoDeletar);

    // criar linha superior que contém o item (checkbox + nome) à esquerda
    // e as ações (editar/deletar) alinhadas à direita
    const linhaSuperior = document.createElement("div");
    linhaSuperior.classList.add("linha-superior");
    linhaSuperior.appendChild(containerItemDaLista);
    linhaSuperior.appendChild(acoesContainer);

    itemDaLista.appendChild(linhaSuperior);

    const diaDaSemana = new Date().toLocaleDateString ("pt-BR" , {
        weekday: "long"
    });
    const data = new Date().toLocaleDateString("pt-BR")
    const hora = new Date().toLocaleTimeString("pt-BR" , {
        hour: "numeric",
        minute: "numeric"
    })
    const dataCompleta = `${diaDaSemana} (${data}) às ${hora}`
    const itemData = document.createElement("p");
    itemData.innerText = dataCompleta;
    itemData.classList.add("texto-data")
    itemDaLista.appendChild(itemData);

    listaDeCompras.appendChild(itemDaLista); 

    // limpar input e focar novamente
    inputItem.value = "";
    inputItem.focus();

    verificarListaVazia(); 

    // evento de deletar
    botaoDeletar.addEventListener("click", function(){
        if (confirm("Deseja realmente deletar este item?")){
            itemDaLista.remove();
            verificarListaVazia();
        }
    });

    // evento de editar (toggle entre editar/salvar) — usa data-editing para lógica
    botaoEditar.addEventListener("click", function(){
        const isEditing = botaoEditar.dataset.editing === "true";
        if (!isEditing){
            // entrar em modo edição
            const novoInput = document.createElement("input");
            novoInput.type = "text";
            novoInput.value = nomeItem.innerText;
            novoInput.classList.add("input-edicao");
            containerItemDaLista.replaceChild(novoInput, nomeItem);
            novoInput.focus();
            botaoEditar.dataset.editing = "true";
            // manter o mesmo ícone (sem check); apenas atualizar título/aria
            botaoEditar.title = "Salvar";
            botaoEditar.setAttribute("aria-label", "Salvar edição");

            // permitir salvar também ao pressionar Enter dentro do input
            novoInput.addEventListener('keydown', function onKeyDown(e){
                if (e.key === 'Enter'){
                    e.preventDefault();
                    // simula clique no botão de salvar -> reutiliza a mesma lógica abaixo
                    botaoEditar.click();
                }
            });
        } else {
            // salvar edição
            const campoEdicao = containerItemDaLista.querySelector('input[type="text"]');
            const novoNome = campoEdicao.value.trim();
            if (novoNome === ""){
                alert("O nome do item não pode ficar vazio.");
                campoEdicao.focus();
                return;
            }
            nomeItem.innerText = novoNome;
            containerItemDaLista.replaceChild(nomeItem, campoEdicao);
            botaoEditar.dataset.editing = "false";
            // voltar ao estado normal do botão (mesmo ícone), atualizar título/aria
            botaoEditar.title = "Editar";
            botaoEditar.setAttribute("aria-label", "Editar item");
        }
    });
});

const mensagemListaVazia = document.querySelector(".mensagem-lista-vazia");

function verificarListaVazia(){
    const itensDaLista = listaDeCompras.querySelectorAll("li");
    if (itensDaLista.length === 0){
        mensagemListaVazia.style.display = "block";
    } else {
        mensagemListaVazia.style.display = "none";
    }
}

verificarListaVazia();