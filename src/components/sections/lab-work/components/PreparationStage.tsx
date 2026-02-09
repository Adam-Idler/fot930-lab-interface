import clsx from 'clsx';
import type { DeviceState } from '../../../../types/fot930';

interface PreparationStageProps {
	deviceState: DeviceState;
	onCleanPorts: () => void;
}

export function PreparationStage({
	deviceState,
	onCleanPorts
}: PreparationStageProps) {
	const { preparation } = deviceState;

	// Проверка завершения каждого шага
	const isStep1Complete = deviceState.isPoweredOn;
	const isStep2Complete = preparation.portStatus === 'clean';
	const isStep3Complete = preparation.fastestSettings.isConfigured;
	const isStep4Complete = preparation.referenceResults.length > 0;

	const isWavelengthsCorrect =
		preparation.fastestSettings.lossWavelengths.includes(1310) &&
		preparation.fastestSettings.lossWavelengths.includes(1550) &&
		!preparation.fastestSettings.lossWavelengths.includes(1625);

	const isAllComplete = preparation.isReadyForMeasurements;

	return (
		<div className="flex flex-col gap-6">
			{/* Заголовок этапа */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 1. Подготовка оптического тестера к работе
				</h2>
				<p className="text-sm text-gray-600">
					Выполните все четыре обязательных шага подготовки прибора перед
					началом измерений
				</p>
			</div>

			{/* Чек-лист подготовки */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<span>Шаги подготовки</span>
				</h3>

				<div className="space-y-4">
					{/* Шаг 1: Включение прибора */}
					<div
						className={clsx(
							'border-2 rounded-lg p-4 transition-all',
							isStep1Complete
								? 'border-green-500 bg-green-50'
								: 'border-gray-300 bg-white'
						)}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									isStep1Complete
										? 'bg-green-500 text-white'
										: 'bg-gray-300 text-gray-700'
								)}
							>
								{isStep1Complete ? '✓' : '1'}
							</div>

							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									Включение прибора
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Нажмите кнопку питания на приборе для его включения
								</p>

								{isStep1Complete ? (
									<div className="bg-green-100 border border-green-300 rounded p-2">
										<div className="text-xs text-green-800">
											✓ Прибор включен и готов к работе
										</div>
									</div>
								) : (
									<div className="text-xs text-blue-600 font-medium">
										→ Нажмите кнопку питания на приборе
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Шаг 2: Очистка портов */}
					<div
						className={clsx(
							'border-2 rounded-lg p-4 transition-all',
							isStep2Complete
								? 'border-green-500 bg-green-50'
								: isStep1Complete
									? 'border-blue-300 bg-blue-50'
									: 'border-gray-300 bg-gray-50 opacity-60'
						)}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									isStep2Complete
										? 'bg-green-500 text-white'
										: isStep1Complete
											? 'bg-blue-500 text-white'
											: 'bg-gray-300 text-gray-700'
								)}
							>
								{isStep2Complete ? '✓' : '2'}
							</div>

							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									Очистка оптических портов
								</h4>
								<p className="text-sm text-gray-600 mb-3">
									Убедитесь, что оптические порты прибора чисты. Грязные порты
									приводят к завышенным значениям потерь.
								</p>

								{!isStep1Complete ? (
									<div className="text-xs text-gray-500 italic">
										Сначала выполните предыдущие шаги
									</div>
								) : isStep2Complete ? (
									<div className="bg-green-100 border border-green-300 rounded p-2">
										<div className="text-xs text-green-800">
											✓ Порты очищены
										</div>
									</div>
								) : (
									<>
										{/* Статус порта */}
										<div className="bg-gray-50 border border-gray-200 rounded p-3">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium">
													Состояние порта:
												</span>
												<div className="flex items-center gap-2">
													<div
														className={clsx('w-3 h-3 rounded-full', {
															'bg-yellow-500 animate-pulse':
																preparation.portStatus === 'cleaning',
															'bg-red-500': preparation.portStatus === 'dirty'
														})}
													/>
													<span
														className={clsx('text-sm font-semibold', {
															'text-yellow-600':
																preparation.portStatus === 'cleaning',
															'text-red-600': preparation.portStatus === 'dirty'
														})}
													>
														{preparation.portStatus === 'cleaning'
															? 'Идёт очистка...'
															: 'Грязный'}
													</span>
												</div>
											</div>

											<button
												type="button"
												onClick={onCleanPorts}
												disabled={preparation.portStatus === 'cleaning'}
												className={clsx(
													'flex w-full gap-2 justify-center items-center font-semibold py-2 px-4 rounded-lg transition-colors',
													preparation.portStatus === 'cleaning'
														? 'bg-yellow-400 text-yellow-900 cursor-not-allowed opacity-70'
														: 'bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer'
												)}
											>
												<img className='h-5' src={preparation.portStatus === 'cleaning' ? '/images/icons/hourglass.svg' : '/images/icons/broomstick.svg'} alt={preparation.portStatus === 'cleaning' ? 'Песочные часы' : 'Метла'} />
												{preparation.portStatus === 'cleaning'
													? 'Очистка...'
													: 'Очистить порт'}
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Шаг 3: Настройка FasTest */}
					<div
						className={clsx(
							'border-2 rounded-lg p-4 transition-all',
							isStep3Complete
								? 'border-green-500 bg-green-50'
								: isStep2Complete && isStep1Complete
									? 'border-blue-300 bg-blue-50'
									: 'border-gray-300 bg-gray-50 opacity-60'
						)}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									isStep3Complete
										? 'bg-green-500 text-white'
										: isStep2Complete && isStep1Complete
											? 'bg-blue-500 text-white'
											: 'bg-gray-300 text-gray-700'
								)}
							>
								{isStep3Complete ? '✓' : '3'}
							</div>

							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									Настройка режима FasTest
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Выполните настройку режима измерений FasTest на приборе
								</p>

								{(!isStep3Complete && !isStep2Complete) || !isStep1Complete ? (
									<div className="text-xs text-gray-500 italic">
										Сначала выполните предыдущие шаги
									</div>
								) : isStep3Complete ? (
									<div className="bg-green-100 border border-green-300 rounded p-2">
										<div className="text-xs text-green-800">
											✓ FasTest настроен правильно
										</div>
									</div>
								) : (
									<>
										<div className="text-xs text-blue-600 font-medium mb-2">
											Нажмите MENU → Setup → FasTest
										</div>
										<div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-gray-700">
											<div className="font-semibold mb-1">
												Требуемые настройки:
											</div>
											<ul className="space-y-1">
												<li className="flex items-center gap-2">
													<span
														className={
															preparation.fastestSettings.portType === 'SM'
																? 'text-green-600'
																: 'text-gray-500'
														}
													>
														{preparation.fastestSettings.portType === 'SM'
															? '✓'
															: '•'}
													</span>
													<span>
														FasTest Port:{' '}
														<span className="font-bold">Single-mode (SM)</span>
													</span>
												</li>
												<li className="flex items-center gap-2">
													<span
														className={
															preparation.fastestSettings.lengthUnit === 'm'
																? 'text-green-600'
																: 'text-gray-500'
														}
													>
														{preparation.fastestSettings.lengthUnit === 'm'
															? '✓'
															: '•'}
													</span>
													<span>
														Length Unit:{' '}
														<span className="font-bold">m (метры)</span>
													</span>
												</li>
												<li className="flex items-center gap-2">
													<span
														className={
															isWavelengthsCorrect
																? 'text-green-600'
																: 'text-gray-500'
														}
													>
														{isWavelengthsCorrect ? '✓' : '•'}
													</span>
													<span>
														Loss Wavelengths: выберите{' '}
														<span className="font-bold">1310 нм</span> и{' '}
														<span className="font-bold">1550 нм</span>
													</span>
												</li>
											</ul>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Шаг 4: Измерение Reference */}
					<div
						className={clsx(
							'border-2 rounded-lg p-4 transition-all',
							isStep4Complete
								? 'border-green-500 bg-green-50'
								: isStep3Complete
									? 'border-blue-300 bg-blue-50'
									: 'border-gray-300 bg-gray-50 opacity-60'
						)}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									isStep4Complete
										? 'bg-green-500 text-white'
										: isStep3Complete
											? 'bg-blue-500 text-white'
											: 'bg-gray-300 text-gray-700'
								)}
							>
								{isStep4Complete ? '✓' : '4'}
							</div>

							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									Измерение опорного значения
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									Выполните измерение опорного значения методом обратной петли
								</p>

								{!isStep3Complete ? (
									<div className="text-xs text-gray-500 italic">
										Сначала выполните предыдущие шаги
									</div>
								) : isStep4Complete ? (
									<div className="bg-green-100 border border-green-300 rounded p-2">
										<div className="text-xs text-green-800">
											✓ Опорные значения измерены
										</div>
									</div>
								) : (
									<>
										<div className="text-xs text-blue-600 font-medium mb-2">
											Нажмите кнопку FasTest, выберите тип измерения, затем F1
										</div>
										<div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-gray-700">
											<div className="font-semibold mb-1">
												Требуемые настройки:
											</div>
											<ul className="space-y-1">
												<li className="flex items-center gap-2">
													<span
														className={
															preparation.referenceType === 'LOOPBACK'
																? 'text-green-600'
																: 'text-gray-500'
														}
													>
														{preparation.referenceType === 'LOOPBACK'
															? '✓'
															: '•'}
													</span>
													<span>
														Тип опор. зн:{' '}
														<span className="font-bold">Обрат. петля</span>
													</span>
												</li>
											</ul>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Итоговый статус */}
			<div
				className={clsx(
					'rounded-lg shadow-md p-6 text-center',
					isAllComplete
						? 'bg-green-50 border-2 border-green-500'
						: 'bg-gray-50 border-2 border-gray-300'
				)}
			>
				{isAllComplete ? (
					<>
						<h3 className="text-xl font-bold text-green-800 mb-2">
							Прибор готов к работе!
						</h3>
						<p className="text-sm text-green-700">
							Все этапы подготовки выполнены. Переходите к сборке схемы и
							измерениям.
						</p>
					</>
				) : (
					<>
						<div className="flex justify-center text-4xl mb-2"><img className="h-8" src="/images/icons/hourglass.svg" alt="Песочные часы" /></div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Подготовка не завершена
						</h3>
						<p className="text-sm text-gray-600">
							Выполните все четыре шага подготовки прибора
						</p>
						<div className="mt-3 text-xs text-gray-500">
							Выполнено:{' '}
							{
								[
									isStep1Complete,
									isStep2Complete,
									isStep3Complete,
									isStep4Complete
								].filter(Boolean).length
							}{' '}
							из 4
						</div>
					</>
				)}
			</div>
		</div>
	);
}
