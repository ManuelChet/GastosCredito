// =============================
// REFERENCIAS
// =============================
const inputMonto = document.getElementById('monto');
const tipoGarantia = document.getElementById('tipoGarantia');
const resultadoDiv = document.getElementById('resultado');
const btnCalcular = document.getElementById('btnCalcular');
const btnImprimir = document.getElementById('btnImprimir');
const btnLimpiar = document.getElementById('btnLimpiar');
const alertContainer = document.getElementById('alertContainer');

// Hipotecario
const infoEscrituraHipotecario = document.getElementById('infoEscrituraHipotecario');
const cantidadEscriturasHipotecarioContainer = document.getElementById('cantidadEscriturasHipotecarioContainer');
const cantidadEscriturasHipotecario = document.getElementById('cantidadEscriturasHipotecario');
const ubicacionAvaluoContainer = document.getElementById('ubicacionAvaluoContainer');
const ubicacionAvaluo = document.getElementById('ubicacionAvaluo');

// Derechos Posesorios
const infoEscrituraDP = document.getElementById('infoEscrituraDP');
const cantidadEscriturasContainer = document.getElementById('cantidadEscriturasContainer');
const cantidadEscrituras = document.getElementById('cantidadEscrituras');
const ubicacionDPContainer = document.getElementById('ubicacionDPContainer');
const ubicacionDP = document.getElementById('ubicacionDP');

// Año actual en el footer
document.getElementById('anioActual').textContent = new Date().getFullYear();


// =============================
// SISTEMA DE ALERTAS
// =============================
function mostrarAlerta(tipo, titulo, mensaje, duracion = 5000) {
  const iconos = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const alert = document.createElement('div');
  alert.className = `alert alert-${tipo}`;
  alert.innerHTML = `
    <i class="fas ${iconos[tipo]}"></i>
    <div class="alert-content">
      <div class="alert-title">${titulo}</div>
      <div class="alert-message">${mensaje}</div>
    </div>
    <button class="alert-close" onclick="cerrarAlerta(this)">
      <i class="fas fa-times"></i>
    </button>
  `;

  alertContainer.appendChild(alert);

  if (duracion > 0) {
    setTimeout(() => {
      cerrarAlerta(alert.querySelector('.alert-close'));
    }, duracion);
  }
}

function cerrarAlerta(btn) {
  const alert = btn.closest('.alert');
  if (alert) {
    alert.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
      alert.remove();
    }, 300);
  }
}


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
// OCULTAR TODOS LOS CAMPOS CONDICIONALES
// =============================
function ocultarCamposCondicionales() {
  // Hipotecario
  infoEscrituraHipotecario.classList.add('hidden');
  cantidadEscriturasHipotecarioContainer.classList.add('hidden');
  ubicacionAvaluoContainer.classList.add('hidden');
  
  // Derechos Posesorios
  infoEscrituraDP.classList.add('hidden');
  cantidadEscriturasContainer.classList.add('hidden');
  ubicacionDPContainer.classList.add('hidden');
  
  // Limpiar valores
  cantidadEscriturasHipotecario.value = '';
  ubicacionAvaluo.value = '';
  cantidadEscrituras.value = '';
  ubicacionDP.value = '';
}


// =============================
// VALIDAR CAMPOS SEGÚN TIPO DE GARANTÍA
// =============================
function validarCamposCondicionales() {
  const tipo = tipoGarantia.value;
  let valor = inputMonto.value.replace(/Q\s?/g, '').replace(/,/g, '');
  const monto = parseFloat(valor) || 0;

  ocultarCamposCondicionales();

  // Hipotecario - Siempre es Escritura Registrada
  if (tipo === 'hipotecario') {
    infoEscrituraHipotecario.classList.remove('hidden');
    cantidadEscriturasHipotecarioContainer.classList.remove('hidden');
    
    // Mostrar ubicacion avaluo para montos mayores a Q400,000
    if (monto > 400000) {
      ubicacionAvaluoContainer.classList.remove('hidden');
    }
  }

  // Derechos Posesorios - Siempre es Escritura Publica
  if (tipo === 'derechos_posesorios') {
    infoEscrituraDP.classList.remove('hidden');
    cantidadEscriturasContainer.classList.remove('hidden');
    
    // Mostrar ubicacion para montos mayores a Q500,000
    if (monto > 500000) {
      ubicacionDPContainer.classList.remove('hidden');
    }
  }
}

inputMonto.addEventListener('input', validarCamposCondicionales);
inputMonto.addEventListener('blur', validarCamposCondicionales);
tipoGarantia.addEventListener('change', validarCamposCondicionales);


// =============================
// LIMPIAR FORMULARIO
// =============================
btnLimpiar.addEventListener('click', function() {
  inputMonto.value = '';
  tipoGarantia.value = '';
  ocultarCamposCondicionales();
  resultadoDiv.classList.add('hidden');
  resultadoDiv.innerHTML = '';
  
  mostrarAlerta('info', 'Formulario limpiado', 'Todos los campos han sido reiniciados.');
});


// =============================
// CALCULAR
// =============================
btnCalcular.addEventListener('click', function () {

  const montoTexto = inputMonto.value
    .replace(/Q\s?/g, '')
    .replace(/,/g, '');

  const monto = parseFloat(montoTexto);
  const tipo = tipoGarantia.value;
  const numEscrituras = parseInt(cantidadEscrituras.value) || 1;
  const numEscriturasHipotecario = parseInt(cantidadEscriturasHipotecario.value) || 1;

  // Validacion basica
  if (!monto || monto <= 0) {
    mostrarAlerta('error', 'Error de validacion', 'Por favor ingrese un monto valido mayor a cero.');
    return;
  }

  if (!tipo) {
    mostrarAlerta('error', 'Error de validacion', 'Por favor seleccione un tipo de garantia.');
    return;
  }

  // =============================
  // VALIDACIÓN MICROCRÉDITO
  // =============================
  if (tipo === 'microcredito') {
    if (monto < 1000 || monto > 30000) {
      mostrarAlerta('warning', 'Monto fuera de rango', 'Segun politicas vigentes, el Microcredito solo permite montos de Q 1,000.00 a Q 30,000.00.');
      return;
    }
  }

  let gastosAdmin = 0;
  let pignoracion = 0;
  let avaluo = 0;
  let hipoteca = 0;
  let total = 0;
  let liquido = 0;
  let infoAdicional = [];


  // =============================
  // GASTOS ADMINISTRATIVOS
  // =============================
  // Microcredito y Credito con Seguro Columna usan los mismos calculos
  if (tipo === 'microcredito' || tipo === 'credito_seguro_columna') {
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
  // HIPOTECARIO (Siempre Escritura Registrada)
  // =============================
  if (tipo === 'hipotecario') {

    if (!cantidadEscriturasHipotecario.value || numEscriturasHipotecario < 1) {
      mostrarAlerta('error', 'Error de validacion', 'Por favor ingrese la cantidad de escrituras utilizadas.');
      return;
    }

    pignoracion = monto * 0.01;
    infoAdicional.push(`Tipo escritura: Registrada`);
    infoAdicional.push(`Escrituras utilizadas: ${numEscriturasHipotecario}`);

    // =============================
    // AVALÚO HIPOTECARIO
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
      // Mayor a Q400,000 - Se cobra por cada escritura segun ubicacion
      if (!ubicacionAvaluo.value) {
        mostrarAlerta('error', 'Error de validacion', 'Para creditos mayores a Q 400,000.00, debe seleccionar la ubicacion del avaluo.');
        return;
      }

      if (ubicacionAvaluo.value === 'solola') {
        // Q1,000 por cada escritura en Solola
        avaluo = 1000 * numEscriturasHipotecario;
        infoAdicional.push(`Ubicacion avaluo: Solola (Q 1,000.00 x ${numEscriturasHipotecario} escritura${numEscriturasHipotecario > 1 ? 's' : ''} = Q ${formatoQuetzales(avaluo)})`);
      } else {
        // Q1,500 por cada escritura fuera de Solola
        avaluo = 1500 * numEscriturasHipotecario;
        infoAdicional.push(`Ubicacion avaluo: Fuera de Solola (Q 1,500.00 x ${numEscriturasHipotecario} escritura${numEscriturasHipotecario > 1 ? 's' : ''} = Q ${formatoQuetzales(avaluo)})`);
      }
    }

    // =============================
    // HIPOTECA (Escritura Registrada)
    // Con Q50 adicionales por cada escritura extra
    // =============================
    if (monto <= 10000) {
      hipoteca = 360;
    } else {
      hipoteca = 360 + ((monto - 10000) * 0.0015);
    }
    
    // Agregar Q50 por cada escritura adicional (mas de 1)
    if (numEscriturasHipotecario > 1) {
      const escriturasAdicionales = numEscriturasHipotecario - 1;
      const cargoAdicional = escriturasAdicionales * 50;
      hipoteca += cargoAdicional;
      infoAdicional.push(`Cargo adicional hipoteca: Q 50.00 x ${escriturasAdicionales} escritura${escriturasAdicionales > 1 ? 's' : ''} adicional${escriturasAdicionales > 1 ? 'es' : ''} = Q ${formatoQuetzales(cargoAdicional)}`);
    }
  }


  // =============================
  // DERECHOS POSESORIOS (Siempre Escritura Publica)
  // =============================
  if (tipo === 'derechos_posesorios') {

    if (!cantidadEscrituras.value || numEscrituras < 1) {
      mostrarAlerta('error', 'Error de validacion', 'Por favor ingrese la cantidad de escrituras utilizadas.');
      return;
    }

    pignoracion = monto * 0.01;
    infoAdicional.push(`Tipo escritura: Publica`);
    infoAdicional.push(`Escrituras utilizadas: ${numEscrituras}`);

    // Avaluo segun monto
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
    else if (monto <= 500000) {
      avaluo = 1000;
    }
    else {
      // Mayor a Q500,000
      if (!ubicacionDP.value) {
        mostrarAlerta('error', 'Error de validacion', 'Para creditos mayores a Q 500,000.00, debe seleccionar si esta en Solola o fuera.');
        return;
      }

      if (ubicacionDP.value === 'solola') {
        avaluo = 1000;
        infoAdicional.push('Ubicacion: Departamento de Solola');
      } else {
        avaluo = 1500;
        infoAdicional.push('Ubicacion: Fuera de Solola');
      }
    }

    // Derechos Posesorios = Escritura Publica = NO cobra hipoteca
    hipoteca = 0;
  }


  // =============================
  // AUTOMÁTICO
  // =============================
  if (tipo === 'automatico') {
    pignoracion = 0;
  }


  // =============================
  // FONDO DE RETIRO
  // =============================
  if (tipo === 'fondo_retiro') {
    pignoracion = monto * 0.01;
  }


  // =============================
  // CRÉDITO CON SEGURO COLUMNA (mismos calculos que Microcredito)
  // =============================
  if (tipo === 'credito_seguro_columna') {
    pignoracion = monto * 0.01;
  }


  // =============================
  // TOTALES
  // =============================
  total = gastosAdmin + pignoracion + avaluo + hipoteca;
  liquido = monto - total;


  // =============================
  // MOSTRAR RESULTADO
  // =============================
  const nombreGarantia = {
    'fiduciario': 'Fiduciario',
    'automatico': 'Automatico',
    'hipotecario': 'Hipotecario',
    'derechos_posesorios': 'Derechos Posesorios',
    'fondo_retiro': 'Fondo de Retiro',
    'credito_seguro_columna': 'Credito con Seguro Columna',
    'microcredito': 'Microcredito'
  };

  let resultadoHTML = `
    <div class="print-header">
      <h1>COLUA - Calculo de Gastos de Credito</h1>
      <p>Fecha: ${new Date().toLocaleDateString('es-GT')} | Tipo: ${nombreGarantia[tipo]}</p>
    </div>

    <h3>Desglose de Gastos</h3>

    <div class="result-item">
      <span>Monto del Credito</span>
      <strong>Q ${formatoQuetzales(monto)}</strong>
    </div>

    <div class="result-item">
      <span>Tipo de Garantia</span>
      <strong>${nombreGarantia[tipo]}</strong>
    </div>

    <div class="result-item">
      <span>Gastos Administrativos</span>
      <strong>Q ${formatoQuetzales(gastosAdmin)}</strong>
    </div>
  `;

  if (tipo === 'microcredito' || tipo === 'credito_seguro_columna') {
    resultadoHTML += `
      <div class="result-item">
        <span>Seguro</span>
        <strong>Monto variable segun cantidad</strong>
      </div>
    `;
  }

  if (tipo === 'fiduciario' || tipo === 'fondo_retiro' || tipo === 'credito_seguro_columna') {
    resultadoHTML += `
      <div class="result-item">
        <span>Pignoracion de Ahorro</span>
        <strong>Q ${formatoQuetzales(pignoracion)}</strong>
      </div>
    `;
  }

  if (tipo === 'hipotecario' || tipo === 'derechos_posesorios') {
    resultadoHTML += `
      <div class="result-item">
        <span>Pignoracion</span>
        <strong>Q ${formatoQuetzales(pignoracion)}</strong>
      </div>

      <div class="result-item">
        <span>Avaluo</span>
        <strong>Q ${formatoQuetzales(avaluo)}</strong>
      </div>

      <div class="result-item">
        <span>Hipoteca</span>
        <strong>Q ${formatoQuetzales(hipoteca)}</strong>
      </div>
    `;
  }

  resultadoHTML += `
    <div class="result-divider"></div>

    <div class="total">
      <span>Total de Gastos</span>
      <strong>Q ${formatoQuetzales(total)}</strong>
    </div>

    <div class="liquido">
      <span>Liquido a Recibir</span>
      <strong>Q ${formatoQuetzales(liquido)}</strong>
    </div>
  `;

  // Informacion adicional
  if (infoAdicional.length > 0) {
    resultadoHTML += `
      <div class="info-adicional">
        ${infoAdicional.map(info => `<p><i class="fas fa-check-circle"></i> ${info}</p>`).join('')}
      </div>
    `;
  }

  resultadoHTML += `
    <div class="print-footer">
      <p>Documento generado por el Sistema de Calculo de Gastos COLUA v2.0</p>
      <p>Los gastos estan sujetos a las politicas vigentes de la institucion.</p>
    </div>
  `;

  resultadoDiv.innerHTML = resultadoHTML;
  resultadoDiv.classList.remove('hidden');

  // Scroll suave al resultado
  resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Alerta de exito
  mostrarAlerta('success', 'Calculo generado', `Se han calculado los gastos para un credito de Q ${formatoQuetzales(monto)} con garantia ${nombreGarantia[tipo]}.`);

});


// =============================
// IMPRIMIR
// =============================
btnImprimir.addEventListener('click', function () {
  if (resultadoDiv.classList.contains('hidden')) {
    mostrarAlerta('warning', 'Sin datos para imprimir', 'Primero debe calcular los gastos antes de imprimir.');
    return;
  }
  window.print();
});
