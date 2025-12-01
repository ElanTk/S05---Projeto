// Recebe o nome que está guardado no banco de dados (neste caso local storage)
const id = localStorage.getItem("matriculaLogada");
const nome = localStorage.getItem("usuarioLogado");
document.getElementById("nomeAluno").innerHTML = nome;

console.log(id); // Verifique o valor no console
console.log(nome); // Verifique o valor no console

// caixa cinza e caixa mostrando ajudas
const cont = document.getElementById("ajudas-container");
const placeholder = document.querySelector(".placeholder-box");

// botao de sair
const logoutButton = document.querySelector('.logout');

// Ícones do olho
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");

// POPUP
const popup = document.getElementById("tela-menu");
const btnCancel = document.getElementById("cancel1");
const btnOk = document.getElementById("ok1");
const btnEmoc = document.getElementById("adicionarEmocional");
const inputData = document.getElementById("inputData");
const inputHora = document.getElementById("inputHora");
const inputAssunto = document.getElementById("inputAssunto");

// POPUP2
const popup2 = document.getElementById("tela-menu2");
const btnCancel2 = document.getElementById("cancel2");
const btnOk2 = document.getElementById("ok2");
const btnBolsa = document.getElementById("adicionarBolsa");
const inputAssunto2 = document.getElementById("inputAssunto2");
//Ainda faz parte da lógica, mas é onde as bolsas aparecem
const divBolsas = document.getElementById("bolsas");
const divEncontros = document.getElementById("encontros");


// Mostrar ajudas
document.getElementById("showAjudas").onclick = () => {
    cont.style.display = "block";
    placeholder.style.display = "none";

    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
};

// Esconder ajudas
document.getElementById("hideAjudas").onclick = () => {
    cont.style.display = "none";
    placeholder.style.display = "block";

    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
};

//Voltar a tela inicial
logoutButton.addEventListener('click', function() {
    window.location.href = '../index.html';
});

//POP-UP1
btnEmoc.addEventListener("click", () => {

    inputData.value = "";
    inputHora.value = "";
    inputAssunto.value = "";

    popup.style.display = "flex";
});

btnCancel.addEventListener("click", () => {
    popup.style.display = "none";
});

// Botão OK adiciona o compromisso
btnOk.addEventListener("click", () => {
    const data = inputData.value;
    const hora = inputHora.value;
    const assunto = inputAssunto.value.trim();

    if (assunto === "") {
        alert("O assunto não pode estar vazio!");
        return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(data + "T00:00");
    if (dataSelecionada <= hoje) {
        alert("A data precisa ser depois da data atual!");
        return;
    }

    const [h, m] = hora.split(":").map(Number);
    if (h < 8 || h > 18) {
        alert("A hora precisa estar entre 08:00 e 18:00!");
        return;
    }

    let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];
    compromissos.push({ data, hora, assunto });
    localStorage.setItem("compromissos", JSON.stringify(compromissos));

    alert("Compromisso adicionado com sucesso!");

    popup.style.display = "none";
    renderCompromissos();
});

// ABRIR POP-UP2
btnBolsa.addEventListener("click", () => {

    // Limpa campos
    inputAssunto2.value = "";

    // Exibe popup
    popup2.style.display = "flex";
});
// FECHAR POP-UP2
btnCancel2.addEventListener("click", () => {
    popup2.style.display = "none";
});

// Botão OK adiciona a bolsa
btnOk2.addEventListener("click", () => {
    const assunto = inputAssunto2.value.trim();

    if (assunto === "") {
        alert("O assunto não pode estar vazio!");
        return;
    }

    if (localStorage.getItem("bolsa")) {
        alert("Já existe uma bolsa registrada!");
        return;
    }

    const bolsa = {
        nome: "auxilio estudantil",
        status: "documentos pendentes (visitar SAE)",
        assunto: assunto
    };

    localStorage.setItem("bolsa", JSON.stringify(bolsa));

    alert("Bolsa registrada com sucesso!");

    popup2.style.display = "none";
    renderBolsa();
});


function renderBolsa() {
    divBolsas.innerHTML = "";

    const bolsa = JSON.parse(localStorage.getItem("bolsa"));
    if (!bolsa) return; 

    // Cria o elemento <p>
    const p = document.createElement("p");
    p.innerHTML = `
        ${bolsa.nome} | ${bolsa.status}
        <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" style="cursor:pointer; width:16px; height:16px; margin-left:5px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
    `;

    divBolsas.appendChild(p);

    const trashIcon = p.querySelector(".trash-icon");
    trashIcon.addEventListener("click", () => {
        localStorage.removeItem("bolsa");
        p.remove();
        alert("Bolsa removida com sucesso!");
    });
}

function renderCompromissos() {
    // Limpa a div antes de adicionar (evita duplicações)
    divEncontros.innerHTML = "";

    const compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

    compromissos.forEach((comp, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            ${comp.assunto} | ${comp.data} | ${comp.hora}
            <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" style="cursor:pointer; width:16px; height:16px; margin-left:5px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
        divEncontros.appendChild(p);

        const trashIcon = p.querySelector(".trash-icon");
        trashIcon.addEventListener("click", () => {
            compromissos.splice(index, 1);
            localStorage.setItem("compromissos", JSON.stringify(compromissos));
            p.remove();
            alert("Compromisso removido!");
        });
    });
}

// Chama os renders ao carregar
document.addEventListener("DOMContentLoaded", renderCompromissos);
document.addEventListener("DOMContentLoaded", renderBolsa);

// Pop-ups começam invisíveis
popup.style.display = "none";
popup2.style.display = "none";