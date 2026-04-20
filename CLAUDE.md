# CLAUDE.md — FOT-930 Lab Interface

Виртуальный лабораторный стенд (Electron + React + TS + Vite): эмуляция оптического тестера FOT-930, теория, входной тест (15 вопросов), лабораторная работа со схемой и измерениями. Детали типов и API — в исходниках (`src/types/fot930.ts`, редьюсер, движок измерений).

## Стек

Electron 39 · React 19 · TS 5.9 · Vite 7 · Tailwind 4 (`@tailwindcss/vite`) · clsx · ESLint 9 + Biome 2 · electron-builder 26 · vite-plugin-electron (+ renderer).

## Карта репозитория

- `electron/` — `main.ts`, `preload.ts`, сервисное меню, очистка регистрации.
- `src/components/fot930/` — прибор: `Device`, `DeviceScreen`, `ConnectionBuilder`, `MeasurementTable`, `device/`, `device-screen/`, `connection-builder/`.
- `src/components/sections/` — `theory/`, `admission-test/` (`questions-bank.ts`), `lab-work/` (этапы: подготовка, схема, измерения, результаты), `defect-module/` (сцена дефектовки, VFL и др.).
- `src/components/registration-form/`, `test/`, `tabs/`, `header/`.
- `src/lib/fot930/` — `deviceReducer.ts` (FSM), `measurementEngine.ts`.
- `src/types/` — `fot930.ts`, `electron.d.ts`, общий `index.ts`.
- Точки входа: `App.tsx`, `Layout.tsx`, `main.tsx`, `index.css` (`@theme`: цвета СибГУТИ / FOT-930).

## Состояние и данные

- Глобально: **TabsContext** (вкладки), **RegistrationContext** (студент).
- Прибор: **useReducer** + `deviceReducer` — экраны `OFF` → `LOADING` → `MAIN` → меню / FasTest (`MENU_SETUP`, `FASTEST_*` и т.д.). Полный список экранов и **DeviceAction** — в `deviceReducer.ts` и типах.
- IPC: в `preload` экспортируется `window.electronAPI` (например `saveStudent` / `loadStudent`); в `main` — `ipcMain.handle`, файлы в `userData`.

## Движок измерений (`measurementEngine.ts`)

`generateSingleComponentMeasurement`, `generateComplexSchemeMeasurement`, `validateConnectionScheme`; базовые потери — `COMPONENT_LOSS_DB` по длинам волн. Пороги и физика (источник, коннектор, сварка, шум) — в том же файле.

## Поток пользователя (кратко)

Регистрация → JSON в userData → три вкладки: теория, входной тест, лабораторная работа. Лаба: подготовка прибора (питание, очистка портов, FasTest SM + m + волны 1310/1550, reference) → сборка схемы (DnD) → измерения → результаты.

## Команды

`npm run dev` — Vite (порт из конфига, часто 1420) + Electron + HMR.  
`npm run build` / `npm run dist` / `npm run pack` — сборка и упаковка.  
`npm run lint`, `npm run biome:format`, `npm run biome:lint`, `npm run biome:check`.

## Персистентность

Файл студента: `app.getPath('userData')/student_data.json` (Windows: `AppData\Roaming\diplom-project\`). В dev: меню «Служебное» — очистка регистрации.

## Конвенции кода

- Импорты через алиас `@/…` от `src`, без длинных относительных цепочек.
- Компоненты — `PascalCase.tsx`, утилиты/типы — осмысленные имена файлов.
- UI: Tailwind + `clsx`; кастомные цвета из `@theme` в `index.css`.
- Условный рендер: проектный `Show` из `@/lib/components` (если используется в данном модуле — как в остальном коде).

## Типичные изменения

1. **Новый экран прибора** — значение в `DeviceScreen` (тип), компонент в `device-screen/`, ветка в `DeviceScreen.tsx`, переходы в `deviceReducer.ts`.
2. **Новый пассивный компонент** — расширить `PassiveComponentType` и данные в `fot930.ts`, потери в `COMPONENT_LOSS_DB`, элемент в списке доступных в лабораторной работе.
3. **Новый вопрос теста** — `questions-bank.ts`, формат `TestQuestion` в `components/test/types.ts`.

## Ограничения / планы (высокий уровень)

Не всё из реального FOT-930; финальный тест и экспорт отчётов могут отсутствовать или быть в зачатке — сверяйся с кодом. Мультипользовательской серверной модели нет.

## Отладка

DevTools в dev обычно открыты; в production — только при явной настройке в `main`. Проверка данных: `await window.electronAPI.loadStudent()` в консоли рендерера.

---

Обновлено для компактности: подробные листинги типов и примеры кода удалены в пользу ссылок на файлы.
