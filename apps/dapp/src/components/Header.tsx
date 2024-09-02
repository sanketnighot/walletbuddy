import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/walletbuddylogo.png';

export const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className="bg-background-light bg-opacity-80 backdrop-filter backdrop-blur-lg py-4 fixed w-full z-10">
			<div className="container mx-auto px-4">
				<motion.div 
					initial={{ y: -50 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex justify-between items-center"
				>
					<div className="flex items-center">
						<img src={logo} alt="Wallet Buddy Logo" className="h-10 w-10 mr-2" />
						<div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden md:block">Wallet Buddy</div>
					</div>
					<nav className="hidden md:block">
						{[{'title': 'Features', 'href': '#features'}, {'title': 'Roadmap', 'href': '#roadmap'}, {'title': 'Contact', 'href': '#contact'}].map((item) => (
							<a key={item.title} href={item.href} className="mx-2 hover:text-primary transition-colors duration-300 capitalize">
								{item.title}
							</a>
						))}
					</nav>
					<button onClick={toggleMenu} className="md:hidden text-primary">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</motion.div>
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2 }}
							className="md:hidden bg-background-light bg-opacity-90 backdrop-filter backdrop-blur-lg mt-4"
						>
							{[{'title': 'Features', 'href': '#features'}, {'title': 'Roadmap', 'href': '#roadmap'}, {'title': 'Contact', 'href': '#contact'}].map((item) => (
								<a 
									key={item.title} 
									href={item.href} 
									className="block py-2 px-4 hover:bg-primary hover:text-white transition-colors duration-300 capitalize"
									onClick={toggleMenu}
								>
									{item.title}
								</a>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};