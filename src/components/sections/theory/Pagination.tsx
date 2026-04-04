import clsx from 'clsx';
import { Show } from '../../../lib/components';
import type { ContentType } from './Theory';

interface PaginationProps {
	currentContent: ContentType;
	setCurrentContent: (content: ContentType) => void;
}

const buttonClassName =
	'text-sm font-medium text-sibguti-main px-4 py-1.5 rounded border border-sibguti-main/30 bg-sibguti-main/5 hover:bg-sibguti-main/10 hover:border-sibguti-main/50 transition-colors cursor-pointer';

export function Pagination({
	currentContent,
	setCurrentContent
}: PaginationProps) {
	return (
		<div className="flex justify-between">
			<Show when={currentContent === 'instruction'}>
				<button
					type="button"
					onClick={() => setCurrentContent('theory')}
					className={clsx('mr-auto', buttonClassName)}
				>
					{'<'} Теория
				</button>
			</Show>

			<Show when={currentContent === 'theory'}>
				<button
					type="button"
					onClick={() => setCurrentContent('instruction')}
					className={clsx('ml-auto', buttonClassName)}
				>
					Инструкция {'>'}
				</button>
			</Show>
		</div>
	);
}
