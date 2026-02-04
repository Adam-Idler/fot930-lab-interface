import clsx from 'clsx';
import type {
	CompletedMeasurement,
	PassiveComponent
} from '../../../../types/fot930';

interface PassiveMeasurementsStageProps {
	components: PassiveComponent[];
	selectedComponent: PassiveComponent | null;
	measurements: CompletedMeasurement[];
	onSelectComponent: (component: PassiveComponent) => void;
	onResetAttempts: () => void;
}

export function PassiveMeasurementsStage({
	components,
	selectedComponent,
	measurements,
	onSelectComponent,
	onResetAttempts
}: PassiveMeasurementsStageProps) {
	// Проверяем, было ли выполнено хотя бы одно измерение для компонента
	const hasMeasurement = (componentId: string): boolean => {
		return measurements.some((m) => m.componentId === componentId);
	};

 
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
							{components.map((component) => {
								const isMeasured = hasMeasurement(component.id);
								return (
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
												: 'Измерение не выполнено'}
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
