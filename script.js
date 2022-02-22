const divCarrinhoFull = document.querySelector('.details-carrinho-full');
const divDetailsCarrinho = document.querySelector('.details-carrinho');
const divContainerCarrinho = document.querySelector('.container-carrinho');
const divContainerBtnCarrinho = document.querySelector('.container-btn-carrinho');
const btnCarrinhoOtherDay = document.querySelector ('.btn-carrinho-buy-other-day');
const divListaProdutosCarrinho = document.querySelector('.lista-produtos-carrinho');
const contadorItensCarrinho = document.querySelectorAll('.contador-carrinho');
const containerCards = document.querySelector('.container-cards');
const containerTabs = document.querySelector('.container-nav-tabs');
const containerAllCards = document.querySelector('.cards');
const url = `https://sofalta.eu/api/v4/empreendimentos/lagoa/produtos/ingressos/ingressos?data=2022-02-25`;
const btnCarrinhoNext = document.querySelector('.btn-carrinho-next');
const valorCarrinhos = document.querySelectorAll('.valor-carrinho');
const divContainerCorpoSite = document.querySelector('.container-corpo-site');
const body = document.querySelector('body');
let objReturnFetch = {};


async function newFetch(){
  try {
    showLoandigWindow(true);
    let response = await fetch(url);
    if (!response.ok) {
      console.error('HTTP error! status: ' + response.status);
      newFetch()
      .catch(erro => {
      console.error('Erro: ' + erro);
      })
    }
   
    objReturnFetch = await response.json();
    createTabsAndContainerCards(objReturnFetch.grupos);
    tratarObjeto(objReturnFetch);
    
  }
  catch(erro){
    console.error('Erro : ' + erro);
    showLoandigWindow(false);
    divContainerCorpoSite.innerText = 'Erro no servidor! Tente recarregar a página';
    divContainerCorpoSite.style.height = '190px';
  }
}

newFetch()
.catch(erro => {
  console.error('Erro: ' + erro);
})

function showLoandigWindow(isShow){
  const detailsCarrinhoFull = document.querySelector('.details-carrinho-full');
  const containerBody = document.querySelector('.container-corpo-site');
  const containerHeader = document.querySelector('.container-header');
  const loader = document.querySelector('.loader');

  if (isShow){
    detailsCarrinhoFull.style.opacity = '0';
    containerBody.style.opacity = "0";
  } else{
    detailsCarrinhoFull.style.opacity = '1';
    containerBody.style.opacity = '1';
    loader.style.display = "none";
  }
}

function tratarObjeto(objDados){
  let finalObject = {};
  objDados.grupos.forEach((grupo) =>{
   const newObj = {[grupo.id]:objDados.itens.filter(item => 
      item.grupos.some(group => group === grupo.id)
    )};
    Object.assign(finalObject, newObj);

  })
  return finalObject;
}

function returnStateDetailsCartIsOpen(){
  const divContainerCarrinho = document.querySelector('.container-carrinho');
  return divContainerCarrinho.classList.contains('aberto');
}

function openOrClosedDetailsCart(openOrClosed){
  if (openOrClosed === 'open'){
    divContainerCarrinho.classList.remove('fechado');
    divContainerCarrinho.classList.add('aberto');
    divListaProdutosCarrinho.classList.add('aberto')
    if (+contadorItensCarrinho[0].innerHTML === 0){
      divContainerBtnCarrinho.classList.add('aberto-sem-produtos');
      divContainerBtnCarrinho.classList.remove('fechado')
    } else{
      divContainerBtnCarrinho.classList.add('aberto-com-produtos');
      divContainerBtnCarrinho.classList.remove('fechado')
    }

  } else if (openOrClosed === 'close'){
    divContainerCarrinho.classList.remove('aberto');
    divListaProdutosCarrinho.classList.remove('aberto')
    divContainerBtnCarrinho.classList.remove('aberto-sem-produtos');
    divContainerBtnCarrinho.classList.remove('aberto-com-produtos');
    divContainerCarrinho.classList.add('fechado');
    divListaProdutosCarrinho.classList.add('fechado')
    divContainerBtnCarrinho.classList.add('fechado');
    divContainerBtnCarrinho.classList.add('fechado');
  } else{
    console.error('O argumento openOrClosed é inválido');
  }
}

window.addEventListener('resize', function() {
  if (btnCarrinhoOtherDay.getBoundingClientRect().width <= 223){
    btnCarrinhoOtherDay.innerHTML = btnCarrinhoOtherDay.innerHTML.replace('Comprar para outro dia', 'Outro dia');
  } 
  else if (btnCarrinhoOtherDay.getBoundingClientRect().width > 223){
    btnCarrinhoOtherDay.innerHTML = btnCarrinhoOtherDay.innerHTML.replace('Outro dia', 'Comprar para outro dia');
  }
});

window.addEventListener('scroll', function(){
  let distanciaDivCarrinhoTop = divDetailsCarrinho.getBoundingClientRect().top;
  let distanciaDivContainerBtnCarrinhoTop = divContainerBtnCarrinho.getBoundingClientRect().top;
  if (distanciaDivCarrinhoTop <= -2){
    divCarrinhoFull.style.top = 0;
  }    
  else if (distanciaDivContainerBtnCarrinhoTop >= 72){
    divCarrinhoFull.style.top = '-90px';
  }
});

body.addEventListener('click',(event)=> {
  if(!event.target.classList.contains('details-carrinho')){
    if( returnStateDetailsCartIsOpen()){
      openOrClosedDetailsCart('close');
    }
  }
})

divDetailsCarrinho.addEventListener('click', (event) =>{
  if (returnStateDetailsCartIsOpen()){
    openOrClosedDetailsCart('close');
  } else {
    openOrClosedDetailsCart('open');
  }
})

divListaProdutosCarrinho.addEventListener('click', (event) =>{
  openOrClosedDetailsCart('close');
})

divContainerBtnCarrinho.addEventListener('click', (event) =>{
  console.log(event.target);
  if (returnStateDetailsCartIsOpen() && event.target.classList.contains('container-btn-carrinho')){
    openOrClosedDetailsCart('close');
  } 
})

function contadorItens(operacao, valorItem, idItem){
  if (operacao === '+'){
    btnCarrinhoNext.removeAttribute('disabled');
    calcValueCart('+', valorItem, idItem);
    contadorItensCarrinho.forEach(contador =>{
      +contador.innerText ++;
    })
  } else if (operacao === '-') {
    calcValueCart('-', valorItem, idItem);
    contadorItensCarrinho.forEach(contador =>{
      +contador.innerText --;
    })
    if (+contadorItensCarrinho[0].innerText === 0){
      btnCarrinhoNext.setAttribute('disabled','');
    }
  }  
  else{
    console.error('Valor passado como operacao Inválida')
  }
}   

function calcValueCart(operacao, valor, idItem){
  const valorUnitario = +valor.replace(',','')/100;
  if (operacao === '+'){
    addOrRemoveItemDetailsCart('add', idItem);
    valorCarrinhos.forEach(valorCarrinho => {
      let valorAtual = +valorCarrinho.innerText.replace(',','').replace('.','')/100;
      //console.log(valorAtual);
      let valorFinal = valorAtual + valorUnitario;
      //console.log(valorFinal);
      valorCarrinho.innerText = valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 , currency: 'BRL' });
    })
  } else if (operacao === '-'){
    addOrRemoveItemDetailsCart('remove', idItem);
    valorCarrinhos.forEach(valorCarrinho => {
      let valorAtual = +valorCarrinho.innerText.replace(',','').replace('.','')/100;
      let valorFinal = valorAtual - valorUnitario;
      valorCarrinho.innerText = valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 , currency: 'BRL' });
    })
  } else{
    console.error('Valor passado como operacao Inválida')
  }
}

function createAndInsertItemDetailsCart(idItem){
  const nomeProduto = returnCurrentElementCard('nome-produto', idItem).innerText;
  let valorProduto = returnCurrentElementCard('valor-produto', idItem).innerText;
  valorProduto = (+valorProduto.replace(',','')/100).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
  const newProdutosListaCarrinho = document.createElement('div');
  newProdutosListaCarrinho.classList.add('produto-lista-carrinho')
  newProdutosListaCarrinho.setAttribute('iditem', idItem);
  newProdutosListaCarrinho.innerHTML = 
  `<div class="nome-produto-lista-produtos-carrinho" iditem="${idItem}">${nomeProduto}</div>
  <div class="container-qtde-e-valor-produto">
  <div class="qtde-produto-lista-produtos-carrinho" iditem="${idItem}">1x</div>
  <div class="valor-produto-lista-produtos-carrinho" iditem="${idItem}">${valorProduto}</div>
  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  </div>`
  divListaProdutosCarrinho.appendChild(newProdutosListaCarrinho);
}

function updateItemDetailsCart(idItem, operacao){
  const elementoQtdeAtualItem = document.querySelector(`.qtde-produto-lista-produtos-carrinho[idItem="${idItem}"]`);
  let qtdeAtualItem = elementoQtdeAtualItem.innerText;
  let qtdeFinalItem;
  if (operacao === '+'){
    qtdeFinalItem = +qtdeAtualItem.replace('x','') + 1;
    elementoQtdeAtualItem.innerText = `${qtdeFinalItem}x`;
  } else if (operacao === '-'){

  } else {
    console.error(`O parâmetro "operacao" informado é inválido | Parâmetro: ${opecarao}`)
  }
}

function addOrRemoveItemDetailsCart(addOrRemove, idItem){
  if(addOrRemove === 'add'){
    const produtosListaCarrinho = document.querySelectorAll('.produto-lista-carrinho');
    const possuiNaLista = Array.from(produtosListaCarrinho).some(produto => produto.getAttribute('iditem') === idItem);
    console.log(possuiNaLista);
    if (possuiNaLista){
      updateItemDetailsCart(idItem, '+');
    } else {
      createAndInsertItemDetailsCart(idItem)
    }
  } else if (addOrRemove === 'remove'){
    console.log('Remover item a lista do carrinho');
  } else{
    console.error(`O argumento addOrRemove é inválido! - Argumento informado: ${addOrRemove}`);
  }
}

function createCard(containersCard){
  const objTratatdo = tratarObjeto(objReturnFetch);
  containersCard.forEach(container => {
    objTratatdo[container.getAttribute('idgroup')].forEach(item =>{
      let newCard = document.createElement('div');
      newCard.classList.add('card');
      newCard.setAttribute('idgroup', item.grupos);
      newCard.setAttribute('idItem', item.iditens);

      //Tratando o valor do produto do card
      let valorOriginal = item.valorOriginal;
      const valorTarifarioAtual = item.tarifarios[0].valor;
      let classActivValueOriginal = '';

      if (valorOriginal === valorTarifarioAtual){
        valorOriginal = '';
      } else{
        classActivValueOriginal = 'valor-original-card';
        valorOriginal = (item.valorOriginal/100).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
      }
      
      let valorFinal = (valorTarifarioAtual/100).toLocaleString("pt-BR", { minimumFractionDigits: 2, currency: 'BRL' });;


      //Tratando o campo de regras de idade do card
      let condicaoIdade;
      let classeContemFaixaEtaria = "ativo";
      if (item.itens.ingressos.length){
        const idadeMin = item.itens.ingressos[0].idade_minima;
        const idadeMax = item.itens.ingressos[0].idade_maxima;
        if (idadeMax && idadeMin){
          condicaoIdade = `${idadeMin} a ${idadeMax} anos`
        } else if (idadeMax && !idadeMin){
          condicaoIdade = `Até ${idadeMax} anos`
        } else if (!idadeMax && idadeMin){
          condicaoIdade = `A partir de ${idadeMin} anos`
        }
      } else{
        classeContemFaixaEtaria = 'inativo';
      }


      newCard.innerHTML =
      `<img src="${item.imagem}" alt="" class="img-card">
        <div class="infos-card">
          <div class="container-descricao-card">
            <div class="container-nome-valor-produto-card">
              <div class="nome-produto" idItem="${item.iditens}">${item.nome}</div>
              <div class="container-valor-produto">
                <span class="${classActivValueOriginal}">${valorOriginal}</span>
                <div class="container-display-valor">
                  <span>R$</span>
                  <div class="valor-produto" idItem="${item.iditens}">${valorFinal}</div>
                </div>
              <div class="max-parcelamento">${`em até ${objReturnFetch.maximoQtdParcelamento}x`}</div>
            </div>
          </div>
          <div class="descricao-card">
            <p>${item.descricao}</p>
          </div>
        </div>
        <div class="container-regras-card">
          <div class="regra-card-${classeContemFaixaEtaria}">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="23px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span class="regra-idade">${condicaoIdade}</span> 
          </div>
          <div class="regra-card-ativo"> 
            <svg class="regra-condicao" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="23px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span class="regra-condicao">Regras e condições</span>
          </div> 
        </div>
        <div class="container-btn-card isComprar">
          <div class="btn-comprar-card isComprar" idItem="${item.iditens}">
            <div class="btn btn-subtrair isComprarBtn" idItem="${item.iditens}">-</div><span class="label-quantidade-produto" idItem="${item.iditens}">Comprar</span>
            <div class="btn btn-adicionar isComprarBtn" idItem="${item.iditens}">+</div>
          </div>
        </div>
      </div>`
      container.appendChild(newCard);
    })
  })
  const btnsComprar = document.querySelectorAll(`.btn-comprar-card`);
  addEventsInCard(btnsComprar);
}

//Função para add evento de clique em todos botões de comprar dos cards
function addEventsInCard(btnsComprar){
  btnsComprar.forEach(btn => {
    btn.addEventListener('click', event => {
      //Verifica se clicou na label "Comprar"
      if (event.target.classList.contains('label-quantidade-produto') &&  event.target.innerText === 'Comprar'){
        transformButtonBuy(event.target.getAttribute('idItem'), 'twoButtons');
      }  
      //Verifica se clicou no botão com a plavra "Comprar"
      if(event.target.classList.contains('btn-comprar-card') && event.target.classList.contains('isComprar')){
        transformButtonBuy(event.target.getAttribute('idItem'), 'twoButtons');
      }
      //Subtrai a quantidade de itens do card, se for zerá-lo volta ele a forma original
      if (event.target.classList.contains('btn-subtrair')){
        subtrairQtdeItensCard(event.target.getAttribute('idItem'));
      }  
      //Soma +1 na quantidade de itens do card
      if (event.target.classList.contains('btn-adicionar')){
        addQtdeItensCard(event.target.getAttribute('idItem'));
      }
      
    })
  })
  showLoandigWindow(false);
}

function transformButtonBuy(idItem, versao){
  const btnClicado = returnCurrentElementCard('btn-comprar-card', idItem);
  const btnSubCart = returnCurrentElementCard('btn-subtrair', idItem);
  const btnAddCart = returnCurrentElementCard('btn-adicionar', idItem);
  const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
  const valorItem = returnCurrentElementCard('valor-produto', idItem);
if (versao === 'twoButtons'){
  contadorItens('+', valorItem.innerText, idItem);
  labelQtdeProdutos.innerText = '1';
  btnClicado.classList.remove('isComprar');
  btnAddCart.classList.remove('isComprarBtn');
  btnSubCart.classList.remove('isComprarBtn');
} else if (versao === 'original'){
  labelQtdeProdutos.innerText = 'Comprar';
  btnClicado.classList.add('isComprar');
  btnAddCart.classList.add('isComprarBtn');
  btnSubCart.classList.add('isComprarBtn');
} else {
  console.log('Erro: segundo parametro "versao" inválido');
}
}

function subtrairQtdeItensCard(idItem){
const valorItem = returnCurrentElementCard('valor-produto', idItem);
contadorItens('-', valorItem.innerText, idItem);
const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
if(+labelQtdeProdutos.innerText === 1){
  transformButtonBuy(idItem, 'original')
} else{
  +labelQtdeProdutos.innerText--
}
}

function addQtdeItensCard(idItem){
const valorItem = returnCurrentElementCard('valor-produto', idItem);
contadorItens('+', valorItem.innerText, idItem);
const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
+labelQtdeProdutos.innerText++;
}

function returnCurrentElementCard(classe, idItem){
return document.querySelector(`.${classe}[idItem="${idItem}"]`);
}

function createTabsAndContainerCards(arrayGroups){
  arrayGroups.forEach((grupo, index) =>{
    let newButton = document.createElement('button');
    newButton.classList.add('btn-tab');
    if (index === 0){
      newButton.classList.add('btn-ativo');
    }
    newButton.setAttribute('idgroup',`${grupo.id}`);
    newButton.innerText = `${grupo.nome}`;
    containerTabs.appendChild(newButton);
  })

  
  arrayGroups.forEach((grupo, index) => {
    const newContainer = document.createElement('div');
    newContainer.classList.add('container-cards');
    if (index === 0){
      newContainer.classList.add('container-cards-ativo');
    }
    newContainer.setAttribute('idgroup', grupo.id);
    containerAllCards.appendChild(newContainer);
  })

  const btnsNav = document.querySelectorAll('.btn-tab');
  const containersCard = document.querySelectorAll('.container-cards');
  
  //Evento para navegação de tabs.
  btnsNav.forEach((btn) =>{
    btn.addEventListener('click', () =>{
      btnsNav.forEach(btn => {
        if (btn.classList.contains('btn-ativo')){
          btn.classList.remove('btn-ativo');
        }
      })
      btn.classList.add('btn-ativo');
      const idGroupBtn = btn.getAttribute('idgroup');
      

      containersCard.forEach(container => {
        const idGroupContainer = container.getAttribute('idgroup');
        if (container.classList.contains('container-cards-ativo')){
          container.classList.remove('container-cards-ativo');
        } else if (idGroupBtn === idGroupContainer){
          container.classList.add('container-cards-ativo');
        }
      })   
    })
  })
  createCard(containersCard);
  
}









