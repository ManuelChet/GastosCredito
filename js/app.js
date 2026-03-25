// =============================
// REFERENCIAS
// =============================
const inputMonto = document.getElementById('monto');
const tipoGarantia = document.getElementById('tipoGarantia');
const tipoEscritura = document.getElementById('tipoEscritura');
const opcionesEscritura = document.getElementById('opcionesEscritura');
const cantidadEscriturasHipotecarioContainer = document.getElementById('cantidadEscriturasHipotecarioContainer');
const cantidadEscriturasHipotecario = document.getElementById('cantidadEscriturasHipotecario');
const resultadoDiv = document.getElementById('resultado');
const btnCalcular = document.getElementById('btnCalcular');
const btnImprimir = document.getElementById('btnImprimir');
const btnLimpiar = document.getElementById('btnLimpiar');
const ubicacionAvaluoContainer = document.getElementById('ubicacionAvaluoContainer');
const ubicacionAvaluo = document.getElementById('ubicacionAvaluo');
const alertContainer = document.getElementById('alertContainer');

// Derechos Posesorios
const opcionesEscrituraDP = document.getElementById('opcionesEscrituraDP');
const tipoEscrituraDP = document.getElementById('tipoEscrituraDP');
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
  opcionesEscritura.classList.add('hidden');
  cantidadEscriturasHipotecarioContainer.classList.add('hidden');
  ubicacionAvaluoContainer.classList.add('hidden');
  opcionesEscrituraDP.classList.add('hidden');
  cantidadEscriturasContainer.classList.add('hidden');
  ubicacionDPContainer.classList.add('hidden');
  
  // Limpiar valores
  tipoEscritura.value = '';
  cantidadEscriturasHipotecario.value = '';
  ubicacionAvaluo.value = '';
  tipoEscrituraDP.value = '';
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

  // Hipotecario
  if (tipo === 'hipotecario') {
    opcionesEscritura.classList.remove('hidden');
    cantidadEscriturasHipotecarioContainer.classList.remove('hidden');
    
    if (monto > 400000) {
      ubicacionAvaluoContainer.classList.remove('hidden');
    }
  }

  // Derechos Posesorios
  if (tipo === 'derechos_posesorios') {
    opcionesEscrituraDP.classList.remove('hidden');
    cantidadEscriturasContainer.classList.remove('hidden');
    
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
  const escritura = tipoEscritura.value;
  const escrituraDP = tipoEscrituraDP.value;
  const numEscrituras = parseInt(cantidadEscrituras.value) || 1;
  const numEscriturasHipotecario = parseInt(cantidadEscriturasHipotecario.value) || 1;

  // Validación básica
  if (!monto || monto <= 0) {
    mostrarAlerta('error', 'Error de validación', 'Por favor ingrese un monto válido mayor a cero.');
    return;
  }

  if (!tipo) {
    mostrarAlerta('error', 'Error de validación', 'Por favor seleccione un tipo de garantía.');
    return;
  }

  // =============================
  // VALIDACIÓN MICROCRÉDITO
  // =============================
  if (tipo === 'microcredito') {
    if (monto < 1000 || monto > 30000) {
      mostrarAlerta('warning', 'Monto fuera de rango', 'Según políticas vigentes, el Microcrédito solo permite montos de Q 1,000.00 a Q 30,000.00.');
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
      mostrarAlerta('error', 'Error de validación', 'Por favor seleccione el tipo de escritura.');
      return;
    }

    if (!cantidadEscriturasHipotecario.value || numEscriturasHipotecario < 1) {
      mostrarAlerta('error', 'Error de validación', 'Por favor ingrese la cantidad de escrituras utilizadas.');
      return;
    }

    pignoracion = monto * 0.01;
    infoAdicional.push(`Escrituras utilizadas: ${numEscriturasHipotecario}`);

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
        mostrarAlerta('error', 'Error de validación', 'Por favor seleccione si el avalúo se encuentra en Sololá o fuera.');
        return;
      }

      if (ubicacionAvaluo.value === 'solola') {
        avaluo = 1000;
        infoAdicional.push('Ubicación avalúo: Sololá');
      } else {
        avaluo = 1500;
        infoAdicional.push('Ubicación avalúo: Fuera de Sololá');
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
      infoAdicional.push('Tipo escritura: Registrada');
    } 
    else {
      hipoteca = 0;
      infoAdicional.push('Tipo escritura: Pública');
    }
  }


  // =============================
  // DERECHOS POSESORIOS
  // =============================
  if (tipo === 'derechos_posesorios') {

    if (!escrituraDP) {
      mostrarAlerta('error', 'Error de validación', 'Por favor seleccione el tipo de escritura.');
      return;
    }

    if (!cantidadEscrituras.value || numEscrituras < 1) {
      mostrarAlerta('error', 'Error de validación', 'Por favor ingrese la cantidad de escrituras utilizadas.');
      return;
    }

    pignoracion = monto * 0.01;
    infoAdicional.push(`Escrituras utilizadas: ${numEscrituras}`);
    infoAdicional.push(`Tipo escritura: ${escrituraDP === 'registrada' ? 'Registrada' : 'Pública'}`);

    // Avalúo según monto
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
      // Mayor a 500,000
      if (!ubicacionDP.value) {
        mostrarAlerta('error', 'Error de validación', 'Para créditos mayores a Q 500,000.00, debe seleccionar si está en Sololá o fuera.');
        return;
      }

      if (ubicacionDP.value === 'solola') {
        avaluo = 1000;
        infoAdicional.push('Ubicación: Departamento de Sololá');
      } else {
        avaluo = 1500;
        infoAdicional.push('Ubicación: Fuera de Sololá');
      }
    }

    // Hipoteca para derechos posesorios
    if (escrituraDP === 'registrada') {
      if (monto <= 10000) {
        hipoteca = 360;
      } else {
        hipoteca = 360 + ((monto - 10000) * 0.0015);
      }
    }
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
  // CRÉDITO CON SEGURO COLUMNA
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
    'automatico': 'Automático',
    'hipotecario': 'Hipotecario',
    'derechos_posesorios': 'Derechos Posesorios',
    'fondo_retiro': 'Fondo de Retiro',
    'credito_seguro_columna': 'Crédito con Seguro Columna',
    'microcredito': 'Microcrédito'
  };

  let resultadoHTML = `
    <div class="print-header">
      <h1>COLUA - Cálculo de Gastos de Crédito</h1>
      <p>Fecha: ${new Date().toLocaleDateString('es-GT')} | Tipo: ${nombreGarantia[tipo]}</p>
    </div>

    <h3>Desglose de Gastos</h3>

    <div class="result-item">
      <span>Monto del Crédito</span>
      <strong>Q ${formatoQuetzales(monto)}</strong>
    </div>

    <div class="result-item">
      <span>Tipo de Garantía</span>
      <strong>${nombreGarantia[tipo]}</strong>
    </div>

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

  if (tipo === 'fiduciario' || tipo === 'fondo_retiro' || tipo === 'credito_seguro_columna') {
    resultadoHTML += `
      <div class="result-item">
        <span>Pignoración de Ahorro</span>
        <strong>Q ${formatoQuetzales(pignoracion)}</strong>
      </div>
    `;
  }

  if (tipo === 'hipotecario' || tipo === 'derechos_posesorios') {
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
    <div class="result-divider"></div>

    <div class="total">
      <span>Total de Gastos</span>
      <strong>Q ${formatoQuetzales(total)}</strong>
    </div>

    <div class="liquido">
      <span>Líquido a Recibir</span>
      <strong>Q ${formatoQuetzales(liquido)}</strong>
    </div>
  `;

  // Información adicional
  if (infoAdicional.length > 0) {
    resultadoHTML += `
      <div class="info-adicional">
        ${infoAdicional.map(info => `<p><i class="fas fa-check-circle"></i> ${info}</p>`).join('')}
      </div>
    `;
  }

  resultadoHTML += `
    <div class="print-footer">
      <p>Documento generado por el Sistema de Cálculo de Gastos COLUA v2.0</p>
      <p>Los gastos están sujetos a las políticas vigentes de la institución.</p>
    </div>
  `;

  resultadoDiv.innerHTML = resultadoHTML;
  resultadoDiv.classList.remove('hidden');

  // Scroll suave al resultado
  resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Alerta de éxito
  mostrarAlerta('success', 'Cálculo generado', `Se han calculado los gastos para un crédito de Q ${formatoQuetzales(monto)} con garantía ${nombreGarantia[tipo]}.`);

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
