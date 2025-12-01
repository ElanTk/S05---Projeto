class Bolsa {
    constructor(nome, status, assunto) {
        this.nome = nome;
        this.status = status;
        this.assunto = assunto;
    }

    static carregar() {
        return JSON.parse(localStorage.getItem("bolsa"));
    }

    static salvar(obj) {
        localStorage.setItem("bolsa", JSON.stringify(obj));
    }

    static remover() {
        localStorage.removeItem("bolsa");
    }

    remover() {
        Bolsa.remover();
    }
}

class Compromisso {
    constructor(data, hora, assunto) {
        this.data = data;
        this.hora = hora;
        this.assunto = assunto;
    }

    remover(index) {
        let lista = JSON.parse(localStorage.getItem("compromissos")) || [];
        lista.splice(index, 1);
        localStorage.setItem("compromissos", JSON.stringify(lista));
    }
}

class PopupEncontro {
    constructor() {
        this.popup = document.getElementById("tela-menu");
        this.inputData = document.getElementById("inputData");
        this.inputHora = document.getElementById("inputHora");
        this.inputAssunto = document.getElementById("inputAssunto");
        this.btnOk = document.getElementById("ok1");
        this.btnCancel = document.getElementById("cancel1");
        this.abrirEventos();
    }

    abrirEventos() {
    document.getElementById("adicionarEmocional").addEventListener("click", () => this.abrir());
    this.btnCancel.addEventListener("click", () => this.fechar());

    this.btnOk.addEventListener("click", () => {
        const data = this.inputData.value;
        const hora = this.inputHora.value;
        const assunto = this.inputAssunto.value.trim();

        if (!assunto) return alert("O assunto não pode estar vazio!");

        const hoje = new Date();
        const dataSelecionada = new Date(data + "T00:00");

        if (dataSelecionada <= hoje) return alert("A data precisa ser depois da data atual!");

        const [h] = hora.split(":").map(Number);
        if (h < 8 || h > 18) return alert("A hora precisa estar entre 08:00 e 18:00!");

        let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

        const existe = compromissos.some(c => c.data === data);
        if (existe) {
            return alert("Você já possui um compromisso marcado neste dia!");
        }

        compromissos.push(new Compromisso(data, hora, assunto));
        localStorage.setItem("compromissos", JSON.stringify(compromissos));

        alert("Compromisso adicionado com sucesso!");
        this.fechar();
        RenderizadorAjudas.renderCompromissos();
    });
}

    abrir() {
        this.inputData.value = "";
        this.inputHora.value = "";
        this.inputAssunto.value = "";
        this.popup.style.display = "flex";
    }

    fechar() {
        this.popup.style.display = "none";
    }
}

class PopupBolsa {
    constructor() {
        this.popup2 = document.getElementById("tela-menu2");
        this.inputAssunto2 = document.getElementById("inputAssunto2");
        this.btnOk2 = document.getElementById("ok2");
        this.btnCancel2 = document.getElementById("cancel2");
        this.abrirEventos();
    }

    abrirEventos() {
        document.getElementById("adicionarBolsa").addEventListener("click", () => this.abrir());
        this.btnCancel2.addEventListener("click", () => this.fechar());

        this.btnOk2.addEventListener("click", () => {
            const assunto = this.inputAssunto2.value.trim();

            if (!assunto) return alert("O assunto não pode estar vazio!");

            if (localStorage.getItem("bolsa")) {
                return alert("Já existe uma bolsa registrada!");
            }

            let bolsa = new Bolsa(
                "auxilio estudantil",
                "documentos pendentes (visitar SAE)",
                assunto
            );

            Bolsa.salvar(bolsa);

            alert("Bolsa registrada com sucesso!");
            this.fechar();
            RenderizadorAjudas.renderBolsa();
        });
    }

    abrir() {
        this.inputAssunto2.value = "";
        this.popup2.style.display = "flex";
    }

    fechar() {
        this.popup2.style.display = "none";
    }
}

class RenderizadorAjudas {
    static divBolsas = document.getElementById("bolsas");
    static divEncontros = document.getElementById("encontros");

    static renderBolsa() {
        this.divBolsas.innerHTML = "";
        const bolsa = Bolsa.carregar();
        if (!bolsa) return;

        const p = document.createElement("p");
        p.innerHTML = `
            ${bolsa.nome} | ${bolsa.status}
            <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor"
                 style="cursor:pointer; width:16px; height:16px; margin-left:5px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;

        this.divBolsas.appendChild(p);

        p.querySelector(".trash-icon").addEventListener("click", () => {
            Bolsa.remover();
            p.remove();
            alert("Bolsa removida com sucesso!");
        });
    }

    static renderCompromissos() {
        this.divEncontros.innerHTML = "";
        const compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

        compromissos.forEach((comp, index) => {
            const p = document.createElement("p");
            p.innerHTML = `
                ${comp.assunto} | ${comp.data} | ${comp.hora}
                <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor"
                     style="cursor:pointer; width:16px; height:16px; margin-left:5px;">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;

            this.divEncontros.appendChild(p);

            p.querySelector(".trash-icon").addEventListener("click", () => {
                let c = new Compromisso(comp.data, comp.hora, comp.assunto);
                c.remover(index);
                p.remove();
                alert("Compromisso removido!");
            });
        });
    }
}

class AppAjudas {
    constructor() {
        this.id = localStorage.getItem("matriculaLogada");
        this.nome = localStorage.getItem("usuarioLogado");
        this.cont = document.getElementById("ajudas-container");
        this.placeholder = document.querySelector(".placeholder-box");
        this.eyeOpen = document.getElementById("eye-open");
        this.eyeClosed = document.getElementById("eye-closed");
        this.logoutButton = document.querySelector(".logout");

        document.getElementById("nomeAluno").innerHTML = this.nome;

        this.popupEncontro = new PopupEncontro();
        this.popupBolsa = new PopupBolsa();

        this.inicializar();
    }

    inicializar() {
        document.getElementById("showAjudas").onclick = () => this.mostrarAjudas();
        document.getElementById("hideAjudas").onclick = () => this.esconderAjudas();

        this.logoutButton.addEventListener("click", () => this.logout());

        document.addEventListener("DOMContentLoaded", () => {
            RenderizadorAjudas.renderBolsa();
            RenderizadorAjudas.renderCompromissos();
        });
    }

    mostrarAjudas() {
        this.cont.style.display = "block";
        this.placeholder.style.display = "none";
        this.eyeOpen.style.display = "block";
        this.eyeClosed.style.display = "none";
    }

    esconderAjudas() {
        this.cont.style.display = "none";
        this.placeholder.style.display = "block";
        this.eyeOpen.style.display = "none";
        this.eyeClosed.style.display = "block";
    }

    logout() {
        window.location.href = "../index.html";
    }
}

const app = new AppAjudas();

function renderBolsa() {
    RenderizadorAjudas.renderBolsa();
}

function renderCompromissos() {
    RenderizadorAjudas.renderCompromissos();
}

document.getElementById("tela-menu").style.display = "none";
document.getElementById("tela-menu2").style.display = "none";