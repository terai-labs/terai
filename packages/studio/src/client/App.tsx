import { Routes, Route } from 'react-router'
import { Home } from './pages/Home'

export function App() {
	return (
		<div className='app'>
			<header className='header'>
				<h1 className='logo'>Terai Studio</h1>
			</header>
			<main className='main'>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</main>
		</div>
	)
}
