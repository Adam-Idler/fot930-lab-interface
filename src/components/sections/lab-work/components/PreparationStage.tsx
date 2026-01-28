import clsx from 'clsx';
import { useState } from 'react';

type PortStatus = 'clean' | 'cleaning' | 'dirty';

export function PreparationStage() {
	const [portStatus, setPortStatus] = useState<PortStatus>('dirty');

	const isPortClean = portStatus === 'clean';

	function handlePortCleaning() {
		setPortStatus('cleaning');
		setTimeout(() => {
			setPortStatus('clean');
		}, 3000);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
				<h2 className="text-xl font-semibold">Этап 1. Подготовка прибора</h2>

				<div className="space-y-3 text-sm">
					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							1
						</span>
						<p>Убедитесь, что оптический порт прибора чист</p>
					</div>

					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							2
						</span>
						<p>
							Нажмите кнопку <strong>POWER</strong> для включения прибора
						</p>
					</div>

					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							3
						</span>
						<p>
							После загрузки нажмите <strong>MENU</strong> для входа в меню
						</p>
					</div>

					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							4
						</span>
						<p>
							Используйте кнопки <strong>UP/DOWN</strong> для выбора режима
							измерения (POWER или LOSS)
						</p>
					</div>

					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							5
						</span>
						<p>
							Нажмите <strong>ENTER</strong> для подтверждения
						</p>
					</div>

					<div className="flex items-start gap-2">
						<span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
							6
						</span>
						<p>
							Выберите длину волны (850, 1300, 1310 или 1550 нм) и подтвердите
							выбор
						</p>
					</div>
				</div>
			</div>

			{/* Статус чистоты порта */}
			<div className="bg-gray-50 border rounded-lg p-4">
				<h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
					<span className="text-lg">🔌</span>
					Статус оптического порта
				</h3>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Состояние:</span>
						<div className="flex items-center gap-2">
							<div
								className={clsx('w-3 h-3 rounded-full', {
									'bg-yellow-500': portStatus === 'cleaning',
									'bg-green-500': isPortClean,
									'bg-red-500': !isPortClean && portStatus !== 'cleaning'
								})}
							/>
							<span
								className={clsx('text-sm font-semibold', {
									'text-yellow-600': portStatus === 'cleaning',
									'text-green-600': isPortClean,
									'text-red-600': !isPortClean && portStatus !== 'cleaning'
								})}
							>
								{portStatus === 'cleaning'
									? 'Идёт очистка...'
									: isPortClean
										? 'Чистый'
										: 'Грязный'}
							</span>
						</div>
					</div>

					{!isPortClean && (
						<div className="pt-2">
							<button
								type="button"
								onClick={handlePortCleaning}
								disabled={portStatus === 'cleaning'}
								className={clsx(
									'w-full font-semibold py-2 px-4 rounded-lg transition-colors',
									portStatus === 'cleaning'
										? 'bg-yellow-400 text-yellow-900 cursor-not-allowed opacity-70'
										: 'bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer'
								)}
							>
								{portStatus === 'cleaning'
									? '⏳ Очистка...'
									: '🧹 Очистить порт'}
							</button>

							{portStatus !== 'cleaning' && (
								<p className="text-xs text-gray-500 mt-1 text-center">
									Нажмите для запуска процедуры очистки оптического порта
								</p>
							)}
						</div>
					)}

					{isPortClean && (
						<div className="bg-green-50 border border-green-200 rounded p-2">
							<p className="text-xs text-green-700 text-center">
								✅ Порт готов к работе
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
