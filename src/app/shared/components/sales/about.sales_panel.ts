import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';


@Component({
    selector: 'sales-about-panel',
    imports: [CommonModule],
    providers: [],
    styleUrls: [],
    standalone: true,

    template: `
        <p class="mb-8">
            1 - Lead:
            <br/>
            - Colher dados de comunicação, tais como: Nome, Telefone, E-mail e meio de comunicação.
        </p>

        <p class="mb-8">
            2 - Contato pessoal / Inicio de negociação:

            <br/>
            - De prefêrencia, Marcar uma reunião presencial com o cliente em loja, escritório ou Marina. Caso não seja possivel, pode ser por telefone ou pelo whatsapp
            <br/>
            - Definir o perfil da negociação - Respondendo perguntas básicas:
            <br/>
            - Qual a cidade do cliente?
            <br/>
            - Onde o senhor vai navegar?
            <br/>
            - Quantas pessoas o senhor quer levar na embarcação?
            <br/>
            - Tamanho da embarcação?
            <br/>
            - Cabinada ou proa aberta?
            <br/>
            - Barco novo ou usado
            <br/>
            - Qual o valor aproximado de investimento?
        </p>
        <p class="mb-8">
            3 - Negociação:
            <br/>
            - Proposta de compra do cliente
            <br/>
            - Desconto máximo (após proposta do cliente)
        </p>
        <p>
            4 - Fechamento:
            <br/>
            - Encaminhar email com etapas do processo até a entrega
            <br/>
            - Assinatura do contrato
            <br/>
            - Pagamento sinal
            <br/>
            - Pagamento de parcelas
            <br/>
            - Burocrácia do trade in
            <br/>
            - Análise de crédito bancário
        </p>
        <p>
            5 - Entrega:
            <br/>
            - Entrada do documento na marinha
            <br/>
            - Vistoria em loja embarcação pronta
            <br/>
            - Quitação
            <br/>
            - Entrega técnica no seco / água
        </p>
    `,
})
export class SalesAboutPanel {
    constructor(

    ) { }
}
