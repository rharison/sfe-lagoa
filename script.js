const divCarrinhoFull = document.querySelector('.details-carrinho-full');
const divDetailsCarrinho = document.querySelector('.details-carrinho');
const divContainerCarrinho = document.querySelector('.container-carrinho');
const divContainerBtnCarrinho = document.querySelector('.container-btn-carrinho');
const divListaProdutosCarrinho = document.querySelector('.lista-produtos-carrinho');
const contadorItensCarrinho = document.querySelectorAll('.contador-carrinho');
const containerCards = document.querySelector('.container-cards');
const containerTabs = document.querySelector('.container-nav-tabs');
const containerAllCards = document.querySelector('.cards');
const btnCarrinhoNext = document.querySelector('.btn-carrinho-next');
const valorCarrinhos = document.querySelectorAll('.valor-carrinho');
const spanNenhumProdutoListaCarrinho = document.querySelector('.nenhum-produto');
const divContainerCorpoSite = document.querySelector('.container-corpo-site');
const setasCarrinho = document.querySelectorAll('.seta-carrinho');
const body = document.querySelector('body');
let objReturnFetch = {};

newFetch();

async function newFetch(){
  try {
    const url = `https://sofalta.eu/api/v4/empreendimentos/lagoa/produtos/ingressos/ingressos?data=2022-03-30`;
    let response = await fetch(url);
    if (!response.ok) {
      console.error('HTTP error! status: ' + response.status)
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
    hiddenLoandigWindow()
    divContainerCorpoSite.innerText = 'Erro no servidor! Tente recarregar a página';
    divContainerCorpoSite.style.height = '190px';
  }
}

function hiddenLoandigWindow(){
  document.querySelector('.details-carrinho-full').style.opacity = '1';
  document.querySelector('.container-corpo-site').style.opacity = '1';
  document.querySelector('.loader').style.display = "none";
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

window.addEventListener('resize',(event) => {
  const btnCarrinhoOtherDay = document.querySelector('.btn-carrinho-buy-other-day');
  btnCarrinhoOtherDay.innerText = btnCarrinhoOtherDay.offsetWidth <= 223 ?  'Outro dia' : 'Comprar para outro dia';
});

window.addEventListener('scroll', function(){
  const distanciaDoElementoAoTop = -2;
  divCarrinhoFull.style.top = divDetailsCarrinho.getBoundingClientRect().top <= distanciaDoElementoAoTop ? 0 : '-90px'
});

body.addEventListener('click',(event)=> {
  const classesCondicao = ['details-carrinho', 'details-carrinho-full', 'btn-carrinho'];
  if(classesCondicao.some(classe => event.target.classList.contains(classe))) return;
  if(returnStateDetailsCartIsOpen()) openOrClosedDetailsCart('close');
})

divDetailsCarrinho.addEventListener('click', () =>{
  const openOrClosed = returnStateDetailsCartIsOpen() ? 'close' : 'open';
  openOrClosedDetailsCart(openOrClosed);
})

divCarrinhoFull.addEventListener('click', () =>{
  window.scrollTo(0, 345);
  if (!returnStateDetailsCartIsOpen()) openOrClosedDetailsCart('open');
})

function returnStateDetailsCartIsOpen(){
  return document.querySelector('.container-carrinho').classList.contains('aberto');
}

function openOrClosedDetailsCart(openOrClosed){
  setasCarrinho.forEach(seta => seta.classList.toggle('para-cima'));
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
  }
}

function contadorItens(operacao, valorItem, idItem, qtdeItemRemover, qtdeItemAdiconar){
  let qtdeContador = Number(contadorItensCarrinho[0].innerText);
  switch (operacao) {
    case '+':
      btnCarrinhoNext.removeAttribute('disabled');
      qtdeContador++
    break;
    case '-':
      qtdeContador--
    break;
    case '-all':
      qtdeContador = qtdeContador - qtdeItemRemover;
    break;
    case 'fromLocalStorage':
      qtdeContador = qtdeContador + qtdeItemAdiconar;
    break;
  }
  contadorItensCarrinho.forEach(contador => contador.innerText = qtdeContador);
  calcValueCart(operacao, valorItem, idItem);
  if (!Number(contadorItensCarrinho[0].innerText)) btnCarrinhoNext.setAttribute('disabled','');
}   

function calcValueCart(operacao, valor, idItem) {
  const valorAtual = Number(valorCarrinhos[0].innerText.replace(',','').replace('.','')/100);
  let valorFinal;
  switch (operacao) {
     case '+':
      valorFinal = valorAtual + valor;
      addOrRemoveItemDetailsCart('add', idItem);
    break;
    case '-':
      valorFinal = valorAtual - valor;
      addOrRemoveItemDetailsCart('remove', idItem);
    break;
    case '-all':
      valorFinal = valorAtual - Number(valor.toFixed(2));
    break;
    case 'fromLocalStorage':
      valorFinal = valorAtual + valor;
    break;
  }
  valorCarrinhos.forEach(valorCarrinho => valorCarrinho.innerText = valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 , currency: 'BRL' }));
} 

function createAndInsertItemDetailsCart(idItem, type){ 
  const newProdutosListaCarrinho = document.createElement('div');
  newProdutosListaCarrinho.classList.add('produto-lista-carrinho')
  newProdutosListaCarrinho.setAttribute('iditem', idItem);

  if (type === 'fromLocalStorage'){
    const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
    newProdutosListaCarrinho.innerHTML = htmlInNewDivProdutoListaCarrinho(idItem, objItensListaLocalStorage[idItem].nomeProduto, objItensListaLocalStorage[idItem].qtdeProduto, objItensListaLocalStorage[idItem].valorProduto);
    divListaProdutosCarrinho.appendChild(newProdutosListaCarrinho);
  }

  if (type === 'new'){
    const nomeProduto = returnCurrentElementCard('nome-produto', idItem).innerText;
    let valorProduto = returnCurrentElementCard('valor-produto', idItem).innerText;
    valorProduto = Number(valorProduto.replace(',','')/100).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
    newProdutosListaCarrinho.innerHTML = htmlInNewDivProdutoListaCarrinho(idItem, nomeProduto, 1, valorProduto);
    divListaProdutosCarrinho.appendChild(newProdutosListaCarrinho);
    const newObjItensLista = {[idItem]:{nomeProduto: nomeProduto, qtdeProduto: 1, valorProduto: valorProduto}};
    saveItensListaInLocalStorare(newObjItensLista);
  } 

  const iconRemoveItemListCart = document.querySelector(`.icon-excluir-item-lista-produtos-carrinho[iditem="${idItem}"`);
  iconRemoveItemListCart.addEventListener('click', function(event){
    removeItemListCart(idItem, event);
  });
}

function saveItensListaInLocalStorare(newObjItensLista) {
  const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
  const objDadosSalvarLocalStorage = objItensListaLocalStorage ? {...objItensListaLocalStorage, ...newObjItensLista} : newObjItensLista;
  localStorage.setItem(`itensLista`, JSON.stringify(objDadosSalvarLocalStorage));
}

function htmlInNewDivProdutoListaCarrinho(idItem, nomeProduto, qtdeProduto, valorProduto){
  return `<div class="nome-produto-lista-produtos-carrinho" iditem="${idItem}">${nomeProduto}</div>
  <div class="container-qtde-e-valor-produto">
  <div class="qtde-produto-lista-produtos-carrinho" iditem="${idItem}">${qtdeProduto}x</div>
  <div class="valor-produto-lista-produtos-carrinho" iditem="${idItem}">${valorProduto}</div>
  <svg class ="icon-excluir-item-lista-produtos-carrinho" iditem="${idItem}" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  </div>`
}

function removeItemListCart(idItem, event){
  const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
  const itenListCart = document.querySelector(`.produto-lista-carrinho[iditem="${idItem}"]`);
  const qtdeItenListCart = +document.querySelector(`.qtde-produto-lista-produtos-carrinho[iditem="${idItem}"]`).innerText.replace('x','');
  const valorTotalItenListCart = +(document.querySelector(`.valor-produto-lista-produtos-carrinho[iditem="${idItem}"]`).innerText.replace('R$', '').replace(',','').replace('.','')/100) * qtdeItenListCart;
  divListaProdutosCarrinho.removeChild(itenListCart);
  if (document.querySelectorAll('.produto-lista-carrinho').length === 0){
    divListaProdutosCarrinho.appendChild(spanNenhumProdutoListaCarrinho);
  } else{
    event.stopPropagation();
    openOrClosedDetailsCart('open');
  }
  contadorItens('-all', valorTotalItenListCart, idItem, qtdeItenListCart);
  delete objItensListaLocalStorage[idItem];
  localStorage.setItem(`itensLista`, JSON.stringify(objItensListaLocalStorage));
  transformButtonBuy(idItem, 'original');
}

function updateItemDetailsCart(idItem, operacao){
  const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
  const elementoProdutoLista = document.querySelector(`.produto-lista-carrinho[idItem="${idItem}"]`);
  const elementoQtdeAtualItem = document.querySelector(`.qtde-produto-lista-produtos-carrinho[idItem="${idItem}"]`);
  let qtdeAtualItem = +elementoQtdeAtualItem.innerText.replace('x','');
  let qtdeFinalItem;
  if (operacao === '+'){
    qtdeFinalItem = qtdeAtualItem + 1;
    elementoQtdeAtualItem.innerText = `${qtdeFinalItem}x`;
    const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
    objItensListaLocalStorage[idItem].qtdeProduto = qtdeFinalItem;
    localStorage.setItem(`itensLista`, JSON.stringify(objItensListaLocalStorage));
  } 
  if (operacao === '-'){
    if (qtdeAtualItem === 1){
      divListaProdutosCarrinho.removeChild(elementoProdutoLista);
      delete objItensListaLocalStorage[idItem];
      localStorage.setItem(`itensLista`, JSON.stringify(objItensListaLocalStorage));
      const produtosListaCarrinho = document.querySelectorAll('.produto-lista-carrinho');
      if (produtosListaCarrinho.length === 0) divListaProdutosCarrinho.appendChild(spanNenhumProdutoListaCarrinho);
    } else {
      qtdeFinalItem = qtdeAtualItem - 1;
      elementoQtdeAtualItem.innerText = `${qtdeFinalItem}x`;
      objItensListaLocalStorage[idItem].qtdeProduto = qtdeFinalItem;
      localStorage.setItem(`itensLista`, JSON.stringify(objItensListaLocalStorage));
    }
  } 
}

function addOrRemoveItemDetailsCart(addOrRemove, idItem){
  const produtosListaCarrinho = document.querySelectorAll('.produto-lista-carrinho');
  const possuiNaLista = Array.from(produtosListaCarrinho).some(produto => produto.getAttribute('iditem') === idItem);
  if(addOrRemove === 'add'){
    if (produtosListaCarrinho.length === 0) divListaProdutosCarrinho.removeChild(spanNenhumProdutoListaCarrinho);
    possuiNaLista ? updateItemDetailsCart(idItem, '+') : createAndInsertItemDetailsCart(idItem, 'new');
  } 
  if (addOrRemove === 'remove') updateItemDetailsCart(idItem, '-');
}

function createCard(containersCard){
  const objTratatdo = tratarObjeto(objReturnFetch);
  const objItensListaLocalStorage = JSON.parse(localStorage.getItem('itensLista'));
  
  containersCard.forEach(container => {
    objTratatdo[container.getAttribute('idgroup')].forEach((item) =>{
      let newCard = document.createElement('div');
      newCard.classList.add('card');
      newCard.setAttribute('idgroup', item.grupos);
      newCard.setAttribute('idItem', item.iditens)
      newCard.setAttribute('style', `order: ${item[item.grupos[0]]}`);

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
      let urlImgMaisVendido = '';
      let classeMaisVendido = '';
      if (item.idGroupMaisVendidos.length > 0){
        urlImgMaisVendido = '/img/mais-vendido.png';
        classeMaisVendido = 'img-imagem-mais-vendido'
      } 
      let classeIsComprar = 'isComprar';
      let classeIsComprarBtn = 'isComprarBtn';
      let palavraComprarOuQtde = 'Comprar'

      if(objItensListaLocalStorage[item.iditens]){
        classeIsComprar = '';
        classeIsComprarBtn = '';
        qtdeItem = Number(objItensListaLocalStorage[item.iditens].qtdeProduto);
        palavraComprarOuQtde = Number(objItensListaLocalStorage[item.iditens].qtdeProduto);
        createAndInsertItemDetailsCart(item.iditens, 'fromLocalStorage');
        const valorUnitarioItem = Number(objItensListaLocalStorage[item.iditens].valorProduto.replace('R$','').replace(',','.'));
        contadorItens('fromLocalStorage', valorUnitarioItem * qtdeItem, item.iditens, '', qtdeItem);
      }
      newCard.innerHTML = htmlToNewCard(item.iditens, item.imagem, classeMaisVendido, urlImgMaisVendido, item.nome, classActivValueOriginal, valorOriginal, valorFinal, objReturnFetch.maximoQtdParcelamento, item.descricao, classeContemFaixaEtaria, condicaoIdade, classeIsComprar, classeIsComprarBtn, palavraComprarOuQtde);
      
      container.appendChild(newCard);
    })
  })
  const btnsComprar = document.querySelectorAll(`.btn-comprar-card`);
  addEventsInCard(btnsComprar);
}

function htmlToNewCard(idItem, urlImgCard, classeMaisVendido, urlImgMaisVendido, nomeItem, classeActivValueOriginal, valorOriginal, valorFinal, maximoParcelamento, descricaoItem, classeContemFaixaEtaria, condicaoIdade, classeIsComprar, classeIsComprarBtn, palavraComprarOuQtde){
  return `<img src="${urlImgCard}" alt="" class="img-card">
  <img class="${classeMaisVendido}" src="${urlImgMaisVendido}">
    <div class="infos-card">
      <div class="container-descricao-card">
        <div class="container-nome-valor-produto-card">
          <div class="nome-produto" idItem="${idItem}">${nomeItem}</div>
          <div class="container-valor-produto">
            <span class="${classeActivValueOriginal}">${valorOriginal}</span>
            <div class="container-display-valor">
              <span>R$</span>
              <div class="valor-produto" idItem="${idItem}">${valorFinal}</div>
            </div>
          <div class="max-parcelamento">${`em até ${maximoParcelamento}x`}</div>
        </div>
      </div>
      <div class="descricao-card">
        <p>${descricaoItem}</p>
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
    <div class="container-btn-card ${classeIsComprar}">
      <div class="btn-comprar-card ${classeIsComprar}" idItem="${idItem}">
        <div class="btn btn-subtrair ${classeIsComprarBtn}" idItem="${idItem}">-</div><span class="label-quantidade-produto" idItem="${idItem}">${palavraComprarOuQtde}</span>
        <div class="btn btn-adicionar ${classeIsComprarBtn}" idItem="${idItem}">+</div>
      </div>
    </div>
  </div>`
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
  hiddenLoandigWindow();
}

function transformButtonBuy(idItem, versao){
  const btnClicado = returnCurrentElementCard('btn-comprar-card', idItem);
  const btnSubCart = returnCurrentElementCard('btn-subtrair', idItem);
  const btnAddCart = returnCurrentElementCard('btn-adicionar', idItem);
  const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
  const valorItem = returnCurrentElementCard('valor-produto', idItem).innerText.replace(',','')/100;
  if (versao === 'twoButtons'){
    contadorItens('+', Number(valorItem), idItem);
    labelQtdeProdutos.innerText = '1';
    btnClicado.classList.remove('isComprar');
    btnAddCart.classList.remove('isComprarBtn');
    btnSubCart.classList.remove('isComprarBtn');
  } else if (versao === 'original'){
    labelQtdeProdutos.innerText = 'Comprar';
    btnClicado.classList.add('isComprar');
    btnAddCart.classList.add('isComprarBtn');
    btnSubCart.classList.add('isComprarBtn');
  } 
}

function subtrairQtdeItensCard(idItem){
const valorItem = returnCurrentElementCard('valor-produto', idItem).innerText.replace(',','')/100;
contadorItens('-', Number(valorItem), idItem);
const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
if(+labelQtdeProdutos.innerText === 1){
  transformButtonBuy(idItem, 'original')
} else{
  +labelQtdeProdutos.innerText--
}
}

function addQtdeItensCard(idItem){
const valorItem = returnCurrentElementCard('valor-produto', idItem).innerText.replace(',','')/100;
contadorItens('+', Number(valorItem), idItem);
const labelQtdeProdutos = returnCurrentElementCard('label-quantidade-produto', idItem);
+labelQtdeProdutos.innerText++;
}

function returnCurrentElementCard(classe, idItem){
return document.querySelector(`.${classe}[idItem="${idItem}"]`);
}

function createTabsAndContainerCards(arrayGroups){
  //Criando e adicionando os botões de navegação por tabs e setando o primeiro como o botão "ativo".
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

  // Criando e adicionando os containers de cards de navegação por tabs e colocando o primeiro container como "Ativo";
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
      if (container.classList.contains('container-cards-ativo') && idGroupContainer != idGroupBtn){
        container.classList.remove('container-cards-ativo');
      } else if (idGroupBtn === idGroupContainer){
        container.classList.add('container-cards-ativo');
      }
      })   
    })
  })
  createCard(containersCard);
}

