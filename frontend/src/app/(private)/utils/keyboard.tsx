import { motion } from "framer-motion";
import { TypingStatus } from "../learn/page";

export const VirtualKeyboard = ({
  expectedKey,
  pressedKey,
  status,
  shiftPressed = false,
  capsLock = false,
}: {
  expectedKey: string;
  pressedKey: string;
  status: TypingStatus;
  shiftPressed?: boolean;
  capsLock?: boolean;
}) => {
  // Mapeamento de shift + tecla para caracteres secundários
  const shiftMap: { [key: string]: string } = {
    '`': '~',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '"',
    ',': '<',
    '.': '>',
    '/': '?',
  };

  const rows = [
    [
      { primary: '`', secondary: '~', width: 'w-10' },
      { primary: '1', secondary: '!', width: 'w-10' },
      { primary: '2', secondary: '@', width: 'w-10' },
      { primary: '3', secondary: '#', width: 'w-10' },
      { primary: '4', secondary: '$', width: 'w-10' },
      { primary: '5', secondary: '%', width: 'w-10' },
      { primary: '6', secondary: '^', width: 'w-10' },
      { primary: '7', secondary: '&', width: 'w-10' },
      { primary: '8', secondary: '*', width: 'w-10' },
      { primary: '9', secondary: '(', width: 'w-10' },
      { primary: '0', secondary: ')', width: 'w-10' },
      { primary: '-', secondary: '_', width: 'w-10' },
      { primary: '=', secondary: '+', width: 'w-10' },
      { primary: 'Backspace', secondary: '', width: 'w-20' },
    ],
    [
      { primary: 'q', secondary: 'Q', width: 'w-10' },
      { primary: 'w', secondary: 'W', width: 'w-10' },
      { primary: 'e', secondary: 'E', width: 'w-10' },
      { primary: 'r', secondary: 'R', width: 'w-10' },
      { primary: 't', secondary: 'T', width: 'w-10' },
      { primary: 'y', secondary: 'Y', width: 'w-10' },
      { primary: 'u', secondary: 'U', width: 'w-10' },
      { primary: 'i', secondary: 'I', width: 'w-10' },
      { primary: 'o', secondary: 'O', width: 'w-10' },
      { primary: 'p', secondary: 'P', width: 'w-10' },
      { primary: '[', secondary: '{', width: 'w-10' },
      { primary: ']', secondary: '}', width: 'w-10' },
      { primary: '\\', secondary: '|', width: 'w-10' },
    ],
    [
      { primary: 'CapsLock', secondary: '', width: 'w-16' },
      { primary: 'a', secondary: 'A', width: 'w-10' },
      { primary: 's', secondary: 'S', width: 'w-10' },
      { primary: 'd', secondary: 'D', width: 'w-10' },
      { primary: 'f', secondary: 'F', width: 'w-10' },
      { primary: 'g', secondary: 'G', width: 'w-10' },
      { primary: 'h', secondary: 'H', width: 'w-10' },
      { primary: 'j', secondary: 'J', width: 'w-10' },
      { primary: 'k', secondary: 'K', width: 'w-10' },
      { primary: 'l', secondary: 'L', width: 'w-10' },
      { primary: ';', secondary: ':', width: 'w-10' },
      { primary: "'", secondary: '"', width: 'w-10' },
    ],
    [
      { primary: 'z', secondary: 'Z', width: 'w-10' },
      { primary: 'x', secondary: 'X', width: 'w-10' },
      { primary: 'c', secondary: 'C', width: 'w-10' },
      { primary: 'v', secondary: 'V', width: 'w-10' },
      { primary: 'b', secondary: 'B', width: 'w-10' },
      { primary: 'n', secondary: 'N', width: 'w-10' },
      { primary: 'm', secondary: 'M', width: 'w-10' },
      { primary: ',', secondary: '<', width: 'w-10' },
      { primary: '.', secondary: '>', width: 'w-10' },
      { primary: '/', secondary: '?', width: 'w-10' },
    ],
  ];

  const isLetterKey = (value: string) => /^[a-z]$/i.test(value);

  const getKeyStyle = (key: string, isToggled = false) => {
    const keyLower = key.toLowerCase();
    const expectedLower = expectedKey.toLowerCase();
    const pressedLower = pressedKey.toLowerCase();
    
    const isExpected = keyLower === expectedLower || (pressedKey === 'Shift' && shiftMap[keyLower] === expectedKey);
    const isPressed = isToggled || keyLower === pressedLower || key === pressedKey;

    if (isPressed && status === 'error') {
      return {
        bgColor: 'bg-red-500',
        borderColor: 'border-red-600',
        textColor: 'text-white',
        shadow: 'shadow-lg shadow-red-500/50',
        scale: 0.95,
      };
    }

    if (isExpected) {
      return {
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-600',
        textColor: 'text-white',
        shadow: 'shadow-md shadow-blue-500/40',
        scale: 1,
      };
    }

    return {
      bgColor: 'bg-slate-100 dark:bg-slate-900 dark:opacity-50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      textColor: 'text-slate-500',
      shadow: 'shadow-sm shadow-slate-800/50',
      scale: 1,
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="space-y-1 dark:bg-slate  p-3 rounded-xl border border-slate-700/50 backdrop-blur">
        {/* Número rows */}
        {rows.slice(0, 4).map((row, rIdx) => (
          <div
            key={rIdx}
            className={`flex justify-center gap-1 ${
              rIdx === 2 ? 'pl-6' : rIdx === 3 ? 'pl-12' : ''
            }`}
          >
            {row.map((keyData) => {
              const isCapsKey = keyData.primary === 'CapsLock';
              const isLetter = isLetterKey(keyData.primary);
              const isToggled = isCapsKey && capsLock;
              const style = getKeyStyle(keyData.primary, isToggled);
              const isPressed = isToggled || keyData.primary.toLowerCase() === pressedKey.toLowerCase() || keyData.primary === pressedKey;
              const displayLetter = isLetter
                ? (capsLock || shiftPressed ? keyData.primary.toUpperCase() : keyData.primary.toLowerCase())
                : keyData.primary;

              return (
                <motion.div
                  key={keyData.primary}
                  animate={{
                    scale: isPressed ? style.scale : 1,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: 'easeOut',
                  }}
                  className={`
                    h-10 ${keyData.width} rounded border transition-all
                    flex flex-col items-center justify-center
                    font-mono text-xs font-semibold
                    cursor-default select-none
                    ${style.bgColor} ${style.borderColor} ${style.textColor} ${style.shadow}
                  `}
                >
                  {isLetter ? (
                    <div className="leading-none">{displayLetter}</div>
                  ) : keyData.secondary ? (
                    <>
                      <div className="leading-none text-[0.6rem]">{keyData.secondary}</div>
                      <div className="leading-none">{keyData.primary === 'Backspace' ? '⌫' : keyData.primary.toUpperCase()}</div>
                    </>
                  ) : (
                    <div className="leading-none">{keyData.primary === 'Backspace' ? '⌫' : keyData.primary === 'CapsLock' ? 'CAPS' : keyData.primary.toUpperCase()}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* Spacebar row */}
        <div className="flex justify-center gap-1 mt-2">
          <motion.div
            animate={{
              scale: pressedKey === ' ' ? 0.95 : 1,
            }}
            transition={{
              duration: 0.05,
              ease: 'easeOut',
            }}
            className={`
              h-10 flex-1 max-w-xs rounded border transition-all
              flex items-center justify-center
              font-mono text-xs font-semibold
              cursor-default select-none
              ${pressedKey === ' ' && status === 'error' ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/50' :
                expectedKey === ' ' ? 'bg-blue-500 border-blue-600 text-white shadow-md shadow-blue-500/40' :
                'bg-slate-100 dark:bg-slate-900 dark:opacity-50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 shadow-sm shadow-slate-800/50'}
            `}
          >
            SPACE
          </motion.div>
        </div>

        {/* Modifier keys row */}
        <div className="flex justify-center gap-1 mt-2">
          <div className="text-xs font-mono text-slate-400 space-y-1">
            <div className="flex gap-1">
              <motion.div
                animate={{
                  scale: pressedKey === 'Shift' ? 0.95 : 1,
                }}
                className={`h-10 w-16 rounded border flex items-center justify-center font-semibold cursor-default select-none transition-all ${
                  pressedKey === 'Shift' ? 'bg-slate-500 border-slate-400' : 'bg-slate-100 dark:bg-slate-900 dark:opacity-50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 shadow-sm shadow-slate-800/50'
                } text-slate-200 shadow-sm shadow-slate-800/50`}
              >
                SHIFT
              </motion.div>
              <motion.div
                animate={{
                  scale: pressedKey === 'Control' ? 0.95 : 1,
                }}
                className={`h-10 w-12 rounded border flex items-center justify-center font-semibold cursor-default select-none transition-all text-xs ${
                  pressedKey === 'Control' ? 'bg-slate-500 border-slate-400' : 'bg-slate-100 dark:bg-slate-900 dark:opacity-50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 shadow-sm shadow-slate-800/50'
                }`}
              >
                CTRL
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};