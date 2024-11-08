import React, { useState } from 'react';
import './App.css';

const App = () => {
  // Inicializamos las filas con los valores por defecto
  const initialRows = Array.from({ length: 30 }, (_, index) => ({
    nroCaja: index + 1,
    trx: '',
    creditoDebito: '',
    abonos6001: '',
  }));

  const [rows, setRows] = useState(initialRows);
  const [mcContabilizado, setMcContabilizado] = useState('');
  const [pagoTOh, setPagoTOh] = useState('');
  const [recargaAgora, setRecargaAgora] = useState('');

  // Función para manejar el cambio de valor en los inputs
  const handleInputChange = (e, index, column) => {
    const newRows = [...rows];
    newRows[index][column] = e.target.value;

    // Actualizamos el valor de 'Credito + Debito' al calcular la diferencia entre 'Trx' y 'Abonos 6001'
    if (column === 'trx' || column === 'abonos6001') {
      const trx = parseFloat(newRows[index].trx) || 0;
      const abonos6001 = parseFloat(newRows[index].abonos6001) || 0;
      newRows[index].creditoDebito = trx - abonos6001;  // Calculamos la diferencia
    }

    setRows(newRows);
  };

  // Función para manejar el enfoque entre inputs con Enter, Tab y Shift + Tab
  const handleKeyDown = (e, index, column) => {
    const currentCell = document.querySelector(`#${index}-${column}`);
    
    // Prevenir que las teclas de flecha cambien el valor en el input
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    // Cambiar de celda con la tecla Enter (mover a la celda de abajo)
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextRow = index + 1 < rows.length ? index + 1 : index; // Mover a la siguiente fila
      const nextInput = document.querySelector(`#${nextRow}-${column}`); // Buscar el input de la siguiente fila
      if (nextInput) nextInput.focus(); // Enfocar el siguiente input
    }

    // Cambiar de celda con las flechas direccionales (derecha, izquierda)
    if (e.key === 'ArrowRight' && !e.shiftKey) {
      e.preventDefault();
      const nextColumn = column === 'nroCaja' ? 'trx' : column === 'trx' ? 'abonos6001' : 'nroCaja';
      const nextInput = document.querySelector(`#${index}-${nextColumn}`);
      if (nextInput) nextInput.focus();
    }

    if (e.key === 'ArrowLeft' && !e.shiftKey) {
      e.preventDefault();
      const prevColumn = column === 'nroCaja' ? 'abonos6001' : column === 'trx' ? 'nroCaja' : 'trx';
      const prevInput = document.querySelector(`#${index}-${prevColumn}`);
      if (prevInput) prevInput.focus();
    }

    // Desplazarse entre las filas con las flechas arriba y abajo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = index + 1 < rows.length ? index + 1 : index;
      const nextInput = document.querySelector(`#${nextRow}-${column}`);
      if (nextInput) nextInput.focus();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = index - 1 >= 0 ? index - 1 : index;
      const prevInput = document.querySelector(`#${prevRow}-${column}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Suma total de la columna Trx
  const trxSum = rows.reduce((sum, row) => sum + (parseFloat(row.trx) || 0), 0).toFixed(2);

  // Suma total de la columna Abonos 6001 (solo para las filas con valor en Abonos 6001)
  const abonos6001Sum = rows.reduce((sum, row) => sum + (parseFloat(row.abonos6001) || 0), 0).toFixed(2);

  // Suma total de la columna Credito + Debito
  const creditoDebitoSum = rows.reduce((sum, row) => sum + (parseFloat(row.creditoDebito) || 0), 0).toFixed(2);

  // Cálculo de la diferencia entre Credito + Debito y MCCONTABILIZADO
  const mcContabilizadoValue = parseFloat(mcContabilizado) || 0;
  const difference = (parseFloat(creditoDebitoSum) || 0) - mcContabilizadoValue;

  // Calcular el total de Abonos BBR (Pago TOh! + Recarga Agora)
  const totalAbonosBBR = (parseFloat(pagoTOh) || 0) + (parseFloat(recargaAgora) || 0);

  // Calcular la diferencia entre Abonos y Total Abonos BBR
  const abonosDifference = (parseFloat(abonos6001Sum) || 0) - totalAbonosBBR;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nro Caja</th>
            <th>Total/Lotes</th>
            <th>Credito + Debito</th>
            <th>Abonos 6001</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.nroCaja}</td>
              <td>
                <input
                  id={`${index}-trx`}
                  type="number"
                  value={row.trx}
                  onChange={(e) => handleInputChange(e, index, 'trx')}
                  onKeyDown={(e) => handleKeyDown(e, index, 'trx')}
                />
              </td>
              <td>{row.creditoDebito}</td>
              <td>
                <input
                  id={`${index}-abonos6001`}
                  type="number"
                  value={row.abonos6001}
                  onChange={(e) => handleInputChange(e, index, 'abonos6001')}
                  onKeyDown={(e) => handleKeyDown(e, index, 'abonos6001')}
                />
              </td>
            </tr>
          ))}

          {/* Fila duplicada de las cabeceras debajo de la fila 30 */}
          {rows.length === 30 && (
            <>
              <tr>
                <th></th>
                <th>Total/Lotes</th>
                <th>Credito + Debito</th>
                <th>Abonos 6001</th>
              </tr>
              <tr>
                <td><strong>Totales</strong></td>
                <td><strong>{trxSum}</strong></td>
                <td><strong>{creditoDebitoSum}</strong></td>
                <td><strong>{abonos6001Sum}</strong></td>
              </tr>
              {/* Fila con MC-BBR y input para MCCONTABILIZADO */}
              <tr>
                <td></td>
                <td>MC-BBR</td>
                <td>
                  <input
                    type="number"
                    value={mcContabilizado}
                    onChange={(e) => setMcContabilizado(e.target.value)}
                  />
                </td>
                <td>
                  <strong>Diferencia: {difference.toFixed(2)}</strong>
                </td>
              </tr>
              {/* Fila para "Pago TOh!" */}
              <tr>
                <td></td> {/* Celda vacía */}
                <td>Pago TOh!</td>
                <td>
                  <input
                    type="number"
                    value={pagoTOh}
                    onChange={(e) => setPagoTOh(e.target.value)}
                  />
                </td>
                <td></td>
              </tr>
              {/* Fila para "Recarga Agora" */}
              <tr>
                <td></td> {/* Celda vacía */}
                <td>Recarga Agora</td>
                <td>
                  <input
                    type="number"
                    value={recargaAgora}
                    onChange={(e) => setRecargaAgora(e.target.value)}
                  />
                </td>
                <td></td>
              </tr>
              {/* Fila Total Abonos BBR */}
              <tr>
                <td></td>
                <td><strong>Total Abonos BBR</strong></td>
                <td><strong>{totalAbonosBBR.toFixed(2)}</strong></td>
                <td>
                  <strong>Diferencia: {abonosDifference.toFixed(2)}</strong>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
