# CLAUDE.md - База знаний проекта FOT-930 Lab Interface

## Описание проекта

**Виртуальный лабораторный стенд для изучения работы с оптическим тестером FOT-930**

Электронное настольное приложение (Electron) для студентов, изучающих волоконно-оптические линии связи. Проект эмулирует реальный оптический тестер FOT-930 и предоставляет интерактивную среду для выполнения лабораторных работ по измерению параметров оптических компонентов.

### Основные возможности
- Регистрация студентов и сохранение прогресса
- Теоретический раздел с обучающими материалами
- Входной тест (15 вопросов) для допуска к лабораторной работе
- Виртуальная эмуляция оптического тестера FOT-930 с точной имитацией интерфейса
- Интерактивная сборка измерительных схем (drag-and-drop)
- Реалистичная генерация результатов измерений с учетом физических параметров
- Сохранение и анализ результатов измерений

---

## Технический стек

### Core
- **Electron** v39 - Десктопная оболочка
- **React** v19 - UI фреймворк
- **TypeScript** v5.9 - Типизация
- **Vite** v7 - Сборщик и dev-сервер

### Styling
- **Tailwind CSS** v4 - Utility-first CSS
- **@tailwindcss/vite** - Vite плагин для Tailwind v4
- **clsx** - Утилита для условных классов

### Development Tools
- **ESLint** v9 + **@biomejs/biome** v2 - Линтинг и форматирование
- **electron-builder** v26 - Сборка дистрибутива

### Build Configuration
- **vite-plugin-electron** - Интеграция Electron + Vite
- **vite-plugin-electron-renderer** - Поддержка Electron renderer процесса

---

## Структура проекта

```
fot930-lab-interface/
├── electron/                    # Electron main process
│   ├── main.ts                 # Главный процесс Electron
│   ├── preload.ts              # Preload скрипт для IPC
│   ├── appendServiceMenuItem.ts # Сервисное меню для разработки
│   └── clearRegistrationData.ts # Утилита для очистки данных
│
├── src/                        # React application
│   ├── components/             # React компоненты
│   │   ├── fot930/            # Компоненты эмулятора прибора
│   │   │   ├── Device.tsx              # Главный компонент прибора
│   │   │   ├── DeviceScreen.tsx        # Экран прибора (LCD)
│   │   │   ├── MeasurementTable.tsx    # Таблица результатов
│   │   │   ├── ConnectionBuilder.tsx   # Конструктор схем
│   │   │   ├── device/                 # Элементы управления прибором
│   │   │   │   └── DeviceButton.tsx    # Кнопки прибора
│   │   │   ├── device-screen/          # Экраны прибора
│   │   │   │   ├── ScreenOff.tsx           # Выключенное состояние
│   │   │   │   ├── ScreenLoading.tsx       # Загрузка
│   │   │   │   ├── ScreenMain.tsx          # Главный экран
│   │   │   │   ├── ScreenMenuSetup.tsx     # Меню настроек
│   │   │   │   ├── ScreenFastestSetup.tsx  # Настройка FasTest
│   │   │   │   ├── ScreenFastestMain.tsx   # Главный экран FasTest
│   │   │   │   └── ScreenFastestMeasuring.tsx # Измерение
│   │   │   └── connection-builder/     # Drag-and-drop схем
│   │   │       ├── DraggableElement.tsx    # Перетаскиваемый элемент
│   │   │       ├── DropZone.tsx            # Зона для сброса
│   │   │       ├── EmptyDropZone.tsx       # Пустая зона
│   │   │       ├── ElementCard.tsx         # Карточка элемента
│   │   │       └── ElementContent.tsx      # Содержимое элемента
│   │   │
│   │   ├── sections/          # Разделы приложения
│   │   │   ├── theory/                # Теоретический раздел
│   │   │   │   ├── Theory.tsx             # Главный компонент
│   │   │   │   ├── TheoryContent.tsx      # Контент теории
│   │   │   │   ├── InstructionContent.tsx # Инструкции
│   │   │   │   ├── Pagination.tsx         # Пагинация
│   │   │   │   └── classnames.ts          # CSS классы
│   │   │   ├── admission-test/        # Входной тест
│   │   │   │   ├── AdmissionTest.tsx      # Главный компонент
│   │   │   │   └── questions-bank.ts      # База вопросов (15 шт)
│   │   │   └── lab-work/              # Лабораторная работа
│   │   │       ├── LabWork.tsx            # Главный компонент
│   │   │       └── components/            # Компоненты этапов
│   │   │           ├── PreparationStage.tsx          # Подготовка
│   │   │           ├── ConnectionSchemeStage.tsx     # Сборка схемы
│   │   │           ├── PassiveMeasurementsStage.tsx  # Измерения
│   │   │           ├── ResultsStage.tsx              # Результаты
│   │   │           └── StageButton.tsx               # Кнопка этапа
│   │   │
│   │   ├── registration-form/  # Регистрация студента
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── RegistrationProvider.tsx
│   │   │   └── registrationContext.ts
│   │   │
│   │   ├── test/               # Компоненты тестирования
│   │   │   ├── Test.tsx               # Главный компонент теста
│   │   │   ├── Question.tsx           # Вопрос теста
│   │   │   ├── Progress.tsx           # Прогресс-бар
│   │   │   ├── types.ts               # Типы тестов
│   │   │   └── utils/                 # Утилиты
│   │   │       └── shuffleAnswers.ts
│   │   │
│   │   ├── tabs/               # Система табов
│   │   │   ├── Tabs.tsx
│   │   │   ├── Tab.tsx
│   │   │   ├── TabsProvider.tsx
│   │   │   └── tabsContext.ts
│   │   │
│   │   └── header/             # Шапка приложения
│   │       └── Header.tsx
│   │
│   ├── lib/                    # Библиотеки и утилиты
│   │   ├── fot930/                    # Логика эмулятора FOT-930
│   │   │   ├── deviceReducer.ts       # FSM прибора (конечный автомат)
│   │   │   └── measurementEngine.ts   # Генерация измерений
│   │   ├── components/                # Переиспользуемые компоненты
│   │   │   └── Show.tsx               # Условный рендеринг
│   │   └── utils/                     # Утилиты
│   │       ├── index.ts
│   │       └── getRandomElements.ts
│   │
│   ├── types/                  # TypeScript типы
│   │   ├── index.ts                   # Общие типы
│   │   ├── fot930.ts                  # Типы эмулятора FOT-930
│   │   └── electron.d.ts              # Типы Electron API
│   │
│   ├── App.tsx                 # Корневой компонент
│   ├── Layout.tsx              # Основной layout
│   ├── main.tsx                # Entry point
│   └── index.css               # Глобальные стили
│
├── dist/                       # Собранный frontend
├── dist-electron/              # Собранный Electron main
├── public/                     # Статические файлы
├── package.json
├── tsconfig.json              # Корневой TS конфиг
├── tsconfig.app.json          # TS конфиг для приложения
├── tsconfig.node.json         # TS конфиг для Node.js (Electron)
├── vite.config.ts             # Конфигурация Vite
├── eslint.config.mjs          # Конфигурация ESLint
├── biome.json                 # Конфигурация Biome
└── CLAUDE.md                  # Этот файл
```

---

## Архитектурные паттерны

### 1. Управление состоянием

#### Context API для глобального состояния
- **TabsContext** - управление активным табом (theory/admission/lab-work)
- **RegistrationContext** - данные студента и статус регистрации

```typescript
// Пример использования
const { activeTab, setActiveTab } = useTabs();
const { student, setStudent, isRegistered } = useRegistration();
```

#### Reducer Pattern (FSM) для прибора FOT-930
Конечный автомат управляет состоянием прибора и переходами между экранами.

```typescript
// src/lib/fot930/deviceReducer.ts
export function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState
```

**Экраны прибора** (DeviceScreen):
- `OFF` - Прибор выключен
- `LOADING` - Экран загрузки (2-3 сек)
- `MAIN` - Главный экран
- `MENU_SETUP` - Меню настроек
- `FASTEST_SETUP` - Настройка FasTest
- `FASTEST_MAIN` - Главный экран FasTest
- `FASTEST_MEASURING` - Процесс измерения

**Действия** (DeviceAction):
```typescript
| { type: 'PRESS_POWER' }
| { type: 'PRESS_MENU' }
| { type: 'PRESS_UP' }
| { type: 'PRESS_DOWN' }
| { type: 'PRESS_ENTER' }
| { type: 'PRESS_BACK' }
| { type: 'PRESS_FASTEST' }
| { type: 'PRESS_F1' }
| { type: 'PRESS_F2' }
| { type: 'COMPLETE_LOADING' }
| { type: 'CLEAN_PORTS' }
| { type: 'COMPLETE_PORT_CLEANING' }
| { type: 'TOGGLE_FASTEST_PORT' }
| { type: 'TOGGLE_LOSS_WAVELENGTH'; payload: Wavelength }
| { type: 'SET_REFERENCE_TYPE'; payload: ReferenceType }
| { type: 'START_REFERENCE_MEASUREMENT' }
| { type: 'COMPLETE_REFERENCE_MEASUREMENT'; payload: ReferenceResult[] }
```

### 2. Модульная система компонентов

Каждая папка компонентов имеет `index.ts` для экспорта:

```typescript
// src/components/fot930/index.ts
export { Device } from './Device';
export { DeviceScreen } from './DeviceScreen';
export { MeasurementTable } from './MeasurementTable';
export { ConnectionBuilder } from './ConnectionBuilder';
```

### 3. Electron IPC Communication

**Preload Script** предоставляет безопасный API для renderer процесса:

```typescript
// electron/preload.ts
window.electronAPI = {
  saveStudent: (data) => ipcRenderer.invoke('save-student', data),
  loadStudent: () => ipcRenderer.invoke('load-student')
}
```

**Main Process** обрабатывает запросы:

```typescript
// electron/main.ts
ipcMain.handle('save-student', async (_, data) => {
  fs.writeFileSync(studentFilePath, JSON.stringify(data, null, 2), 'utf-8');
  return true;
});
```

---

## Ключевые типы и интерфейсы

### Типы прибора FOT-930 (src/types/fot930.ts)

```typescript
// Режимы измерения
type MeasurementMode = 'POWER' | 'LOSS';

// Длины волн (нм)
type Wavelength = 850 | 1300 | 1310 | 1550 | 1625;

// Кнопки управления
type DeviceButton = 'F1' | 'F2' | 'POWER' | 'MENU' | 'UP' | 'DOWN' | 'ENTER' | 'BACK' | 'FASTEST';

// Состояние прибора
interface DeviceState {
  screen: DeviceScreen;
  isPoweredOn: boolean;
  preparation: PreparationState;
  setupMenuIndex: number;
  fastestSetupSectionIndex: number;
  fastestLengthUnitIndex: number;
  fastestWavelengthIndex: number;
  fastestMainReferenceTypeSelected: boolean;
}

// Настройки FasTest
interface FasTestSettings {
  portType: 'SM' | 'MM';  // Single-mode / Multi-mode
  lengthUnit: 'm' | 'km' | 'ft' | 'mi';
  lossWavelengths: Wavelength[];
  orlWavelengths: Wavelength[];
  isConfigured: boolean;
}

// Результат измерения
interface MeasurementResult {
  value: number;
  unit: 'dBm' | 'dB';
  mode: MeasurementMode;
  wavelength: Wavelength;
  timestamp: number;
}
```

### Типы пассивных компонентов

```typescript
type PassiveComponentType =
  | 'OPTICAL_CABLE'    // Оптический шнур
  | 'FIBER_COIL'       // Катушка ОВ
  | 'SPLITTER_1_2'     // Сплиттер 1:2
  | 'SPLITTER_1_4'     // Сплиттер 1:4
  | 'SPLITTER_1_8'     // Сплиттер 1:8
  | 'SPLITTER_1_16'    // Сплиттер 1:16
  | 'SPLITTER_1_32'    // Сплиттер 1:32
  | 'SPLITTER_1_64';   // Сплиттер 1:64

interface PassiveComponent {
  id: string;
  type: PassiveComponentType;
  label: string;
  typicalLoss: Record<Wavelength, number>;
  connectorType: 'SC_APC' | 'SC_UPC';
}
```

### Типы тестирования

```typescript
// src/components/test/types.ts
type TestQuestion = SingleChoiceQuestion | MultipleChoiceQuestion | TextQuestion;

interface SingleChoiceQuestion {
  id: string;
  type: 'single';
  text: string;
  answers: Answer[];
}

interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple';
  text: string;
  answers: Answer[];
}

interface TextQuestion {
  id: string;
  type: 'text';
  text: string;
  validator?: (answer: string) => boolean;
  answers: Answer[];
}
```

---

## Стайлинг и UI паттерны

### Tailwind CSS v4 конфигурация

```css
/* src/index.css */
@theme {
  --color-sibguti-main: #1f508f;        /* Корпоративный цвет СибГУТИ */
  --color-fot930-blue: #3b7ab5;         /* Основной цвет прибора */
  --color-fot930-blue-hover: #31628f;   /* Hover состояние */
  --color-fot930-blue-active: #22496d;  /* Active состояние */
}
```

### Условные классы с clsx

```typescript
import clsx from 'clsx';

<div className={clsx(
  'base-class',
  { 'active-class': isActive },
  { 'disabled-class': isDisabled }
)} />
```

### Компонент Show для условного рендеринга

```typescript
import { Show } from '@/lib/components';

<Show when={condition} fallback={<LoadingSpinner />}>
  <Content />
</Show>
```

---

## Measurement Engine

### Генерация реалистичных измерений

**src/lib/fot930/measurementEngine.ts** эмулирует физику оптических измерений:

```typescript
// Типичные потери компонентов (dB) для разных длин волн
export const COMPONENT_LOSS_DB: Record<string, Record<Wavelength, number>> = {
  OPTICAL_CABLE: { 850: 0.5, 1300: 0.4, 1310: 0.35, 1550: 0.3, 1625: 0.32 },
  FIBER_COIL: { 850: 2.5, 1300: 2.0, 1310: 1.8, 1550: 1.5, 1625: 1.6 },
  SPLITTER_1_2: { 850: 3.5, 1300: 3.3, 1310: 3.2, 1550: 3.0, 1625: 3.1 },
  // ...и т.д.
};
```

**Функции генерации**:

```typescript
// Измерение одиночного компонента
generateSingleComponentMeasurement(
  component: PassiveComponent,
  mode: MeasurementMode,
  wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string }

// Измерение сложной схемы
generateComplexSchemeMeasurement(
  scheme: ConnectionScheme,
  components: PassiveComponent[],
  mode: MeasurementMode,
  wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string }

// Валидация схемы подключения
validateConnectionScheme(scheme: ConnectionScheme): {
  valid: boolean;
  error?: string;
}
```

**Физические параметры**:
- Мощность источника: -5.0 до -8.5 dBm (зависит от длины волны)
- Потери на коннекторе: 0.3 dB
- Потери на сварке: 0.1 dB
- Максимальные измеримые потери: 45 dB
- Стандартное отклонение: 0.15 dB (для реалистичной вариации)

---

## Рабочий процесс (User Flow)

### 1. Регистрация студента
```
App.tsx → RegistrationForm → Сохранение в userData/student_data.json → Layout
```

### 2. Структура Layout
```
Layout (3 таба)
├── Theory (Теория)
│   ├── Теоретический материал
│   └── Инструкции к лабораторной работе
├── Admission Test (Входной тест)
│   └── 15 вопросов для допуска
└── Lab Work (Лабораторная работа)
    ├── PREPARATION (Подготовка прибора)
    │   ├── Включение прибора
    │   ├── Очистка портов
    │   ├── Настройка FasTest
    │   └── Измерение опорного значения
    ├── CONNECTION_SCHEME (Сборка схемы)
    │   ├── Выбор компонента
    │   ├── Drag-and-drop сборка схемы
    │   └── Выполнение измерений (3 попытки)
    └── RESULTS_ANALYSIS (Анализ результатов)
        └── Таблица всех измерений
```

### 3. Этапы подготовки прибора

**Шаг 1: Включение**
- Нажатие кнопки POWER
- Экран LOADING (2-3 сек)
- Переход на экран MAIN

**Шаг 2: Очистка портов**
- Нажатие кнопки в UI "Очистить порты"
- Анимация очистки (3 сек)
- portStatus: 'dirty' → 'cleaning' → 'clean'

**Шаг 3: Настройка FasTest**
- MENU → ENTER (вход в FasTest Setup)
- Настройка параметров:
  - Port Type: MM или SM
  - Length Unit: ft, mi, m, km
  - Loss Wavelengths: выбор из [1310, 1550, 1625]
- Правильная конфигурация: SM + m + [1310, 1550]
- BACK → сохранение настроек

**Шаг 4: Измерение Reference**
- FASTEST → экран FASTEST_MAIN
- UP/DOWN → выбор "Тип опор. зн: Обрат. петля"
- F1 → запуск измерения
- Экран FASTEST_MEASURING (3 сек)
- Сохранение referenceResults[]
- isReadyForMeasurements: true

---

## Ключевые компоненты

### Device.tsx

Главный компонент эмулятора прибора FOT-930.

**Props**:
```typescript
interface DeviceProps {
  onDeviceStateChange?: (state: DeviceState) => void;
  onDispatchReady?: (dispatch: Dispatch<DeviceAction>) => void;
}
```

**Функциональность**:
- Использует `useReducer` с `deviceReducer`
- Рендерит кнопки управления
- Отображает экран прибора
- Предоставляет dispatch наружу через callback

### DeviceScreen.tsx

Мультиплексор экранов прибора на основе `state.screen`.

```typescript
switch (state.screen) {
  case 'OFF': return <ScreenOff />;
  case 'LOADING': return <ScreenLoading />;
  case 'MAIN': return <ScreenMain state={state} />;
  case 'MENU_SETUP': return <ScreenMenuSetup state={state} />;
  case 'FASTEST_SETUP': return <ScreenFastestSetup state={state} />;
  case 'FASTEST_MAIN': return <ScreenFastestMain state={state} />;
  case 'FASTEST_MEASURING': return <ScreenFastestMeasuring state={state} />;
}
```

### ConnectionBuilder.tsx

Конструктор измерительных схем с drag-and-drop.

**Компоненты**:
- `DraggableElement` - перетаскиваемые элементы
- `DropZone` - зоны для сброса
- `EmptyDropZone` - пустые зоны
- `ElementCard` - карточки элементов
- `ElementContent` - содержимое элементов

**API**:
```typescript
interface ConnectionBuilderProps {
  scheme: ConnectionScheme;
  availableElements: Element[];
  onSchemeChange: (scheme: ConnectionScheme) => void;
}
```

### Test.tsx

Универсальный компонент для тестирования.

**Props**:
```typescript
interface TestProps {
  questions: TestQuestion[];
  testID: 'admissionTest' | 'finalTest';
}
```

**Функции**:
- Навигация по вопросам (Next/Back)
- Валидация ответов
- Подсчет результатов
- Расчет оценки (5/4/3/2)
- Сохранение результатов через Electron API

---

## Правила и конвенции

### 1. Именование файлов

- Компоненты: `PascalCase.tsx` (ComponentName.tsx)
- Утилиты: `camelCase.ts` (utilityName.ts)
- Типы: `camelCase.ts` (types.ts)
- Константы: `UPPER_SNAKE_CASE`

### 2. Импорты

Используем абсолютные пути через Vite:

```typescript
// ❌ Относительные пути
import { Device } from '../../components/fot930';

// ✅ Абсолютные пути (через src/)
import { Device } from '@/components/fot930';
```

Группировка импортов:
```typescript
// 1. External dependencies
import { useState, useCallback } from 'react';
import clsx from 'clsx';

// 2. Internal types
import type { DeviceState, DeviceAction } from '@/types/fot930';

// 3. Internal components
import { Device } from '@/components/fot930';

// 4. Internal utilities
import { generateMeasurement } from '@/lib/fot930/measurementEngine';

// 5. Styles (если есть)
import './styles.css';
```

### 3. TypeScript

**Строгая типизация**:
```typescript
// ❌ Избегать any
const data: any = response;

// ✅ Использовать конкретные типы
const data: Student = response;

// ✅ Использовать unknown для неизвестных типов
const data: unknown = response;
if (isStudent(data)) {
  // Type guard
}
```

**Предпочитать type над interface для union types**:
```typescript
// ✅ Для union/intersection types
type Section = 'theory' | 'admission' | 'lab-work';

// ✅ Для объектов можно использовать interface
interface Student {
  name: string;
  group: string;
}
```

### 4. React паттерны

**Hooks порядок**:
```typescript
function Component() {
  // 1. Hooks
  const [state, setState] = useState();
  const dispatch = useDispatch();
  const value = useContext(SomeContext);

  // 2. useMemo/useCallback
  const memoValue = useMemo(() => compute(), [deps]);
  const handler = useCallback(() => {}, [deps]);

  // 3. useEffect
  useEffect(() => {}, [deps]);

  // 4. Render
  return <div />;
}
```

**Props деструктуризация**:
```typescript
// ✅ Предпочитаемый вариант
function Component({ prop1, prop2 }: Props) {
  return <div>{prop1}</div>;
}

// ❌ Избегать
function Component(props: Props) {
  return <div>{props.prop1}</div>;
}
```

### 5. Стилизация

**Tailwind классы**:
- Используем utility-first подход
- Группируем классы логически
- Используем `clsx` для условных классов

```typescript
<div className={clsx(
  // Layout
  'flex flex-col gap-4',
  // Sizing
  'w-full h-screen',
  // Styling
  'bg-white rounded-lg shadow-md',
  // Conditional
  { 'opacity-50': isDisabled }
)} />
```

**Кастомные цвета через CSS Variables**:
```typescript
<div className="bg-fot930-blue hover:bg-fot930-blue-hover" />
```

### 6. Комментарии

**JSDoc для публичных API**:
```typescript
/**
 * Генерирует реалистичное измерение для одиночного компонента
 *
 * @param component - Пассивный компонент для измерения
 * @param mode - Режим измерения (POWER или LOSS)
 * @param wavelength - Длина волны измерения (нм)
 * @returns Результат измерения или ошибка
 */
export function generateSingleComponentMeasurement(
  component: PassiveComponent,
  mode: MeasurementMode,
  wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string }
```

**Inline комментарии для сложной логики**:
```typescript
// Проверяем, не превышает ли затухание допустимый предел
if (totalLoss > MEASUREMENT_CONFIG.MAX_MEASURABLE_LOSS) {
  return { error: 'Loss exceeds measurement range' };
}
```

---

## Workflow для разработки

### Запуск dev-сервера

```bash
npm run dev
```

Запускает:
- Vite dev server на `http://0.0.0.0:1420`
- Electron приложение
- Hot Module Replacement (HMR)
- DevTools открываются автоматически

### Сборка приложения

```bash
# Компиляция TypeScript + сборка Vite
npm run build

# Упаковка в дистрибутив (Windows NSIS)
npm run dist

# Только упаковка (без сборки)
npm run pack
```

### Линтинг и форматирование

```bash
# ESLint + Biome проверка
npm run lint

# Biome форматирование
npm run biome:format

# Biome lint
npm run biome:lint

# Biome проверка и исправление
npm run biome:check
```

---

## Данные и персистентность

### Хранение данных студента

**Путь**: `app.getPath('userData')/student_data.json`

**Windows**: `C:\Users\{username}\AppData\Roaming\diplom-project\student_data.json`

**Структура**:
```json
{
  "name": "Иван Иванов",
  "group": "ИБ-11",
  "admissionTestResult": {
    "totalQuestions": 15,
    "correctAnswers": 13,
    "grade": 5
  },
  "finalTestResult": {
    "totalQuestions": 30,
    "correctAnswers": 25,
    "grade": 4
  }
}
```

### Очистка данных (для разработки)

Добавлено служебное меню в dev-режиме:

```
Меню → Служебное → Очистить данные регистрации
```

---

## Частые задачи

### Добавление нового экрана прибора

1. Добавить тип экрана в `src/types/fot930.ts`:
```typescript
type DeviceScreen =
  | 'OFF'
  | 'LOADING'
  | 'MAIN'
  | 'NEW_SCREEN'; // ← новый экран
```

2. Создать компонент экрана `src/components/fot930/device-screen/ScreenNewScreen.tsx`:
```typescript
interface ScreenNewScreenProps {
  state: DeviceState;
}

export function ScreenNewScreen({ state }: ScreenNewScreenProps) {
  return <div>New Screen Content</div>;
}
```

3. Добавить в `DeviceScreen.tsx`:
```typescript
case 'NEW_SCREEN':
  return <ScreenNewScreen state={state} />;
```

4. Добавить логику перехода в `deviceReducer.ts`.

### Добавление нового пассивного компонента

1. Добавить тип в `src/types/fot930.ts`:
```typescript
type PassiveComponentType =
  | 'OPTICAL_CABLE'
  | 'NEW_COMPONENT'; // ← новый компонент
```

2. Добавить потери в `measurementEngine.ts`:
```typescript
export const COMPONENT_LOSS_DB = {
  // ...
  NEW_COMPONENT: {
    850: 1.0,
    1300: 0.9,
    1310: 0.85,
    1550: 0.8,
    1625: 0.82
  }
};
```

3. Добавить в список компонентов в `LabWork.tsx`:
```typescript
const availableComponents: PassiveComponent[] = [
  // ...
  {
    id: 'new_component_1',
    type: 'NEW_COMPONENT',
    label: 'Новый компонент',
    typicalLoss: COMPONENT_LOSS_DB.NEW_COMPONENT,
    connectorType: 'SC_APC'
  }
];
```

### Добавление вопроса в тест

Редактировать `src/components/sections/admission-test/questions-bank.ts`:

```typescript
export const admissionTestQuestions: TestQuestion[] = [
  // ...
  {
    id: 'new_question',
    type: 'single', // или 'multiple', 'text'
    text: 'Текст вопроса?',
    answers: [
      { text: 'Вариант 1', isCorrect: false },
      { text: 'Вариант 2', isCorrect: true },
      { text: 'Вариант 3', isCorrect: false }
    ]
  }
];
```

---

## Известные ограничения и TODO

### Текущие ограничения

1. **Отсутствие финального теста** - реализован только входной тест (15 вопросов)
2. **Упрощенная эмуляция** - не все функции реального FOT-930 реализованы
3. **Одиночный пользователь** - данные хранятся локально, нет многопользовательской поддержки
4. **Отсутствие экспорта результатов** - нет возможности экспортировать результаты в PDF/Excel

### Будущие улучшения

- [ ] Добавить финальный тест после выполнения лабораторной работы
- [ ] Реализовать экспорт отчета по лабораторной работе
- [ ] Добавить больше пассивных компонентов
- [ ] Реализовать измерение ORL (Optical Return Loss)
- [ ] Добавить сложные схемы с последовательным соединением
- [ ] Реализовать режим "Преподаватель" для просмотра результатов студентов
- [ ] Добавить статистику и аналитику выполнения

---

## Debug и troubleshooting

### Открыть DevTools в production

В production режиме DevTools скрыты, но их можно открыть через:

```typescript
// В electron/main.ts добавить:
win.webContents.openDevTools();
```

### Проверка данных студента

```javascript
// В DevTools Console
await window.electronAPI.loadStudent()
```

### Сброс состояния прибора

Прибор использует конечный автомат. Для сброса:
1. Выключить прибор (кнопка POWER)
2. Включить снова

Или программно:
```typescript
dispatch({ type: 'PRESS_POWER' }); // Выключить
dispatch({ type: 'PRESS_POWER' }); // Включить
```

### Логирование действий прибора

Добавить в `deviceReducer.ts`:
```typescript
export function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  console.log('Action:', action.type, 'State:', state.screen);
  // ...остальной код
}
```

---

## Полезные ссылки

### Документация используемых технологий

- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- [Vite Guide](https://vitejs.dev/guide/)

### Специфичные для проекта

- Руководство FOT-930: [внешняя документация]
- Теория ВОЛС: [материалы курса]

---

## Контакты и поддержка

**Тип проекта**: Дипломный проект
**Учебное заведение**: СибГУТИ
**Разработчик**: [Информация о разработчике]

---

## Changelog

### v0.0.0 (текущая версия)
- ✅ Базовая структура приложения
- ✅ Регистрация студентов
- ✅ Теоретический раздел
- ✅ Входной тест (15 вопросов)
- ✅ Эмулятор FOT-930
- ✅ Подготовительный этап
- ✅ Конструктор схем (drag-and-drop)
- ✅ Движок измерений
- ⚠️ Измерения пассивных компонентов (в разработке)
- ⚠️ Сложные схемы (TODO)
- ⚠️ Анализ результатов (TODO)
- ❌ Финальный тест (не реализован)

---

**Последнее обновление**: 2026-02-07
