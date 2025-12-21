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
	},
	{
		id: 'q16',
		type: 'single',
		text: 'Что происходит при нажатии кнопки REF во время измерения?',
		answers: [
			{ text: 'Прибор выключается', isCorrect: false },
			{
				text: 'Прибор устанавливает текущий уровень как 0 дБ потерь',
				isCorrect: true
			},
			{ text: 'Изменяется длина волны', isCorrect: false },
			{ text: 'Очищается память', isCorrect: false }
		]
	},
	{
		id: 'q17',
		type: 'single',
		text: 'Что произойдёт, если после REF сменить длину волны?',
		answers: [
			{ text: 'Ничего', isCorrect: false },
			{ text: 'Прибор автоматически пересчитает значения', isCorrect: false },
			{ text: 'Измерение станет некорректным', isCorrect: true },
			{ text: 'REF останется прежним и игнорируется', isCorrect: false }
		]
	},
	{
		id: 'q18',
		type: 'single',
		text: 'Как температура влияет на измерения?',
		answers: [
			{ text: 'Не оказывает влияния', isCorrect: false },
			{ text: 'Меняет чувствительность фотодетектора', isCorrect: true },
			{ text: 'Меняет длину волны света', isCorrect: false },
			{ text: 'Уменьшает затухание волокна', isCorrect: false }
		]
	},
	{
		id: 'q19',
		type: 'single',
		text: 'Как влияет модуляция источника на измерения?',
		answers: [
			{ text: 'Уменьшает шум за счёт селективного приёма', isCorrect: true },
			{ text: 'Увеличивает мощность', isCorrect: false },
			{ text: 'Уменьшает длину волны', isCorrect: false },
			{ text: 'Ускоряет измерения', isCorrect: false }
		]
	},
	{
		id: 'q20',
		type: 'single',
		text: 'Что измеряет ORL (Optical Return Loss)?',
		answers: [
			{ text: 'Пропускную способность', isCorrect: false },
			{ text: 'Множество мод', isCorrect: false },
			{ text: 'Потери на обратное отражение', isCorrect: true },
			{ text: 'Количество сварных соединений', isCorrect: false }
		]
	},
	{
		id: 'q21',
		type: 'single',
		text: 'Высокое значение ORL означает:',
		answers: [
			{ text: 'Много обратных отражений', isCorrect: false },
			{ text: 'Мало обратных отражений', isCorrect: true },
			{ text: 'Отсутствие сигнала', isCorrect: false },
			{ text: 'Повреждение волокна', isCorrect: false }
		]
	},
	{
		id: 'q22',
		type: 'single',
		text: 'С какой целью выполняют "нулевое" измерение ORL?',
		answers: [
			{ text: 'Для обнуления памяти', isCorrect: false },
			{
				text: 'Для исключения паразитных отражений до тестируемого компонента',
				isCorrect: true
			},
			{ text: 'Для включения лазера', isCorrect: false },
			{ text: 'Для проверки батареи', isCorrect: false }
		]
	},
	{
		id: 'q23',
		type: 'single',
		text: 'Почему нельзя смотреть в торец активного волокна?',
		answers: [
			{ text: 'Можно ослепнуть от видимого света', isCorrect: false },
			{ text: 'Это запрещено по санитарным нормам', isCorrect: false },
			{
				text: 'Невидимое ИК-излучение может повредить сетчатку',
				isCorrect: true
			},
			{ text: 'Это снижает точность измерений', isCorrect: false }
		]
	},
	{
		id: 'q24',
		type: 'single',
		text: 'Что необходимо сделать перед измерениями на рабочей линии?',
		answers: [
			{ text: 'Измерить температуру помещения', isCorrect: false },
			{ text: 'Проверить наличие активного сигнала в линии', isCorrect: true },
			{ text: 'Отключить батарею', isCorrect: false },
			{ text: 'Поменять длину волны', isCorrect: false }
		]
	},
	{
		id: 'q25',
		type: 'single',
		text: 'Что описывает величина дБ?',
		answers: [
			{ text: 'Абсолютное значение мощности', isCorrect: false },
			{ text: 'Относительное значение двух величин', isCorrect: true },
			{ text: 'Длину волны', isCorrect: false },
			{ text: 'Скорость передачи данных', isCorrect: false }
		]
	},
	{
		id: 'q26',
		type: 'single',
		text: 'Какая величина может быть измерена только в одномодовом волокне?',
		answers: [
			{ text: 'Оптическая мощность', isCorrect: false },
			{ text: 'Потери', isCorrect: false },
			{ text: 'ORL', isCorrect: true },
			{ text: 'Длина линии', isCorrect: false }
		]
	},
	{
		id: 'q27',
		type: 'single',
		text: 'Какой стандарт определяет нормы измерений в ВОЛС?',
		answers: [
			{ text: 'ISO 9001', isCorrect: false },
			{ text: 'ITU-T G.652', isCorrect: true },
			{ text: 'IEEE 802.3', isCorrect: false },
			{ text: 'EN 55022', isCorrect: false }
		]
	},
	{
		id: 'q28',
		type: 'single',
		text: 'Какое действие выполняется первым во время подготовки к измерению?',
		answers: [
			{ text: 'Подключение тестируемой линии', isCorrect: false },
			{ text: 'Включение VFL', isCorrect: false },
			{ text: 'Очистка коннекторов', isCorrect: true },
			{ text: 'Нажатие REF', isCorrect: false }
		]
	},
	{
		id: 'q29',
		type: 'single',
		text: 'Что собой представляет FOT-930?',
		answers: [
			{ text: 'Источник света', isCorrect: false },
			{ text: 'Измеритель ORL', isCorrect: false },
			{ text: 'Многофункциональный оптический тестер', isCorrect: true },
			{ text: 'Лазерный анализатор спектра', isCorrect: false }
		]
	},
	{
		id: 'q30',
		type: 'single',
		text: 'Какие модули могут быть встроены в FOT-930?',
		answers: [
			{ text: 'Рефлектометр', isCorrect: false },
			{ text: 'Источник + измеритель мощности + ORL', isCorrect: true },
			{ text: 'Измеритель дисперсии', isCorrect: false },
			{ text: 'Генератор сигналов Ethernet', isCorrect: false }
		]
	},
	{
		id: 'q31',
		type: 'single',
		text: 'Для чего служит функция FasTesT?',
		answers: [
			{ text: 'Измерение только мощности', isCorrect: false },
			{ text: 'Автоматическое измерение потерь/ORL/длины', isCorrect: true },
			{ text: 'Калибровка REF', isCorrect: false },
			{ text: 'Чистка коннекторов', isCorrect: false }
		]
	},
	{
		id: 'q32',
		type: 'text',
		text: 'Сколько длин волн может измерить FasTesT?',
		validator: (v) => /4|четыре/i.test(v)
	},
	{
		id: 'q33',
		type: 'single',
		text: 'Какой порт используется для измерения ORL?',
		answers: [
			{ text: 'MM', isCorrect: false },
			{ text: 'OM', isCorrect: false },
			{ text: 'Порт FasTesT SM', isCorrect: true },
			{ text: 'RS-232', isCorrect: false }
		]
	},
	{
		id: 'q34',
		type: 'single',
		text: 'Что обозначает индикатор Active?',
		answers: [
			{ text: 'Заряд батареи', isCorrect: false },
			{ text: 'Наличие сигнала в волокне', isCorrect: false },
			{ text: 'Активность источника/ORL/VFL', isCorrect: true },
			{ text: 'Состояние дисплея', isCorrect: false }
		]
	},
	{
		id: 'q35',
		type: 'single',
		text: 'В каком режиме измеритель автоматически подстраивает длину волны под источник?',
		answers: [
			{ text: 'Power Mode', isCorrect: false },
			{ text: 'Manual', isCorrect: false },
			{ text: 'Auto-ID', isCorrect: true },
			{ text: 'ORL Mode', isCorrect: false }
		]
	},
	{
		id: 'q36',
		type: 'single',
		text: 'Как отключить источник излучения?',
		answers: [
			{ text: 'Выключить прибор', isCorrect: false },
			{ text: 'Удерживать REF', isCorrect: false },
			{ text: 'Переключить длины волн до режима «Выкл»', isCorrect: true },
			{ text: 'Отключить питание', isCorrect: false }
		]
	},
	{
		id: 'q37',
		type: 'single',
		text: 'Что такое измерение опорного значения в FasTesT?',
		answers: [
			{ text: 'Измерение длины волны', isCorrect: false },
			{ text: 'Сохранение нуля для ORL', isCorrect: false },
			{ text: 'Вычитание потерь измерительных компонентов', isCorrect: true },
			{ text: 'Тест батареи', isCorrect: false }
		]
	},
	{
		id: 'q38',
		type: 'single',
		text: 'Какой метод опорного значения более точный?',
		answers: [
			{ text: 'Обратная петля', isCorrect: false },
			{ text: 'Точка-точка', isCorrect: true },
			{ text: 'Смешанный', isCorrect: false },
			{ text: 'Нет разницы', isCorrect: false }
		]
	},
	{
		id: 'q39',
		type: 'single',
		text: 'В каком случае необходимо повторно устанавливать ноль ORL?',
		answers: [
			{ text: 'После полной зарядки', isCorrect: false },
			{ text: 'После смены патч-корда', isCorrect: true },
			{ text: 'После выключения дисплея', isCorrect: false },
			{ text: 'После смены аккумулятора', isCorrect: false }
		]
	},
	{
		id: 'q40',
		type: 'single',
		text: 'Что делает функция "Ноль ORL по умолчанию"?',
		answers: [
			{ text: 'Устанавливает максимальную мощность', isCorrect: false },
			{
				text: 'Возвращает заводские настройки чувствительности ORL',
				isCorrect: true
			},
			{ text: 'Переводит прибор в спящий режим', isCorrect: false },
			{ text: 'Изменяет длину волны', isCorrect: false }
		]
	},
	{
		id: 'q41',
		type: 'text',
		text: 'Сколько значений можно хранить в памяти FOT-930?',
		validator: (v) => /1024/i.test(v)
	},
	{
		id: 'q42',
		type: 'single',
		text: 'Что отображает измеритель мощности на экране?',
		answers: [
			{ text: 'Только мощность', isCorrect: false },
			{ text: 'Мощность, длину волны, заряд батареи', isCorrect: true },
			{ text: 'Температуру', isCorrect: false },
			{ text: 'Количество измерений', isCorrect: false }
		]
	},
	{
		id: 'q43',
		type: 'single',
		text: 'Что означает возможность обмена текстовыми сообщениями?',
		answers: [
			{ text: 'Отправка SMS', isCorrect: false },
			{ text: 'Коммуникация между двумя тестерами', isCorrect: true },
			{ text: 'Полноценный чат', isCorrect: false },
			{ text: 'Передача e-mail', isCorrect: false }
		]
	},
	{
		id: 'q44',
		type: 'single',
		text: 'Как переключить длину волны источника?',
		answers: [
			{ text: 'Через REF', isCorrect: false },
			{ text: 'Через кнопку Длина волны (F1/F2)', isCorrect: true },
			{ text: 'Через VFL', isCorrect: false },
			{ text: 'Через Reset', isCorrect: false }
		]
	},
	{
		id: 'q45',
		type: 'single',
		text: 'Что показывает строка состояния?',
		answers: [
			{ text: 'Статус источника', isCorrect: true },
			{ text: 'Текущую дату', isCorrect: false },
			{ text: 'Температуру', isCorrect: false },
			{ text: 'Версию прошивки', isCorrect: false }
		]
	},
	{
		id: 'q46',
		type: 'single',
		text: 'В каком случае невозможно вручную изменить длину волны измерителя мощности?',
		answers: [
			{ text: 'При низком заряде батареи', isCorrect: false },
			{ text: 'При работе в Auto-ID', isCorrect: true },
			{ text: 'При включённом VFL', isCorrect: false },
			{ text: 'При измерении ORL', isCorrect: false }
		]
	},
	{
		id: 'q47',
		type: 'text',
		text: 'Что называется разностью между мощностью на входе и выходе волокна, выраженная в дБ?',
		validator: (v) => /оптические потери/i.test(v)
	},
	{
		id: 'q48',
		type: 'text',
		text: 'Во сколько раз увеличится мощность при изменении значения +3 дБ?',
		validator: (v) => /(в\s*)?2(\s*раз[а]?)?/i.test(v)
	},
	{
		id: 'q49',
		type: 'text',
		text: 'Какой длине волны соответствует минимальное затухание одномодового волокна?',
		validator: (v) => /1550(\s*нм)?/i.test(v)
	},
	{
		id: 'q50',
		type: 'text',
		text: 'Что измеряет параметр ORL?',
		validator: (v) =>
			/возвратные потери|уровень отраженного назад сигнала/i.test(v)
	},
	{
		id: 'q51',
		type: 'multiple',
		text: 'Какие факторы увеличивают оптические потери в линии? Выберите все подходящие варианты.',
		answers: [
			{ text: 'Загрязнение торцов коннекторов', isCorrect: true },
			{ text: 'Макроизгибы волокна', isCorrect: true },
			{ text: 'Перегрев оболочки', isCorrect: false },
			{ text: 'Некачественные сварные соединения', isCorrect: true }
		]
	},
	{
		id: 'q52',
		type: 'multiple',
		text: 'Что относится к основным преимуществам логарифмической шкалы (дБ)?',
		answers: [
			{
				text: 'Удобно сравнивать большие диапазоны мощностей',
				isCorrect: true
			},
			{ text: 'Уменьшается риск ошибок при расчётах', isCorrect: true },
			{ text: 'Увеличивает реальную мощность сигнала', isCorrect: false },
			{
				text: 'Легче интерпретировать изменение в десятки раз',
				isCorrect: true
			}
		]
	},
	{
		id: 'q53',
		type: 'multiple',
		text: 'Какие величины можно измерить оптическим тестером FOT-930?',
		answers: [
			{ text: 'Оптическую мощность', isCorrect: true },
			{ text: 'Оптические потери', isCorrect: true },
			{ text: 'Температуру помещения', isCorrect: false },
			{ text: 'ORL (возвратные потери)', isCorrect: true }
		]
	},
	{
		id: 'q54',
		type: 'multiple',
		text: 'Какие элементы необходимо обязательно очистить перед измерением?',
		answers: [
			{ text: 'Патч-корды', isCorrect: true },
			{ text: 'Адаптеры / переходники', isCorrect: true },
			{ text: 'Лазерный модуль', isCorrect: false },
			{ text: 'Выходные ферулы источника и измерителя', isCorrect: true }
		]
	},
	{
		id: 'q55',
		type: 'multiple',
		text: 'Какие компоненты входят в измерительный комплект FasTesT?',
		answers: [
			{ text: 'Источник света', isCorrect: true },
			{ text: 'Измеритель мощности', isCorrect: true },
			{ text: 'Набор сварочного оборудования', isCorrect: false },
			{ text: 'Модуль ORL', isCorrect: true }
		]
	},
	{
		id: 'q56',
		type: 'multiple',
		text: 'Какие действия приводят к неправильным измерениям ORL?',
		answers: [
			{ text: 'Смена патч-корда после нулевой калибровки', isCorrect: true },
			{ text: 'Загрязнение разъёмов', isCorrect: true },
			{ text: 'Низкая яркость дисплея', isCorrect: false },
			{ text: 'Неправильное подключение к порту FasTesT SM', isCorrect: true }
		]
	},
	{
		id: 'q57',
		type: 'multiple',
		text: 'Какие характеристики определяют тип оптического волокна?',
		answers: [
			{ text: 'Диаметр сердцевины', isCorrect: true },
			{ text: 'Длина волны работы', isCorrect: false },
			{ text: 'Количество распространяемых мод', isCorrect: true },
			{ text: 'Цвет внешней оболочки', isCorrect: false }
		]
	},
	{
		id: 'q58',
		type: 'multiple',
		text: 'При каких условиях необходимо устанавливать новое опорное значение REF?',
		answers: [
			{ text: 'Замена тестируемого патч-корда', isCorrect: true },
			{ text: 'Изменение длины волны', isCorrect: true },
			{ text: 'Переключение яркости дисплея', isCorrect: false },
			{ text: 'Подключение нового участка линии', isCorrect: true }
		]
	},
	{
		id: 'q59',
		type: 'multiple',
		text: 'Какие признаки говорят о наличии активного сигнала в линии?',
		answers: [
			{ text: 'Индикатор «Active» на приборе', isCorrect: true },
			{ text: 'Резкий рост уровня мощности на измерителе', isCorrect: true },
			{ text: 'Нет свечения VFL', isCorrect: false },
			{
				text: 'Автоматический переход прибора в режим Auto-ID',
				isCorrect: true
			}
		]
	},
	{
		id: 'q60',
		type: 'multiple',
		text: 'Какие длины волн являются стандартными для одномодового волокна?',
		answers: [
			{ text: '850 нм', isCorrect: false },
			{ text: '1310 нм', isCorrect: true },
			{ text: '1490 нм', isCorrect: true },
			{ text: '1550 нм', isCorrect: true }
		]
	}
];
