import { useState } from 'react';
import { getRandomElements } from '../../../lib/utils';
import { Test } from '../../test/Test';
import { shuffleQuestionsAnswers } from '../../test/utils';
import { questions } from './questions-bank';

function pickQuestions() {
	return shuffleQuestionsAnswers(getRandomElements(questions, 20));
}

export function FinalTest() {
	const [testQuestions, setTestQuestions] = useState(pickQuestions);

	return (
		<div className="flex flex-col justify-center h-full">
			<Test
				testID="finalTest"
				questions={testQuestions}
				onRestart={() => setTestQuestions(pickQuestions())}
			/>
		</div>
	);
}
