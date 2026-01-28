/**
 * Главный компонент прибора FOT-930
 * Объединяет экран и клавиатуру в визуализацию корпуса прибора
 */

import { useEffect, useReducer } from 'react';
import {
	deviceReducer,
	initialDeviceState
} from '../../lib/fot930/deviceReducer';
import { noop } from '../../lib/utils';
import type { DeviceButton as DeviceButtonType } from '../../types/fot930';
import { DeviceScreen } from './DeviceScreen';
import { DeviceButton } from './device/DeviceButton';

interface DeviceProps {
	/** Callback для запуска измерения (возвращает промис с результатом) */
	onMeasure?: () => Promise<
		{ value: number; unit: 'dBm' | 'dB' } | { error: string }
	>;
}

export function Device({ onMeasure }: DeviceProps) {
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

	// Обработка измерения
	useEffect(() => {
		if (state.screen === 'MEASURING' && onMeasure) {
			const performMeasurement = async () => {
				try {
					const result = await onMeasure();

					if ('error' in result) {
						dispatch({
							type: 'MEASUREMENT_ERROR',
							payload: result.error
						});
					} else {
						dispatch({
							type: 'COMPLETE_MEASUREMENT',
							payload: {
								value: result.value,
								unit: result.unit,
								mode: state.mode!,
								wavelength: state.wavelength!,
								timestamp: Date.now()
							}
						});
					}
				} catch (error) {
					console.error('Measurement error:', error);
					dispatch({
						type: 'MEASUREMENT_ERROR',
						payload: 'Measurement failed'
					});
				}
			};

			const timer = setTimeout(performMeasurement, 1500);
			return () => clearTimeout(timer);
		}
	}, [state.screen, onMeasure, state.mode, state.wavelength]);

	const handleButtonPress = (button: DeviceButtonType) => {
		const actionMap: Record<DeviceButtonType, () => void> = {
			POWER: () => dispatch({ type: 'PRESS_POWER' }),
			MENU: () => dispatch({ type: 'PRESS_MENU' }),
			UP: () => dispatch({ type: 'PRESS_UP' }),
			DOWN: () => dispatch({ type: 'PRESS_DOWN' }),
			ENTER: () => dispatch({ type: 'PRESS_ENTER' }),
			BACK: () => dispatch({ type: 'PRESS_BACK' }),
			MEASURE: () => dispatch({ type: 'PRESS_MEASURE' })
		};

		actionMap[button]?.();
	};

	return (
		<div className="flex flex-col gap-4 max-w-2xl mx-auto">
			<div className="bg-[#3B7AB5] p-8 rounded-3xl">
				{/* Основная область */}
				<div className="bg-gray-900 rounded-2xl p-4 shadow-inner">
					{/* LCD Экран */}
					<div className="aspect-4/3 mb-6 overflow-hidden shadow-xl">
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
							<DeviceButton label="F1" onClick={noop} />
							<DeviceButton label="F2" onClick={noop} />
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
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-6 hover:cursor-pointer bg-[#3B7AB5] hover:bg-[#31628f] active:bg-[#22496d] rounded-full flex items-center justify-center text-white font-bold text-sm transition shadow-lg"
								>
									Enter
								</button>
							</div>
						</div>

						<div className="rotate-90 absolute top-2/3 left-0">
							<DeviceButton label="FasTest" onClick={noop} />
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
								color="light-blue"
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
						<div className="absolute bottom-4 right-6 flex flex-col items-end gap-1">
							<span className="text-sm text-white/40 font-medium">Active</span>
							<div
								className={`w-3 h-3 border border-gray-900 transition-all ${
									state.isPoweredOn
										? 'bg-green-500 shadow-lg shadow-green-400/50'
										: 'bg-gray-700'
								}`}
							/>
						</div>
					</div>

					<div className="bg-[#3B7AB5] -mx-4 -mb-4">
						<div className="mx-auto w-4/5 rounded-b-md mt-8  border-12 border-t-0 border-gray-900">
							<div className="flex justify-between items-center p-2 bg-[#dfdcdd] text-[#3B7AB5]">
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
