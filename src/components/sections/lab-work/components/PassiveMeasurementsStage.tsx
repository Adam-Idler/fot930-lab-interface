import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
	PassiveComponent,
	ResultsTableState
} from '../../../../types/fot930';

interface PassiveMeasurementsStageProps {
	components: PassiveComponent[];
	selectedComponent: PassiveComponent | null;
	resultsTableState: ResultsTableState;
	canStartNextMeasurement: boolean;
	onSelectComponent: (component: PassiveComponent) => void;
}

export function PassiveMeasurementsStage({
	components,
	selectedComponent,
	resultsTableState,
	canStartNextMeasurement,
	onSelectComponent
}: PassiveMeasurementsStageProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [showLeftFade, setShowLeftFade] = useState(false);
	const [showRightFade, setShowRightFade] = useState(false);

	// Получаем количество выполненных измерений для компонента
	const getMeasurementCountForComponent = (componentId: string) => {
		const table = resultsTableState.tables[componentId];
		if (!table) return 0;
		return table.currentMeasurementNumber > 3
			? 3
			: table.currentMeasurementNumber;
	};

	// Функция для проверки позиции скролла
	const checkScrollPosition = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const { scrollLeft, scrollWidth, clientWidth } = container;

		// Показываем левый градиент если проскроллили вправо
		setShowLeftFade(scrollLeft > 0);

		// Показываем правый градиент если есть контент справа
		setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
	}, []);

	// Проверяем позицию при монтировании и изменении компонентов
	useEffect(() => {
		checkScrollPosition();
	}, [checkScrollPosition]);

	// Добавляем слушатель скролла
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.addEventListener('scroll', checkScrollPosition);
		window.addEventListener('resize', checkScrollPosition);

		return () => {
			container.removeEventListener('scroll', checkScrollPosition);
			window.removeEventListener('resize', checkScrollPosition);
		};
	}, [checkScrollPosition]);

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 2. Выбор пассивного компонента
				</h2>

				<div className="space-y-4">
					<div>
						<div className="text-sm font-medium mb-2">
							Выберите компонент для измерения:
						</div>
						<div className="relative">
							{/* Левый градиент затухания */}
							<div
								className={clsx(
									'absolute left-0 top-0 bottom-2 w-8 bg-linear-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300',
									showLeftFade ? 'opacity-100' : 'opacity-0'
								)}
							/>

							{/* Правый градиент затухания */}
							<div
								className={clsx(
									'absolute right-0 top-0 bottom-2 w-8 bg-linear-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300',
									showRightFade ? 'opacity-100' : 'opacity-0'
								)}
							/>

							{/* Контейнер со скроллом */}
							<div
								ref={scrollContainerRef}
								className="flex gap-3 pb-2 overflow-x-scroll custom-scrollbar"
								style={{
									scrollbarWidth: 'thin',
									scrollbarColor: '#d1d5db transparent'
								}}
							>
								{components.map((component) => {
									const measurementCount = getMeasurementCountForComponent(
										component.id
									);
									const isMeasured = measurementCount >= 3;

									return (
										<button
											type="button"
											key={component.id}
											onClick={() => {
												onSelectComponent(component);
											}}
											className={clsx(
												'p-3 rounded-lg border-2 text-left transition shrink-0',
												selectedComponent?.id === component.id
													? 'border-blue-600 bg-blue-50'
													: isMeasured
														? 'border-green-500 bg-green-50 hover:border-green-600 hover:cursor-pointer'
														: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
											)}
										>
											<div className="font-medium">{component.label}</div>
											<div
												className={clsx(
													'text-xs mt-1 font-medium',
													isMeasured ? 'text-green-600' : 'text-gray-500'
												)}
											>
												{isMeasured
													? 'Измерение выполнено'
													: measurementCount === 0
														? 'Измерение не выполнено'
														: `Выполнено ${measurementCount} из 3 измерений`}
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Индикатор блокировки измерения */}
			{!canStartNextMeasurement && selectedComponent && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-md">
					<div className="flex items-start gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<p className="font-semibold text-yellow-900 text-base">
								Требуется ввод результатов
							</p>
							<p className="text-sm text-yellow-800 mt-1">
								Перед выполнением следующего измерения необходимо внести
								результаты предыдущего измерения в таблицу на вкладке
								"Результаты".
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
