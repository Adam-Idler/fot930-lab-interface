import { Show } from '../../../lib/components';

interface ScreenVideoMicroscopeProps {
	connected: boolean;
}

export function ScreenVideoMicroscope({ connected }: ScreenVideoMicroscopeProps) {
	return (
		<div className="flex flex-col w-full h-full p-3">
			<div className="text-lg font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue shrink-0">
				Источник/VFL/Видеомикроскоп
			</div>

			<div className="flex-1 flex items-center justify-center min-h-0 w-full px-1">
				<Show when={connected}>
					<p className="text-sm text-gray-800 text-center">
						Видеомикроскоп подключен
					</p>
				</Show>

				<Show when={!connected}>
					<div className="bg-red-50 border-2 border-red-300 px-4 py-3 text-[11px] text-red-800 rounded-lg shadow-lg max-w-xs text-center">
						<div className="font-semibold text-red-600 mb-1">
							⚠ Видеомикроскоп не подключён
						</div>
						<div className="text-[10px]">
							Необходимо подключить видеомикроскоп к прибору.
						</div>
					</div>
				</Show>
			</div>
		</div>
	);
}
