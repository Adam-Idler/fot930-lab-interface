import clsx from 'clsx';
import type { Dispatch, SetStateAction } from 'react';
import { Show } from '../../../lib/components';
import type { ContentType } from './Theory';

interface PaginationProps {
	currentContent: ContentType;
	setCurrentContent: Dispatch<SetStateAction<ContentType>>;
}

const buttonClassName =
	'text-l text-sibguti-main hover:underline hover:cursor-pointer';

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
