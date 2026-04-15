import type React from 'react';

// TODO: Проверить эмодзи на Windows 7. По необходимости заменить иконками
export function IntroductionStage() {
	return (
		<div className="flex flex-col gap-6">
			{/* Общее описание */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-3">
					Лабораторная работа: измерение параметров пассивных оптических
					компонентов
				</h2>
				<p className="text-gray-700 text-sm leading-relaxed">
					В ходе лабораторной работы вы освоите методику измерения затухания
					пассивных компонентов волоконно-оптических линий связи с помощью
					оптического тестера FOT-930. Работа выполняется последовательно по
					трём этапам: подготовка прибора, проведение измерений и анализ
					результатов.
				</p>
			</div>

			{/* Этапы */}
			<div className="flex flex-col gap-4">
				{/* Этап 1 */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-blue-600 text-white px-6 py-3 flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
							1
						</div>
						<h3 className="font-semibold text-base">
							Подготовка оптического тестера к работе
						</h3>
					</div>
					<div className="p-6">
						<p className="text-sm text-gray-600 mb-4">
							Перед проведением измерений необходимо выполнить четыре
							обязательных шага подготовки прибора. Только после их завершения
							прибор будет готов к корректным измерениям.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<StepCard
								number="1"
								title="Включение прибора"
								description="Нажмите кнопку POWER на корпусе прибора. Дождитесь завершения загрузки — прибор перейдёт на главный экран."
							/>
							<StepCard
								number="2"
								title="Очистка оптических портов"
								description="Нажмите кнопку «Очистить порт» в интерфейсе. Появится модальное окно с увеличенным изображением торца коннектора. Его необходимо очистить с помощью курсора мыши. Загрязнения на торцах коннекторов приводят к завышенным потерям и погрешностям измерения."
							/>
							<StepCard
								number="3"
								title="Настройка режима FasTest"
								description={
									<>
										Нажмите <b>MENU</b> на приборе, с помощью клавиш{' '}
										<b>Вверх</b> и <b>Вниз</b> на клавиатуре прибора выберите
										пункт меню <b>Настройка</b>, затем пункт <b>FasTest</b>.
										Выбранная настройка помечается синей рамкой. Чтобы изменить
										значение необходимо нажать <b>Enter</b> на клавиатуре
										прибора. Навигация между настройками FasTest также
										осуществляется с помощью клавиш <b>Вверх</b> и <b>Вниз</b>.
										Параметры, которые необходимо установить указаны в подсказке
										к 3му шагу подготовки.
									</>
								}
							/>
							<StepCard
								number="4"
								title="Измерение опорного значения"
								description={
									<>
										Нажмите <b>FasTest</b> на клавиатуре прибора, выберите тип
										опорного значения <b>«Обрат. петля»</b> (клавиши{' '}
										<b>Вверх</b>/<b>Вниз</b>), затем нажмите <b>F1</b> для
										запуска измерения. По завершении прибор сохранит опорный
										уровень.
									</>
								}
							/>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-lg mt-4 p-4">
							<div className="text-sm text-blue-800">
								Любое взаимодействие с прибором происходит с помощью кликов
								мышью по кнопкам клавиатуры прибора
							</div>
						</div>
					</div>
				</div>

				{/* Этап 2 */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-emerald-600 text-white px-6 py-3 flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
							2
						</div>
						<h3 className="font-semibold text-base">
							Сборка схемы и проведение измерений
						</h3>
					</div>
					<div className="p-6">
						<p className="text-sm text-gray-600 mb-4">
							На этом этапе вы выбираете компонент для измерения, собираете
							правильную схему подключения методом перетаскивания элементов и
							выполняете измерения затухания.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
							<StepCard
								number="1"
								title="Выбор компонента"
								description="Выберите один из доступных пассивных компонентов или комплексный сценарий. По умолчанию выбран первый компонент."
								accentColor="emerald"
							/>
							<StepCard
								number="2"
								title="Сборка схемы"
								description="Перетащите элементы схемы в правильном порядке: Тестер → Коннектор → Компонент → Коннектор → Тестер."
								accentColor="emerald"
							/>
							<StepCard
								number="3"
								title="Измерение"
								description={
									<>
										Находясь на экране FasTest (из 4го шага подготовки) нажмите
										клавишу <b>F2</b> или <b>FasTest</b> для выполнения
										измерения.
									</>
								}
								accentColor="emerald"
							/>
						</div>

						{/* Особенности измерения сплиттеров */}
						<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-3">
							<div className="font-semibold text-emerald-800 text-sm mb-1">
								Измерение сплиттеров
							</div>
							<p className="text-xs text-emerald-700 leading-relaxed">
								Для сплиттеров необходимо измерить <b>каждый выходной порт</b>{' '}
								отдельно. Например, для сплиттера 1:8 выполняется 8 отдельных
								измерений — по одному на каждый выход. Активный выход
								переключается с помощью точек на элементе сплиттера в схеме
								подключения. Измерения считаются завершёнными только после того,
								как измерены все выходы.
							</p>
						</div>
					</div>
				</div>

				{/* Этап 3 */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-violet-600 text-white px-6 py-3 flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
							3
						</div>
						<h3 className="font-semibold text-base">Анализ результатов</h3>
					</div>
					<div className="p-6">
						<p className="text-sm text-gray-600 mb-4">
							После проведения каждого измерения заполняйте таблицу результатов:
							перепишите значения из прибора, рассчитайте средние значения и
							километрическое затухание. По завершении таблицы необходимо
							сделать вывод об исправности компонента.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
							<StepCard
								number="1"
								title="Перенос измерений"
								description="Введите в таблицу три значения затухания (необходимо указывать среднее значение из таблицы результатов прибора), полученные прибором для каждой длины волны (1310 нм и 1550 нм)."
								accentColor="violet"
							/>
							<StepCard
								number="2"
								title="Среднее значение"
								description="Рассчитайте среднее из трёх измерений по формуле: (A1 + A2 + A3) / 3. Введите результат в соответствующую ячейку."
								accentColor="violet"
							/>
							<StepCard
								number="3"
								title="Километрическое затухание"
								description="Для кабельных компонентов длиной более 500 метров рассчитайте затухание на 1 км: A_ср / L, где L — длина волокна в километрах."
								accentColor="violet"
							/>
							<StepCard
								number="4"
								title="Вывод об исправности"
								description="После заполнения таблицы ответьте на вопрос об исправности компонента в программе. Сравните полученные значения затухания с типовыми нормами и сделайте вывод: компонент исправен или неисправен."
								accentColor="violet"
							/>
						</div>

						<div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
							<div className="text-sm text-violet-800">
								Вопрос об исправности появляется автоматически после того, как
								все ячейки таблицы заполнены. Без ответа на этот вопрос
								компонент считается неизмеренным.
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Система оценивания */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="bg-amber-600 text-white px-6 py-3 flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
						★
					</div>
					<h3 className="font-semibold text-base">Система оценивания</h3>
				</div>
				<div className="p-6">
					<p className="text-sm text-gray-600 mb-4">
						В ходе выполнения работы ведётся учёт ошибок. Начальный счёт —{' '}
						<strong>100 баллов</strong>. За каждую ошибку снимается штраф
						(повторные ошибки в одном месте не суммируются). Итоговая оценка
						отображается автоматически после завершения всех измерений.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<div className="text-sm font-semibold text-gray-700 mb-2">
								Штрафы за ошибки
							</div>
							<div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
								<div className="bg-gray-50 px-3 py-2 font-medium text-gray-600 grid grid-cols-[1fr_auto] gap-2">
									<span>Ошибка</span>
									<span className="text-right">Штраф</span>
								</div>
								<div className="divide-y divide-gray-100">
									<div className="px-3 py-2 grid grid-cols-[1fr_auto] gap-2 items-center">
										<span className="text-gray-700">
											Неверный вывод об исправности компонента
										</span>
										<span className="text-red-600 font-semibold text-right whitespace-nowrap">
											−10 б.
										</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[1fr_auto] gap-2 items-center">
										<span className="text-gray-700">
											Ошибка при сборке схемы подключения
										</span>
										<span className="text-red-600 font-semibold text-right whitespace-nowrap">
											−10 б.
										</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[1fr_auto] gap-2 items-center">
										<span className="text-gray-700">
											Неверный расчёт среднего или км. затухания
										</span>
										<span className="text-orange-500 font-semibold text-right whitespace-nowrap">
											−5 б.
										</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[1fr_auto] gap-2 items-center">
										<span className="text-gray-700">
											Неверная запись ожидаемых потерь
										</span>
										<span className="text-orange-500 font-semibold text-right whitespace-nowrap">
											−5 б.
										</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[1fr_auto] gap-2 items-center">
										<span className="text-gray-700">
											Ошибка переноса измерений из прибора
										</span>
										<span className="text-yellow-600 font-semibold text-right whitespace-nowrap">
											−2 б.
										</span>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="text-sm font-semibold text-gray-700 mb-2">
								Критерии оценок
							</div>
							<div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
								<div className="bg-gray-50 px-3 py-2 font-medium text-gray-600 grid grid-cols-[2rem_4rem_1fr] gap-2">
									<span>Оц.</span>
									<span>Баллы</span>
									<span />
								</div>
								<div className="divide-y divide-gray-100">
									<div className="px-3 py-2 grid grid-cols-[2rem_4rem_1fr] gap-2 items-center">
										<span className="font-bold text-green-700 text-base">
											5
										</span>
										<span className="text-gray-700">90–100</span>
										<span className="text-gray-500 text-xs">отлично</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[2rem_4rem_1fr] gap-2 items-center">
										<span className="font-bold text-blue-700 text-base">4</span>
										<span className="text-gray-700">70–89</span>
										<span className="text-gray-500 text-xs">хорошо</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[2rem_4rem_1fr] gap-2 items-center">
										<span className="font-bold text-yellow-600 text-base">
											3
										</span>
										<span className="text-gray-700">55–69</span>
										<span className="text-gray-500 text-xs">
											удовлетворительно
										</span>
									</div>
									<div className="px-3 py-2 grid grid-cols-[2rem_4rem_1fr] gap-2 items-center">
										<span className="font-bold text-red-700 text-base">2</span>
										<span className="text-gray-700">0–54</span>
										<span className="text-gray-500 text-xs">
											неудовлетворительно
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<p className="text-xs text-gray-500 mt-4">
						💡 Итоговые оценки по всем разделам работы можно посмотреть, нажав
						на имя студента в верхней панели программы.
					</p>
				</div>
			</div>

			{/* Требования к отчёту */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="bg-slate-700 text-white px-6 py-3 flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
						✎
					</div>
					<h3 className="font-semibold text-base">Требования к отчёту</h3>
				</div>
				<div className="p-6">
					<p className="text-sm text-gray-600 mb-4">
						Бланк отчёта должен содержать <strong>титульный лист</strong> (по
						форме, принятой в СибГУТИ) с названием выполняемой работы, фамилией
						студента и номером группы. В отчёте должны быть приведены:
					</p>
					<ul className="flex flex-col gap-2">
						{[
							'Цель работы',
							'Фотография / скриншот выполненного теста-допуска с оценкой не ниже 4',
							'Фотография / скриншот выполненного этапа подготовки работы',
							'Фотографии / скриншоты хода выполнения работы',
							'Фотография / скриншот с подтверждением выполненного измерения всех приведённых компонентов и оценкой не ниже 3',
							'Фотография / скриншот выполненного итогового теста с оценкой не ниже 3',
							'Фотография / скриншот экрана с результатами по проделанной работе',
							'Вывод по лабораторной работе'
						].map((item, index) => (
							<li
								key={item}
								className="flex items-start gap-3 text-sm text-gray-700"
							>
								<span className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
									{index + 1}
								</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Нижняя подсказка */}
			<div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
				<p className="text-sm text-gray-600 text-center">
					Для начала работы перейдите на вкладку{' '}
					<span className="font-semibold text-gray-800">«Подготовка»</span> и
					выполните все шаги подготовки прибора
				</p>
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================

interface StepCardProps {
	number: string;
	title: string;
	description: React.ReactNode;
	accentColor?: 'blue' | 'emerald' | 'violet';
}

function StepCard({
	number,
	title,
	description,
	accentColor = 'blue'
}: StepCardProps) {
	const numberColors: Record<string, string> = {
		blue: 'bg-blue-100 text-blue-700',
		emerald: 'bg-emerald-100 text-emerald-700',
		violet: 'bg-violet-100 text-violet-700'
	};

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${numberColors[accentColor]}`}
				>
					{number}
				</div>
				<h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
			</div>
			<div className="text-xs text-gray-600 leading-relaxed">{description}</div>
		</div>
	);
}
