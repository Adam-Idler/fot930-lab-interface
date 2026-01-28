import clsx from 'clsx';
import type { PassiveComponent } from '../../../../types/fot930';

interface PassiveMeasurementsStageProps {
	components: PassiveComponent[];
	selectedComponent: PassiveComponent | null;
	onSelectComponent: (component: PassiveComponent) => void;
	currentSide: 'A' | 'B';
	onChangeSide: (side: 'A' | 'B') => void;
	attemptCount: number;
	onResetAttempts: () => void;
}

// TODO: Поменять вывод типа компонента на что-то другое, либо убрать
export function PassiveMeasurementsStage({
	components,
	selectedComponent,
	onSelectComponent,
	currentSide,
	onChangeSide,
	attemptCount,
	onResetAttempts
}: PassiveMeasurementsStageProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 2. Измерение пассивных компонентов
				</h2>

				<div className="space-y-4">
					<div>
						<div className="text-sm font-medium mb-2">
							Выберите компонент для измерения:
						</div>
						<div className="grid grid-cols-1 gap-2">
							{components.map((component) => (
								<button
									type="button"
									key={component.id}
									onClick={() => {
										onSelectComponent(component);
										onResetAttempts();
									}}
									className={clsx(
										'p-3 rounded-lg border-2 text-left transition',
										selectedComponent?.id === component.id
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
									)}
								>
									<div className="font-medium">{component.label}</div>
									<div className="text-xs text-gray-500 mt-1">
										Тип: {component.type.replace(/_/g, ' ')}
									</div>
								</button>
							))}
						</div>
					</div>

					<div>
						<div className="text-sm font-medium mb-2">Сторона измерения:</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => {
									onChangeSide('A');
									onResetAttempts();
								}}
								className={clsx(
									'flex-1 py-2 rounded-lg border-2 font-medium transition',
									currentSide === 'A'
										? 'border-blue-600 bg-blue-50 text-blue-900'
										: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
								)}
							>
								Сторона A
							</button>
							<button
								type="button"
								onClick={() => {
									onChangeSide('B');
									onResetAttempts();
								}}
								className={clsx(
									'flex-1 py-2 rounded-lg border-2 font-medium transition',
									currentSide === 'B'
										? 'border-blue-600 bg-blue-50 text-blue-900'
										: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
								)}
							>
								Сторона B
							</button>
						</div>
					</div>

					<div className="bg-gray-50 p-3 rounded">
						<div className="text-sm">
							<span className="font-medium">Текущая попытка:</span>{' '}
							{attemptCount} из 3
						</div>
						{attemptCount === 3 && (
							<div className="mt-2 text-xs text-gray-600">
								Выполнены все 3 измерения. Выберите другую сторону или
								компонент.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
