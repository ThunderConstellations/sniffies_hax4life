import { useState } from 'react';
import { useAppStore } from '@/lib/store';

const CalculatorDecoy = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [pinBuffer, setPinBuffer] = useState('');
  const { settings, setUnlocked } = useAppStore();

  const handleNumber = (num: string) => {
    // Track PIN entry
    const newBuffer = pinBuffer + num;
    setPinBuffer(newBuffer);
    
    if (newBuffer.length >= settings.pin.length) {
      if (newBuffer.slice(-settings.pin.length) === settings.pin) {
        setUnlocked(true);
        return;
      }
    }

    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setPinBuffer('');
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEquals = () => {
    setPinBuffer('');
    try {
      const expr = equation + display;
      const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, '');
      const result = Function(`"use strict"; return (${sanitized})`)();
      setDisplay(String(result));
      setEquation('');
    } catch {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleClear = () => {
    setPinBuffer('');
    setDisplay('0');
    setEquation('');
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    setPinBuffer('');
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handlePress = (btn: string) => {
    switch (btn) {
      case 'C': handleClear(); break;
      case '⌫': handleBackspace(); break;
      case '%': handleOperator('%'); break;
      case '÷': handleOperator('/'); break;
      case '×': handleOperator('*'); break;
      case '−': handleOperator('-'); break;
      case '+': handleOperator('+'); break;
      case '.': handleDecimal(); break;
      case '=': handleEquals(); break;
      default: handleNumber(btn);
    }
  };

  const isOperator = (btn: string) => ['C', '⌫', '%', '÷', '×', '−', '+', '='].includes(btn);

  return (
    <div className="flex flex-col h-screen bg-background safe-top safe-bottom">
      {/* Display */}
      <div className="flex-1 flex flex-col justify-end p-6">
        <p className="text-muted-foreground text-right text-sm h-6 font-mono">
          {equation}
        </p>
        <p className="text-foreground text-right text-5xl font-light font-mono tracking-tight">
          {display}
        </p>
      </div>

      {/* Button Grid */}
      <div className="grid gap-2 p-4 pb-6">
        {buttons.map((row, ri) => (
          <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: ri === 4 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)' }}>
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => handlePress(btn)}
                className={`
                  h-16 rounded-2xl text-xl font-medium transition-all active:scale-95
                  ${btn === '=' ? 'bg-primary text-primary-foreground' : ''}
                  ${btn === 'C' || btn === '⌫' ? 'bg-destructive/20 text-destructive' : ''}
                  ${isOperator(btn) && btn !== '=' && btn !== 'C' && btn !== '⌫' ? 'bg-primary/20 text-primary' : ''}
                  ${!isOperator(btn) ? 'bg-secondary text-secondary-foreground' : ''}
                `}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorDecoy;
