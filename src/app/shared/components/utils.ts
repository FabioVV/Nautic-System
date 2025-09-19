export interface SelectItem {
    name: string
    code: string
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

