import type { TestQuestion } from '../../test';

export const questions: TestQuestion[] = [
	{
		id: 'n1',
		type: 'single',
		text: 'Что происходит с оптической мощностью при увеличении затухания линии?',
		answers: [
			{ text: 'Увеличивается', isCorrect: false },
			{ text: 'Остаётся неизменной', isCorrect: false },
			{ text: 'Уменьшается', isCorrect: true },
			{ text: 'Становится равной нулю', isCorrect: false }
		]
	},
	{
		id: 'n7',
		type: 'single',
		text: 'Какой элемент в линии делит сигнал на несколько направлений?',
		answers: [
			{ text: 'Аттенюатор', isCorrect: false },
			{ text: 'Сплиттер', isCorrect: true },
			{ text: 'Коннектор', isCorrect: false },
			{ text: 'Рефлектометр', isCorrect: false }
		]
	},
	{
		id: 'n9',
		type: 'single',
		text: 'Как влияет увеличение длины линии на потери?',
		answers: [
			{ text: 'Потери уменьшаются', isCorrect: false },
			{ text: 'Потери увеличиваются', isCorrect: true },
			{ text: 'Не изменяются', isCorrect: false },
			{ text: 'Становятся случайными', isCorrect: false }
		]
	},
	{
		id: 'n12',
		type: 'multiple',
		text: 'Какие элементы могут входить в оптическую линию связи?',
		answers: [
			{ text: 'Сплиттер', isCorrect: true },
			{ text: 'Коннекторы', isCorrect: true },
			{ text: 'Радиоантенна', isCorrect: false },
			{ text: 'Сплайсы', isCorrect: true },
			{ text: 'Медные кабели', isCorrect: false },
			{ text: 'Ethernet-коммутаторы', isCorrect: false }
		]
	},
	{
		id: 'n14',
		type: 'multiple',
		text: 'Какие параметры необходимо учитывать при расчете потерь линии?',
		answers: [
			{ text: 'Длина кабеля', isCorrect: true },
			{ text: 'Тип соединения', isCorrect: true },
			{ text: 'Тип волокна', isCorrect: true },
			{ text: 'Температура воздуха', isCorrect: false },
			{ text: 'Напряжение питания активного оборудования', isCorrect: false },
			{ text: 'Материал защитной оболочки', isCorrect: false }
		]
	},
	{
		id: 'n15',
		type: 'multiple',
		text: 'Какие типы соединений НЕ используются в ВОЛС?',
		answers: [
			{ text: 'Скрутки оптических волокон', isCorrect: true },
			{ text: 'Сварные соединения', isCorrect: false },
			{ text: 'Резьбовые соединения', isCorrect: false },
			{ text: 'Клеевые соединения', isCorrect: true },
			{ text: 'Коаксиальные соединения', isCorrect: true }
		]
	},
	{
		id: 'n18',
		type: 'multiple',
		text: 'Какие параметры характеризуют сплиттер?',
		answers: [
			{ text: 'Коэффициент деления', isCorrect: true },
			{ text: 'Вносимые потери', isCorrect: true },
			{ text: 'Частота сигнала', isCorrect: false },
			{ text: 'Скорость передачи данных', isCorrect: false }
		]
	},
	{
		id: 'n21',
		type: 'text',
		text: 'Как называется величина потерь, отнесенная к единице длины?',
		validator: (v) => /затухание/i.test(v)
	},
	{
		id: 'n22',
		type: 'text',
		text: 'Рассчитайте потери: 0.35 дБ/км на длине 2 км.',
		validator: (v) => /0\.?7/i.test(v)
	},
	{
		id: 'n24',
		type: 'text',
		text: 'Рассчитайте потери: 0.22 дБ/км на длине 10 км.',
		validator: (v) => /2\.?2/i.test(v)
	},
	{
		id: 'n28',
		type: 'text',
		text: 'Рассчитайте потери: 0.4 дБ/км на длине 5 км.',
		validator: (v) => /2(\.0)?/i.test(v)
	},
	{
		id: 'n25',
		type: 'text',
		text: 'Как называется устройство для разделения оптического сигнала?',
		validator: (v) => /сплитт?ер/i.test(v)
	},
	{
		id: 'ns2',
		type: 'single',
		text: 'Какая длина волны преимущественно используется в многомодовых сетях для коротких расстояний (до 300 м)?',
		answers: [
			{ text: '1310 нм', isCorrect: false },
			{ text: '850 нм', isCorrect: true },
			{ text: '1550 нм', isCorrect: false },
			{ text: '1625 нм', isCorrect: false }
		]
	},
	{
		id: 'nm2',
		type: 'multiple',
		text: 'Какие типы оптических коннекторов наиболее распространены в современных телекоммуникационных ВОЛС?',
		answers: [
			{ text: 'SC', isCorrect: true },
			{ text: 'LC', isCorrect: true },
			{ text: 'FC', isCorrect: true },
			{ text: 'SMA', isCorrect: false }
		]
	},
	{
		id: 'nm6',
		type: 'multiple',
		text: 'Какие типы оптических волокон стандартизированы рекомендациями ITU-T?',
		answers: [
			{ text: 'G.652 (стандартное одномодовое)', isCorrect: true },
			{ text: 'G.653 (волокно со смещённой дисперсией)', isCorrect: true },
			{
				text: 'G.655 (волокно с ненулевой смещённой дисперсией)',
				isCorrect: true
			},
			{ text: 'G.661 (волокно для высоких мощностей)', isCorrect: false }
		]
	},
	{
		id: 'nm9',
		type: 'multiple',
		text: 'Какие преимущества имеет одномодовое волокно перед многомодовым в магистральных сетях?',
		answers: [
			{ text: 'Большая дальность передачи без регенерации', isCorrect: true },
			{ text: 'Более высокая полоса пропускания', isCorrect: true },
			{ text: 'Меньшая хроматическая дисперсия', isCorrect: true },
			{ text: 'Более низкая стоимость приёмопередатчиков', isCorrect: false }
		]
	},
	{
		id: 'nm10',
		type: 'multiple',
		text: 'Какие инструменты необходимы для базового тестирования пассивной оптической линии связи?',
		answers: [
			{ text: 'Стабилизированный источник света', isCorrect: true },
			{ text: 'Измеритель оптической мощности', isCorrect: true },
			{ text: 'Визуальный дефектоскоп (VFL)', isCorrect: true },
			{ text: 'Спектроанализатор', isCorrect: false }
		]
	},
	{
		id: 'nt1',
		type: 'text',
		text: 'Переведите мощность 0,5 мВт в дБм. (Введите число с единицей измерения или только число)',
		validator: (v) => /-3\s*дбм/i.test(v) || /-3/i.test(v)
	},
	{
		id: 'nt2',
		type: 'text',
		text: 'Потери в линии составляют 3 дБ. Во сколько раз уменьшилась мощность сигнала?',
		validator: (v) => /2|два\s*раза?/i.test(v) || /2|два/i.test(v)
	},
	{
		id: 'nt3',
		type: 'text',
		text: 'На входе линии оптическая мощность равна 2 мВт, на выходе — 0,5 мВт. Чему равны потери в линии в дБ?',
		validator: (v) => /6\s*дб/i.test(v) || /6|шесть/i.test(v)
	},
	{
		id: 'nt5',
		type: 'text',
		text: 'На сколько дБ изменится мощность при её увеличении с 1 мВт до 4 мВт?',
		validator: (v) => /(\+)?6\s*дб/i.test(v) || /6|шесть/i.test(v)
	},
	{
		id: 'ns2_2',
		type: 'single',
		text: "Что такое 'окно прозрачности' в контексте оптического волокна?",
		answers: [
			{ text: 'Диапазон длин волн с минимальным затуханием', isCorrect: true },
			{ text: 'Участок волокна, не имеющий дефектов', isCorrect: false },
			{ text: 'Режим работы лазера с низким уровнем шума', isCorrect: false },
			{ text: 'Область низкой дисперсии', isCorrect: false }
		]
	},
	{
		id: 'ns2_3',
		type: 'single',
		text: 'Какой тип полировки торца коннектора обеспечивает наименьшие обратные отражения?',
		answers: [
			{ text: 'PC (Physical Contact)', isCorrect: false },
			{ text: 'UPC (Ultra Physical Contact)', isCorrect: false },
			{ text: 'APC (Angled Physical Contact)', isCorrect: true },
			{ text: 'Flat (плоская)', isCorrect: false }
		]
	},
	{
		id: 'ns2_6',
		type: 'single',
		text: "Что означает маркировка коннектора 'FC/APC'?",
		answers: [
			{ text: 'Волокно с угловой полировкой и фиксатором FC', isCorrect: true },
			{
				text: 'Быстросъёмный коннектор с плоской полировкой',
				isCorrect: false
			},
			{ text: 'Многомодовый коннектор для сетей Ethernet', isCorrect: false },
			{ text: 'Герметичный коннектор для подводных линий', isCorrect: false }
		]
	},
	{
		id: 'ns2_9',
		type: 'single',
		text: 'Какую функцию выполняет визуальный дефектоскоп (VFL — Visual Fault Locator)?',
		answers: [
			{ text: 'Измеряет потери в линии с высокой точностью', isCorrect: false },
			{
				text: 'Подсвечивает место обрыва или изгиба видимым красным светом',
				isCorrect: true
			},
			{ text: 'Определяет тип волокна (SM/MM)', isCorrect: false },
			{ text: 'Измеряет длину волны источника', isCorrect: false }
		]
	},
	{
		id: 'nm2_2',
		type: 'multiple',
		text: 'Какие меры безопасности необходимо соблюдать при работе с оптическим тестером?',
		answers: [
			{
				text: 'Никогда не смотреть в торец активного волокна',
				isCorrect: true
			},
			{ text: 'Выключать лазер перед протиркой коннекторов', isCorrect: true },
			{ text: 'Использовать защитные очки с ИК-фильтром', isCorrect: true },
			{
				text: 'Держать прибор подальше от ярких источников света',
				isCorrect: false
			}
		]
	},
	{
		id: 'nm2_8',
		type: 'multiple',
		text: 'Какие методы очистки оптических коннекторов являются правильными и безопасными?',
		answers: [
			{
				text: 'Использование безворсовых салфеток с изопропиловым спиртом',
				isCorrect: true
			},
			{
				text: 'Применение специальных чистящих кассет (One-Click Cleaner)',
				isCorrect: true
			},
			{ text: 'Продувка сжатым воздухом из баллончика', isCorrect: false },
			{ text: 'Протирка ватной палочкой', isCorrect: false }
		]
	},
	{
		id: 'nt2_3',
		type: 'text',
		text: 'Как называется стандарт одномодового волокна, рекомендованный ITU-T для большинства городских и магистральных сетей?',
		validator: (v) => /g\.652/i.test(v)
	},
	{
		id: 'nt2_4',
		type: 'text',
		text: 'Какая абсолютная мощность в мВт соответствует уровню -9 дБм?',
		validator: (v) => /0,|.125/i.test(v) || /1\/8/i.test(v)
	},
	{
		id: 'ns10',
		type: 'single',
		text: 'Что является основной причиной появления дополнительной погрешности при повторном подключении линии без изменения REF?',
		answers: [
			{ text: 'Случайные изменения температуры', isCorrect: false },
			{ text: 'Изменение контактных потерь в разъемах', isCorrect: true },
			{ text: 'Снижение мощности лазера', isCorrect: false },
			{ text: 'Изменение длины волны', isCorrect: false }
		]
	},
	{
		id: 'ns3',
		type: 'single',
		text: 'Почему использование разных типов полировки коннекторов (APC/UPC) в одной линии увеличивает потери?',
		answers: [
			{
				text: 'Из-за несовпадения угла отражения и геометрии торцов',
				isCorrect: true
			},
			{ text: 'Из-за различий в длине волны', isCorrect: false },
			{ text: 'Из-за разного диаметра оболочки', isCorrect: false },
			{ text: 'Из-за электрического сопротивления', isCorrect: false }
		]
	},
	{
		id: 'nm4',
		type: 'multiple',
		text: 'Какие элементы вносят наибольшие потери в распределительной сети?',
		answers: [
			{ text: 'Сплиттеры', isCorrect: true },
			{ text: 'Длинные кабели', isCorrect: true },
			{ text: 'Оптические шнуры', isCorrect: false },
			{ text: 'Оптические розетки', isCorrect: true }
		]
	},
	{
		id: 'ss5',
		type: 'single',
		text: 'Что означает маркировка SMF на волокне?',
		answers: [
			{ text: 'Многомодовое волокно', isCorrect: false },
			{ text: 'Одномодовое волокно', isCorrect: true },
			{ text: 'Специальное волокно', isCorrect: false },
			{ text: 'Симметричное волокно', isCorrect: false }
		]
	},
	{
		id: 's9',
		type: 'single',
		text: 'Что такое FasTesT в контексте FOT‑930',
		answers: [
			{ text: 'Режим очистки коннекторов', isCorrect: false },
			{
				text: 'Функция автоматического измерения потерь/ORL/длины',
				isCorrect: true
			},
			{ text: 'Тип оптического волокна', isCorrect: false },
			{ text: 'Протокол передачи данных', isCorrect: false }
		]
	},
	{
		id: 'm2',
		type: 'multiple',
		text: 'Какие типы потерь возникают в оптических линиях связи?',
		answers: [
			{ text: 'Потери на поглощение', isCorrect: true },
			{ text: 'Потери на рассеяние', isCorrect: true },
			{ text: 'Потери на отражение', isCorrect: true },
			{ text: 'Потери на проводимость', isCorrect: false }
		]
	},
	{
		id: 'm5',
		type: 'multiple',
		text: 'Какие компоненты входят в комплект оптического тестера FOT‑930?',
		answers: [
			{ text: 'Источник света', isCorrect: true },
			{ text: 'Измеритель мощности', isCorrect: true },
			{ text: 'Модуль ORL', isCorrect: true },
			{ text: 'Рефлектометр', isCorrect: false }
		]
	},
	{
		id: 'm7',
		type: 'multiple',
		text: 'Какие факторы могут привести к ложному срабатыванию VFL?',
		answers: [
			{ text: 'Загрязнение коннектора', isCorrect: true },
			{ text: 'Макроизгиб волокна', isCorrect: true },
			{ text: 'Высокая влажность', isCorrect: false },
			{ text: 'Неправильная длина волны', isCorrect: false }
		]
	},
	// --- Новые вопросы ---
	{
		id: 'nf_s2',
		type: 'single',
		text: 'Какова максимально допустимая величина потерь на одном коннекторном соединении в норме?',
		answers: [
			{ text: '3 дБ', isCorrect: false },
			{ text: '1 дБ', isCorrect: false },
			{ text: '0.3 дБ', isCorrect: true },
			{ text: '0.01 дБ', isCorrect: false }
		]
	},
	{
		id: 'nf_s3',
		type: 'single',
		text: 'Каковы типичные потери на сварном соединении (сплайсе)?',
		answers: [
			{ text: '0.5–1.0 дБ', isCorrect: false },
			{ text: 'менее 0.1 дБ', isCorrect: true },
			{ text: '2–3 дБ', isCorrect: false },
			{ text: '0.3 дБ', isCorrect: false }
		]
	},
	{
		id: 'nf_s4',
		type: 'single',
		text: 'Какой диапазон длин волн охватывает детектор InGaAs в тестере FOT-930?',
		answers: [
			{ text: '400–800 нм', isCorrect: false },
			{ text: '800–1700 нм', isCorrect: true },
			{ text: '1000–2000 нм', isCorrect: false },
			{ text: '600–1200 нм', isCorrect: false }
		]
	},
	{
		id: 'nf_s5',
		type: 'single',
		text: 'Каков диапазон измеряемых оптических мощностей измерителя FOT-930?',
		answers: [
			{ text: 'от 0 дБм до +10 дБм', isCorrect: false },
			{ text: 'от -50 дБм до +10 дБм', isCorrect: true },
			{ text: 'от -100 дБм до 0 дБм', isCorrect: false },
			{ text: 'от -30 дБм до +30 дБм', isCorrect: false }
		]
	},
	{
		id: 'nf_s6',
		type: 'single',
		text: 'При каком минимальном радиусе изгиба волокна начинают значительно возрастать потери на макроизгибах?',
		answers: [
			{ text: '5 мм', isCorrect: false },
			{ text: '15 мм', isCorrect: false },
			{ text: '30–40 мм', isCorrect: true },
			{ text: '100 мм', isCorrect: false }
		]
	},
	{
		id: 'nf_s7',
		type: 'single',
		text: 'Сколько минут рекомендуется прогревать источник FOT-930 перед началом измерений для стабилизации выходной мощности?',
		answers: [
			{ text: '1 минуту', isCorrect: false },
			{ text: '5 минут', isCorrect: true },
			{ text: '15 минут', isCorrect: false },
			{ text: '30 минут', isCorrect: false }
		]
	},
	{
		id: 'nf_s8',
		type: 'single',
		text: 'Какое условие обязательно соблюдать при выполнении обнуления (zeroing) электрических эффектов в FOT-930?',
		answers: [
			{
				text: 'Подключить эталонный патч-корд к порту измерителя',
				isCorrect: false
			},
			{
				text: 'Закрыть все порты защитными крышками, исключив попадание света на детекторы',
				isCorrect: true
			},
			{
				text: 'Нажать кнопку REF непосредственно перед обнулением',
				isCorrect: false
			},
			{ text: 'Выбрать длину волны 1310 нм', isCorrect: false }
		]
	},
	{
		id: 'nf_m2',
		type: 'multiple',
		text: 'Из каких составляющих складываются суммарные оптические потери в волоконно-оптической линии?',
		answers: [
			{ text: 'Рэлеевское рассеяние и поглощение в волокне', isCorrect: true },
			{ text: 'Потери на коннекторных соединениях', isCorrect: true },
			{ text: 'Потери на сварных соединениях (сплайсах)', isCorrect: true },
			{ text: 'Потери мощности в оптическом усилителе EDFA', isCorrect: false }
		]
	},
	{
		id: 'nf_m3',
		type: 'multiple',
		text: 'Какие характеристики отличают многомодовое волокно (MMF) от одномодового (SMF)?',
		answers: [
			{ text: 'Больший диаметр сердцевины (50 или 62.5 мкм)', isCorrect: true },
			{ text: 'Наличие модовой дисперсии', isCorrect: true },
			{
				text: 'Применение преимущественно для коротких дистанций (внутри зданий)',
				isCorrect: true
			},
			{ text: 'Меньшее затухание на длине волны 1550 нм', isCorrect: false }
		]
	},
	{
		id: 'nf_t1',
		type: 'text',
		text: 'Чему равна мощность 0.1 мВт в дБм?',
		validator: (v) => /-10\s*дбм/i.test(v) || /^-\s*10$/.test(v.trim())
	},
	{
		id: 'nf_t2',
		type: 'text',
		text: 'Чему равна мощность 0.001 мВт (1 мкВт) в дБм?',
		validator: (v) => /-30\s*дбм/i.test(v) || /^-\s*30$/.test(v.trim())
	},
	{
		id: 'nf_t3',
		type: 'text',
		text: 'Источник подаёт мощность -3 дБм, измеритель показывает -11 дБм. Чему равны потери линии (в дБ)?',
		validator: (v) => /8\s*дб/i.test(v) || /^8$/.test(v.trim())
	},
	{
		id: 'nf_t4',
		type: 'text',
		text: 'Рассчитайте потери: 0.22 дБ/км на длине 15 км.',
		validator: (v) => /3[.,]3/.test(v)
	},
	{
		id: 'nf_t6',
		type: 'text',
		text: 'Рассчитайте бюджет потерь линии: длина 10 км × 0.35 дБ/км + 2 коннектора × 0.3 дБ. Ответ в дБ.',
		validator: (v) => /4[.,]1/.test(v)
	}
];
