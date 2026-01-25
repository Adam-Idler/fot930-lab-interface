import {
	RegistrationForm,
	useRegistration
} from './components/registration-form';
import { Layout } from './Layout';

export function App() {
	const { isRegistered } = useRegistration();

	if (!isRegistered) {
		return <RegistrationForm />;
	}

	return <Layout />;
}
