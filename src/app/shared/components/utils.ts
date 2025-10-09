export interface SelectItem {
    name: string
    code: string
}

export const BrStates: SelectItem[] = [
  { name: 'Acre', code: 'AC' },
  { name: 'Alagoas', code: 'AL' },
  { name: 'Amapá', code: 'AP' },
  { name: 'Amazonas', code: 'AM' },
  { name: 'Bahia', code: 'BA' },
  { name: 'Ceará', code: 'CE' },
  { name: 'Distrito Federal', code: 'DF' },
  { name: 'Espírito Santo', code: 'ES' },
  { name: 'Goiás', code: 'GO' },
  { name: 'Maranhão', code: 'MA' },
  { name: 'Mato Grosso', code: 'MT' },
  { name: 'Mato Grosso do Sul', code: 'MS' },
  { name: 'Minas Gerais', code: 'MG' },
  { name: 'Pará', code: 'PA' },
  { name: 'Paraíba', code: 'PB' },
  { name: 'Paraná', code: 'PR' },
  { name: 'Pernambuco', code: 'PE' },
  { name: 'Piauí', code: 'PI' },
  { name: 'Rio de Janeiro', code: 'RJ' },
  { name: 'Rio Grande do Norte', code: 'RN' },
  { name: 'Rio Grande do Sul', code: 'RS' },
  { name: 'Rondônia', code: 'RO' },
  { name: 'Roraima', code: 'RR' },
  { name: 'Santa Catarina', code: 'SC' },
  { name: 'São Paulo', code: 'SP' },
  { name: 'Sergipe', code: 'SE' },
  { name: 'Tocantins', code: 'TO' }
]

export function openWpp(phone: string){
    window.open(`https://api.whatsapp.com/send?phone=+55${phone}&text=Olá`, "_blank")
}

export function showLoading() {

    function removeLoadingGif(forceClose = false) {
        const LOADING_GIF_HTML_ELEMENT = document.getElementById('loading_stuff')

        if (forceClose === true) {
            if (LOADING_GIF_HTML_ELEMENT) {
                LOADING_GIF_HTML_ELEMENT.remove()
            }
            return
        }

        if (LOADING_GIF_HTML_ELEMENT) {
            LOADING_GIF_HTML_ELEMENT.remove()
        }
    }

    const LOADING_GIF = `
      <div id='loading_stuff' style='position: fixed;
                              background-color: rgba(255, 255, 255, 0.7);
                              filter: alpha(opacity=65);
                              -moz-opacity: 0.65;
                              padding: 2px;
                              font-weight: bold;
                              width: 100%;
                              height:100%;
                              box-shadow: -2px 0 6px rgba(0, 0, 0, 0.3);
                              margin-bottom: 0px;
                              text-align: center;
                              z-index: 9999;
                              top:0;'
                              ondblclick="removeLoadingGif(true);" >
          <div style="text-align: center;position:relative;top:35%; ">
            <i class="pi pi-spin pi-spinner" style="font-size: 7em"></i>
          </div>
      </div>  
  `
    document.body.insertAdjacentHTML('beforeend', LOADING_GIF)

    return removeLoadingGif
}

export function formatBRLMoney(amount: string) {
    const _amount = parseFloat(amount)

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    // Format the amount
    const formattedAmount = formatter.format(_amount)
    return formattedAmount
}

export function formatBRLDate(date: any) {
    const brFormatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC' 
    });

    return brFormatter.format(new Date(date))
}


export function firstDayOfMonth(d: Date = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function lastDayOfMonth(d: Date = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}
