/**
 * Главный компонент прибора FOT-930
 * Объединяет экран и клавиатуру в визуализацию корпуса прибора
 */

import { useEffect, useReducer } from 'react';
import {
	deviceReducer,
	initialDeviceState
} from '../../lib/fot930/deviceReducer';
import {
	generateFiberMeasurement,
	generateReferenceMeasurement
} from '../../lib/fot930/measurementEngine';
import { noop } from '../../lib/utils';
import type {
	DeviceAction,
	DeviceButton as DeviceButtonType,
	DeviceState,
	PassiveComponent
} from '../../types/fot930';
import { DeviceScreen } from './DeviceScreen';
import { DeviceButton } from './device/DeviceButton';

interface DeviceProps {
	/** Callback для передачи состояния прибора */
	onDeviceStateChange?: (state: DeviceState) => void;
	/** Функция для получения dispatch (для внешних действий) */
	onDispatchReady?: (dispatch: React.Dispatch<DeviceAction>) => void;
	/** Выбранный компонент для измерений */
	selectedComponent?: PassiveComponent | null;
}

export function Device({
	onDeviceStateChange,
	onDispatchReady,
	selectedComponent
}: DeviceProps) {
	const [state, dispatch] = useReducer(deviceReducer, initialDeviceState);

	// Автоматическое завершение загрузки
	useEffect(() => {
		if (state.screen === 'LOADING') {
			const timer = setTimeout(() => {
				dispatch({ type: 'COMPLETE_LOADING' });
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [state.screen]);

	// Передача dispatch наружу (один раз при монтировании)
	useEffect(() => {
		onDispatchReady?.(dispatch);
	}, [onDispatchReady]);

	// Передача состояния прибора наружу
	useEffect(() => {
		onDeviceStateChange?.(state);
	}, [state, onDeviceStateChange]);

	// Обработка измерения Reference
	useEffect(() => {
		if (
			state.screen === 'FASTEST_MEASURING' &&
			state.currentMeasurementType === 'REFERENCE'
		) {
			const performReferenceMeasurement = async () => {
				// Генерируем стабильные опорные значения с учетом состояния портов
				const measurements = generateReferenceMeasurement(
					state.preparation.fastestSettings.lossWavelengths,
					state.preparation.portStatus,
					state.preparation.referenceResults.length > 0
						? state.preparation.referenceResults
						: undefined
				);

				// Добавляем timestamp к каждому измерению
				const referenceResults = measurements.map((m) => ({
					...m,
					timestamp: Date.now()
				}));

				dispatch({
					type: 'COMPLETE_REFERENCE_MEASUREMENT',
					payload: referenceResults
				});
			};

			const timer = setTimeout(performReferenceMeasurement, 3000);
			return () => clearTimeout(timer);
		}
	}, [state.screen, state.currentMeasurementType, state.preparation]);

	// Обработка измерения Fiber
	useEffect(() => {
		if (
			state.screen === 'FASTEST_MEASURING' &&
			state.currentMeasurementType === 'FIBER' &&
			selectedComponent
		) {
			const performFiberMeasurement = async () => {
				// Проверяем, есть ли предыдущее измерение для этого компонента
				const previousResult =
					state.fiberMeasurementsHistory[selectedComponent.id];

				// Генерируем двунаправленное измерение с кешированием
				const result = generateFiberMeasurement(
					selectedComponent,
					state.preparation.fastestSettings.lossWavelengths,
					state.fiberCounter,
					previousResult
				);

				if ('error' in result) {
					// Ошибка - возврат на FASTEST_MAIN
					dispatch({ type: 'PRESS_BACK' });
					return;
				}

				dispatch({
					type: 'COMPLETE_FIBER_MEASUREMENT',
					payload: result
				});
			};

			const timer = setTimeout(performFiberMeasurement, 3000);
			return () => clearTimeout(timer);
		}
	}, [
		state.screen,
		state.currentMeasurementType,
		state.preparation,
		selectedComponent,
		state.fiberCounter,
		state.fiberMeasurementsHistory
	]);

	const handleButtonPress = (button: DeviceButtonType) => {
		const actionMap: Record<DeviceButtonType, () => void> = {
			POWER: () => dispatch({ type: 'PRESS_POWER' }),
			MENU: () => dispatch({ type: 'PRESS_MENU' }),
			UP: () => dispatch({ type: 'PRESS_UP' }),
			DOWN: () => dispatch({ type: 'PRESS_DOWN' }),
			ENTER: () => dispatch({ type: 'PRESS_ENTER' }),
			BACK: () => dispatch({ type: 'PRESS_BACK' }),
			FASTEST: () => dispatch({ type: 'PRESS_FASTEST' }),
			F1: () => dispatch({ type: 'PRESS_F1' }),
			F2: () => dispatch({ type: 'PRESS_F2' })
		};

		actionMap[button]?.();
	};

	return (
		<div className="flex flex-col gap-4 min-w-xl max-w-xl mx-auto">
			<div className="bg-fot930-blue p-8 rounded-3xl">
				{/* Основная область */}
				<div className="bg-gray-900 rounded-2xl p-4 shadow-inner">
					{/* Экран */}
					<div className="aspect-16/10 mb-6 overflow-hidden shadow-xl">
						<DeviceScreen state={state} />
					</div>

					{/* Панель управления */}
					<div className="relative border-2 border-t-0 p-4 pt-0 rounded-b-md border-gray-700">
						{/* Верхний ряд функциональных кнопок */}
						<div className="grid grid-cols-4 gap-2 pb-4">
							<DeviceButton
								icon={
									<img
										src="/images/icons/arrow-left.svg"
										width={20}
										alt="Arrow left"
									/>
								}
								onClick={noop}
							/>
							<DeviceButton
								label="F1"
								onClick={() => handleButtonPress('F1')}
							/>
							<DeviceButton
								label="F2"
								onClick={() => handleButtonPress('F2')}
							/>
							<DeviceButton
								icon={
									<img
										src="/images/icons/arrow-right.svg"
										width={20}
										alt="Arrow Right"
									/>
								}
								onClick={noop}
							/>
						</div>

						<div className="flex justify-between border-t-2 border-gray-700 pt-4 pb-2">
							<DeviceButton
								label="Esc"
								onClick={() => handleButtonPress('BACK')}
							/>
							<DeviceButton
								label="Menu"
								onClick={() => handleButtonPress('MENU')}
							/>
						</div>

						{/* Навигационный джойстик (центральная часть) */}
						<div className="flex justify-center mb-10">
							<div className="relative w-36 h-36 bg-gray-800 rounded-full">
								{/* UP */}
								<button
									type="button"
									onClick={() => handleButtonPress('UP')}
									className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-6 hover:cursor-pointer bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white text-xl transition shadow-md"
								>
									<img
										src="/images/icons/triangle-filled-up.svg"
										width={20}
										alt="Triangle up"
									/>
								</button>

								{/* RIGHT */}
								<button
									type="button"
									onClick={noop}
									className="absolute top-1/2 right-2 -translate-y-1/2 w-6 h-12 hover:cursor-pointer bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white text-xl transition shadow-md"
								>
									<img
										src="/images/icons/triangle-filled-right.svg"
										width={20}
										alt="Triangle up"
									/>
								</button>

								{/* DOWN */}
								<button
									type="button"
									onClick={() => handleButtonPress('DOWN')}
									className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-6 hover:cursor-pointer bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white text-xl transition shadow-md"
								>
									<img
										src="/images/icons/triangle-filled-down.svg"
										width={20}
										alt="Triangle down"
									/>
								</button>

								{/* LEFT */}
								<button
									type="button"
									onClick={noop}
									className="absolute top-1/2 left-2 -translate-y-1/2 w-6 h-12 hover:cursor-pointer bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white text-xl transition shadow-md"
								>
									<img
										src="/images/icons/triangle-filled-left.svg"
										width={20}
										alt="Triangle up"
									/>
								</button>

								{/* CENTER (ENTER) */}
								<button
									type="button"
									onClick={() => handleButtonPress('ENTER')}
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-6 hover:cursor-pointer bg-fot930-blue hover:bg-fot930-blue-hover active:bg-fot930-blue-active rounded-full flex items-center justify-center text-white font-bold text-sm transition shadow-lg"
								>
									Enter
								</button>
							</div>
						</div>

						<div className="rotate-90 absolute top-2/3 left-0">
							<DeviceButton
								label="FasTest"
								onClick={() => handleButtonPress('FASTEST')}
							/>
						</div>

						<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 bg-gray-900">
							<DeviceButton
								icon={<img src="/images/icons/sun.svg" width={20} alt="Sun" />}
								color="beige"
								onClick={noop}
							/>
							<DeviceButton
								icon={
									<img
										src="/images/icons/power-button.svg"
										width={20}
										alt="Power Button"
									/>
								}
								onClick={() => handleButtonPress('POWER')}
							/>
							<DeviceButton
								icon={
									<img
										src="/images/icons/question.svg"
										width={20}
										alt="Question"
									/>
								}
								color="beige"
								onClick={noop}
							/>
						</div>

						{/* Индикатор питания на корпусе */}
						<div className="absolute bottom-4 right-6 flex flex-col items-end gap-1 cursor-default">
							<span className="text-sm text-white/40 font-medium">Active</span>
							<div
								className={`w-3 h-3 border border-gray-900 transition-all ${
									state.screen === 'FASTEST_MEASURING'
										? 'bg-red-500 animate-pulse-red'
										: state.isPoweredOn
											? 'bg-green-500 shadow-lg shadow-green-400/50'
											: 'bg-gray-700'
								}`}
							/>
						</div>
					</div>

					<div className="bg-fot930-blue -mx-4 -mb-4 cursor-default">
						<div className="mx-auto w-4/5 rounded-b-md mt-8  border-12 border-t-0 border-gray-900">
							<div className="flex justify-between items-center p-2 bg-[#dfdcdd] text-fot930-blue">
								<div>
									<div className="text-2xl font-extrabold tracking-wider">
										EXFO
									</div>
									<div className="text-sm italic font-semibold">
										Multifunction Loss Tester
									</div>
								</div>

								<div>
									<div className="text-md font-bold">FOT-930</div>
									<div className="text-sm italic font-semibold">
										MaxTester II
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
