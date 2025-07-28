//Funções para abrir e fechar o modal
document.getElementById("title").addEventListener( 'click', function(){ 
    let classDisplay = document.getElementById("display");
    
    if (classDisplay.style.display === 'none'|| classDisplay.style.display === ''){
      classDisplay.style.cssText  = 
        'display: flex;' +
        'align-content: flex-start;'+
        'flex-wrap: wrap;' +
        'justify-content: space-between;' +
        'align-items: center;'
      meuFormulario.style.height = "150px";
    }else{
      classDisplay.style.display = 'none';
      meuFormulario.style.height = "100%";
    }
  });
  document.getElementById("titleCPF").addEventListener( 'click', function(){ 
      let classDisplay1 = document.getElementById("display_cpf");
      
      if (classDisplay1.style.display === 'none'|| classDisplay1.style.display === ''){
        classDisplay1.style.cssText  = 
          'display: flex;' +
          'align-content: flex-start;'+
          'flex-wrap: wrap;' +
          'justify-content: space-between;' +
          'align-items: center;'
        correcao_cpf.style.height = "200px";
      }else{
        classDisplay1.style.display = 'none';
        correcao_cpf.style.height = "100%";
      }
    });

    
  document.getElementById("title1").addEventListener( 'click', function(){
        let classDisplay = document.getElementById("display1"); 
        let idRelatorio = document.getElementById("relatorio")
      
      if (classDisplay.style.display === 'none'|| classDisplay.style.display === ''){
        classDisplay.style.cssText  = 
          'display: flex;' +
          'align-content: flex-start;'+
          'flex-wrap: wrap;' +
          'justify-content: space-between;' +
          'align-items: center;'
        idRelatorio.style.height = "395px";
        
      }else{
        classDisplay.style.display = 'none';
        idRelatorio.style.height = "100%";
      }

  });
  
  //Fim do modal





// Inicio Gerador de Codigo 
let meuFormulario = document.getElementById("meuFormulario")
let matricula = document.getElementById("matricula");
let codigo = document.getElementById("codigo");
let resultado = document.getElementById("result");

let textoCopiado2 = "";

const getCodigo = () =>{

  let xpathMatricula = '//*[@id="ContentPlaceHolder1_txbMatricula"]';
  let resultMatricula = document.evaluate(xpathMatricula, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  let elementMatricula = resultMatricula.singleNodeValue;

  
  let xpathCodigo = '//*[@id="ContentPlaceHolder1_gvContFiliados_lbCodigo_0"]';
  let resultCodigo = document.evaluate(xpathCodigo, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  let elementCodigo = resultCodigo.singleNodeValue ;
  

  let codigo =`${elementMatricula.value}_${elementCodigo.innerText}_`;
  return codigo
}

meuFormulario.addEventListener('submit', async(event) => {
  event.preventDefault();  

  const [tab] = await chrome.tabs.query({ active: true, currentWindow:true });

  chrome.scripting.executeScript({
    target:{ tabId: tab.id},
    function: getCodigo,
  }, (result) => {
      if (!chrome.runtime.lastError && result && result[0] && result[0].result) {
        var codigo = result[0].result;
        // Faça algo com o valor retornado (codigo)
        resultado.textContent = codigo;
        meuFormulario.style.height = "180px";
        console.log(codigo);
        navigator.clipboard.writeText(codigo)
      }
  });
});
//Fim do Gerador de Codigo

//Inicio Correção CPF
let resultadoCPF = document.getElementById("resultCPF");


correcao_cpf.addEventListener('submit', async(event) => {
    event.preventDefault();  

    let textCPF= document.getElementById("textCPF").value;
    
    function removerCaracteresEspeciais(texto) {
        
        return texto.replace(/[^\w\s]/gi, '');
    }

    
    resultadoCPF.textContent = removerCaracteresEspeciais(textCPF);
    correcao_cpf.style.height = "230px";
    navigator.clipboard.writeText(removerCaracteresEspeciais(textCPF))
  });



//Fim Correção CPF


//Baixar Relatório Filiado
document.getElementById("baixarFiliacao").addEventListener('click', function() {
  let start= document.getElementById("start");
  let end = document.getElementById("end");
  let startFormatado = alterarFormatoData(start.value)
  let endFormatado = alterarFormatoData(end.value)

  let linkFiliacao = `https://ctn.sistematodos.com.br/paginas/filiado/relatorio/FiliacaoPorVendedor.aspx?dataInicio=${startFormatado}&dataFim=${endFormatado}`;
  chrome.tabs.create({ url: linkFiliacao});
});

//Baixar Relatório Migração
document.getElementById("baixarMigracao").addEventListener('click', function() {
  let referenciaMigracao = document.getElementById("referencia");
  let referenciaMigracaoFormatado = alterarFormatoMigracao(referenciaMigracao.value)
  
  let linkMigracao = `https://ctn.sistematodos.com.br/paginas/filiado/relatorio/RelatorioFiliadosMigrados.aspx?referencia=${referenciaMigracaoFormatado}`
  chrome.tabs.create({ url: linkMigracao });
  
});




function alterarFormatoData(value) {
  var valor = value;

  if (valor) {
    var data = new Date(valor);
    var dia = data.getDate();
    var mes = data.getMonth(); // Adiciona +1, pois os meses em JavaScript são baseados em zero (janeiro é 0)
    var ano = data.getFullYear();

    dia += 1; // Adiciona 2 dias
    

    function testeMes (value){
      if (value === 3 || value === 5 || value === 8 || value === 10){
        return 30;
      } else if (value === 0 || value === 2 || value === 4 || value === 6 || value === 7 || value === 9 || value === 11){
        return 31;
      }else if (value = 1){
        return 28;
      }
    };
    
    // Verifica se o dia ultrapassou o limite do mês
    if (testeMes(mes) === 28 && dia > 28 ) {
      dia = 1;
      mes += 2;
    }else if (testeMes(mes)=== 30 && dia > 30){
      dia = 1;
      mes += 2;
    }else if (testeMes(mes)=== 31 && dia > 31){
      dia = 1;
      mes += 2;
    }else{
      mes += 1
    };
    


    // Verifica se o mês ultrapassou o limite de dezembro
    if (mes > 12) {
      mes = 1;
      ano += 1;
    }

    // Formata o dia e o mês para terem dois dígitos
    if (dia < 10) {
      dia = "0" + dia;
    }

    if (mes < 10) {
      mes = "0" + mes;
    }

    

    var dataFormatada = dia + "/" + mes + "/" + ano;
    return dataFormatada;
  }
}



  

  function alterarFormatoMigracao(data){
    var valor = data;
    if (valor){
      var data = new Date(valor);
      var mes = data.getMonth() + 2;
      var ano = data.getFullYear();
      if (mes < 10) {
        mes = "0" + mes ;
      }
      let dataFormatada = ano +"/"+ mes;
      return dataFormatada
    }
  }


