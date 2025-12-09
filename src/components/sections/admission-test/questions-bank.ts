import type { TestQuestion } from '../../test';

export const questions: TestQuestion[] = [
	{
		id: 'q1',
		type: 'single',
		text: 'Что такое оптическая мощность в контексте ВОЛС?',
		answers: [
			{ text: 'Скорость передачи данных', isCorrect: false },
			{ text: 'Энергия светового сигнала', isCorrect: true },
			{ text: 'Количество фотонов в секунду', isCorrect: false },
			{ text: 'Длина оптического волокна', isCorrect: false }
		]
	},
	{
		id: 'q2',
		type: 'single',
		text: 'В каких единицах обычно измеряется оптическая мощность?',
		answers: [
			{ text: 'Ваттах', isCorrect: false },
			{ text: 'Милливольтах', isCorrect: false },
			{ text: 'Децибелах относительно 1 мВт (дБм)', isCorrect: true },
			{ text: 'Омах', isCorrect: false }
		]
	},
	{
		id: 'q3',
		type: 'text',
		text: 'Мощность 1 мВт в логарифмической шкале равна:',
		validator: (v) => /0 дбм/i.test(v)
	},
	{
		id: 'q4',
		type: 'single',
		text: 'Если измеренная мощность уменьшилась с 0 дБм до -10 дБм, что это означает?',
		answers: [
			{ text: 'Падение мощности в 5 раз', isCorrect: false },
			{ text: 'Падение мощности в 10 раз', isCorrect: true },
			{ text: 'Падение мощности в 100 раз', isCorrect: false },
			{ text: 'Рост мощности', isCorrect: false }
		]
	},
	{
		id: 'q5',
		type: 'single',
		text: 'Единица измерения оптических потерь — это:',
		answers: [
			{ text: 'Ватты', isCorrect: false },
			{ text: 'Ом', isCorrect: false },
			{ text: 'дБ', isCorrect: true },
			{ text: 'мА', isCorrect: false }
		]
	},
	{
		id: 'q6',
		type: 'single',
		text: 'Что отражают оптические потери в линии?',
		answers: [
			{ text: 'Увеличение полосы пропускания', isCorrect: false },
			{
				text: 'Снижение уровня оптической мощности при прохождении по линии',
				isCorrect: true
			},
			{ text: 'Повышение дисперсии', isCorrect: false },
			{ text: 'Количество мод в волокне', isCorrect: false }
		]
	},
	{
		id: 'q7',
		type: 'single',
		text: 'Какой диапазон длин волн считается «окном прозрачности» для одномодового волокна?',
		answers: [
			{ text: '650 нм', isCorrect: false },
			{ text: '850 нм', isCorrect: false },
			{ text: '1310 нм', isCorrect: true },
			{ text: '405 нм', isCorrect: false }
		]
	},
	{
		id: 'q8',
		type: 'single',
		text: 'На какой длине волны достигается минимальное затухание одномодового волокна?',
		answers: [
			{ text: '480 нм', isCorrect: false },
			{ text: '850 нм', isCorrect: false },
			{ text: '1310 нм', isCorrect: false },
			{ text: '1550 нм', isCorrect: true }
		]
	},
	{
		id: 'q9',
		type: 'single',
		text: 'Какое волокно используется для коротких дистанций в зданиях?',
		answers: [
			{ text: 'Омеднённое', isCorrect: false },
			{ text: 'Одномодовое', isCorrect: false },
			{ text: 'Многомодовое', isCorrect: true },
			{ text: 'Гибридное', isCorrect: false }
		]
	},
	{
		id: 'q10',
		type: 'single',
		text: 'Одномодовое волокно характеризуется:',
		answers: [
			{ text: 'Большой сердцевиной', isCorrect: false },
			{ text: 'Передачей большого числа мод', isCorrect: false },
			{ text: 'Передачей одной моды', isCorrect: true },
			{ text: 'Применением только в видеомониторинге', isCorrect: false }
		]
	},
	{
		id: 'q11',
		type: 'text',
		text: 'Какой основной параметр определяет дисперсию сигнала в волокне?',
		validator: (v) => /длина волны/i.test(v)
	},
	{
		id: 'q12',
		type: 'single',
		text: 'Что является наиболее частой причиной ошибок при измерениях?',
		answers: [
			{ text: 'Неправильный выбор цвета кабеля', isCorrect: false },
			{ text: 'Загрязнённые коннекторы', isCorrect: true },
			{ text: 'Использование лазера 850 нм', isCorrect: false },
			{ text: 'Использование многомодовых волокон', isCorrect: false }
		]
	},
	{
		id: 'q13',
		type: 'single',
		text: 'Чем очищают торцы коннекторов?',
		answers: [
			{ text: 'Бумажной салфеткой', isCorrect: false },
			{ text: 'Салфеткой с водой', isCorrect: false },
			{
				text: 'Изопропиловым спиртом / сухими чистящими кассетами',
				isCorrect: true
			},
			{ text: 'Металлической щёткой', isCorrect: false }
		]
	},
	{
		id: 'q14',
		type: 'single',
		text: 'Что означает отрицательное значение мощности в дБм?',
		answers: [
			{ text: 'Мощность выше 1 мВт', isCorrect: false },
			{ text: 'Мощность меньше 1 мВт', isCorrect: true },
			{ text: 'Ошибка измерения', isCorrect: false },
			{ text: 'Неверная калибровка', isCorrect: false }
		]
	},
	{
		id: 'q15',
		type: 'single',
		text: 'Для чего используется эталонный патч-корд?',
		answers: [
			{ text: 'Для тестирования на перегрев', isCorrect: false },
			{ text: 'Для установки опорного уровня REF', isCorrect: true },
			{ text: 'Для проверки уровня дисперсии', isCorrect: false },
			{ text: 'Для удлинения линии', isCorrect: false }
		]
	}
];
