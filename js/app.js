// =============================
// REFERENCIAS
// =============================
const inputMonto = document.getElementById('monto');
const tipoCredito = document.getElementById('tipoCredito');
const tipoEscritura = document.getElementById('tipoEscritura');
const opcionesEscritura = document.getElementById('opcionesEscritura');
const resultadoDiv = document.getElementById('resultado');
const btnCalcular = document.getElementById('btnCalcular');
const btnImprimir = document.getElementById('btnImprimir');
const ubicacionAvaluoContainer = document.getElementById('ubicacionAvaluoContainer');
const ubicacionAvaluo = document.getElementById('ubicacionAvaluo');


// =============================
// FORMATO QUETZALES
// =============================
function formatoQuetzales(valor) {
  return valor.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


// =============================
// FORMATO INPUT SUAVE
// =============================
inputMonto.addEventListener('input', function (e) {
  let valor = e.target.value;
  valor = valor.replace(/Q\s?/g, '');
  valor = valor.replace(/[^0-9.]/g, '');

  const partes = valor.split('.');
  if (partes.length > 2) {
    valor = partes[0] + '.' + partes[1];
  }

  e.target.value = valor;
});

inputMonto.addEventListener('blur', function (e) {
  let valor = e.target.value;
  if (!valor) return;

  const numero = parseFloat(valor);
  if (isNaN(numero)) {
    e.target.value = '';
    return;
  }

  e.target.value = "Q " + formatoQuetzales(numero);
});

inputMonto.addEventListener('focus', function (e) {
  let valor = e.target.value;
  valor = valor.replace(/Q\s?/g, '').replace(/,/g, '');
  e.target.value = valor;
});


// =============================
// MOSTRAR UBICACIÓN AVALÚO AUTOMÁTICO
// =============================
function validarUbicacionAvaluo() {

  let valor = inputMonto.value
    .replace(/Q\s?/g, '')
    .replace(/,/g, '');

  const monto = parseFloat(valor);
  const tipo = tipoCredito.value;

  if (tipo === 'hipotecario' && monto > 400000) {
    ubicacionAvaluoContainer.classList.remove('hidden');
  } else {
    ubicacionAvaluoContainer.classList.add('hidden');
    ubicacionAvaluo.value = '';
  }
}

inputMonto.addEventListener('input', validarUbicacionAvaluo);
tipoCredito.addEventListener('change', validarUbicacionAvaluo);


// =============================
// MOSTRAR OPCIONES ESCRITURA
// =============================
tipoCredito.addEventListener('change', function () {
  if (this.value === 'hipotecario') {
    opcionesEscritura.classList.remove('hidden');
  } else {
    opcionesEscritura.classList.add('hidden');
    tipoEscritura.value = '';
  }
});


// =============================
// CALCULAR
// =============================
btnCalcular.addEventListener('click', function () {

  const montoTexto = inputMonto.value
    .replace(/Q\s?/g, '')
    .replace(/,/g, '');

  const monto = parseFloat(montoTexto);
  const tipo = tipoCredito.value;
  const escritura = tipoEscritura.value;

  if (!monto || monto <= 0 || !tipo) {
    alert("Por favor complete los campos correctamente.");
    return;
  }

  // =============================
  // VALIDACIÓN MICROCRÉDITO
  // =============================
  if (tipo === 'microcredito') {
    if (monto < 1000 || monto > 30000) {
      alert("Según políticas vigentes, el Microcrédito solo permite montos de Q 1,000.00 a Q 30,000.00.");
      return;
    }
  }

  let gastosAdmin = 0;
  let pignoracion = 0;
  let avaluo = 0;
  let hipoteca = 0;
  let total = 0;
  let liquido = 0;


// =============================
// GASTOS ADMINISTRATIVOS
// =============================
if (tipo === 'microcredito') {
  gastosAdmin = monto * 0.01;
} 
else if (tipo === 'automatico') {
  gastosAdmin = monto * 0.009;
} 
else {

  if (monto >= 1000 && monto <= 200000) {
    gastosAdmin = monto * 0.015;
  } 
  else if (monto > 200000 && monto <= 400000) {
    gastosAdmin = (monto * 0.004) + (200000 * 0.011);
  } 
  else if (monto > 400000 && monto <= 600000) {
    gastosAdmin = (monto * 0.0035) + (200000 * 0.0115);
  } 
  else if (monto > 600000 && monto < 1000000) { 
    gastosAdmin = (monto * 0.0030) + (200000 * 0.012);
  } 
  else if (monto === 1000000) { 
    gastosAdmin = 3000;
  }
  else if (monto > 1000000) {
    gastosAdmin = ((monto - 1000000) / 1000) + 3000;
  }
}



  // =============================
  // FIDUCIARIO
  // =============================
  if (tipo === 'fiduciario') {
    pignoracion = monto * 0.01;
  }


  // =============================
  // HIPOTECARIO
  // =============================
  if (tipo === 'hipotecario') {

    if (!escritura) {
      alert("Seleccione el tipo de escritura.");
      return;
    }

    pignoracion = monto * 0.01;

    // =============================
    // AVALÚO
    // =============================
    if (monto >= 1000 && monto <= 50000) {
      avaluo = 150;
    } 
    else if (monto <= 100000) {
      avaluo = 200;
    } 
    else if (monto <= 200000) {
      avaluo = 350;
    } 
    else if (monto <= 400000) {
      avaluo = 500;
    } 
    else {

      if (!ubicacionAvaluo.value) {
        alert("Seleccione si el avalúo se encuentra en Sololá o fuera.");
        return;
      }

      if (ubicacionAvaluo.value === 'solola') {
        avaluo = 1000;
      } else {
        avaluo = 1500;
      }
    }

    // =============================
    // HIPOTECA
    // =============================
    if (escritura === 'registrada') {
      if (monto <= 10000) {
        hipoteca = 360;
      } else {
        hipoteca = 360 + ((monto - 10000) * 0.0015);
      }
    } 
    else {
      hipoteca = 0;
    }
  }


  // =============================
  // AUTOMÁTICO
  // =============================
  if (tipo === 'automatico') {
    pignoracion = 0;
  }


  // =============================
  // TOTALES
  // =============================
  total = gastosAdmin + pignoracion + avaluo + hipoteca;
  liquido = monto - total;


  // =============================
  // MOSTRAR RESULTADO
  // =============================
  let resultadoHTML = `
    <h3>Desglose de Gastos</h3>

    <div class="result-item">
      <span>Gastos Administrativos</span>
      <strong>Q ${formatoQuetzales(gastosAdmin)}</strong>
    </div>
  `;

  if (tipo === 'microcredito') {
    resultadoHTML += `
      <div class="result-item">
        <span>Seguro</span>
        <strong>Monto variable según cantidad</strong>
      </div>
    `;
  }

  if (tipo === 'fiduciario') {
    resultadoHTML += `
      <div class="result-item">
        <span>Pignoración de Ahorro</span>
        <strong>Q ${formatoQuetzales(pignoracion)}</strong>
      </div>
    `;
  }

  if (tipo === 'hipotecario') {
    resultadoHTML += `
      <div class="result-item">
        <span>Pignoración</span>
        <strong>Q ${formatoQuetzales(pignoracion)}</strong>
      </div>

      <div class="result-item">
        <span>Avalúo</span>
        <strong>Q ${formatoQuetzales(avaluo)}</strong>
      </div>

      <div class="result-item">
        <span>Hipoteca</span>
        <strong>Q ${formatoQuetzales(hipoteca)}</strong>
      </div>
    `;
  }

  resultadoHTML += `
    <hr>

    <div class="total">
      Total de Gastos: Q ${formatoQuetzales(total)}
    </div>

    <div class="liquido" style="margin-top:10px;">
      Líquido a Recibir: Q ${formatoQuetzales(liquido)}
    </div>
  `;

  resultadoDiv.innerHTML = resultadoHTML;
  resultadoDiv.classList.remove('hidden');

});


// =============================
// IMPRIMIR
// =============================
btnImprimir.addEventListener('click', function () {
  window.print();
});

