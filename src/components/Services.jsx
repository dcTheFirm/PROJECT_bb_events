import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChefHat, Award, Calendar, GlassWater, Coffee } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { supabase } from '../lib/supabaseClient';

const services = [
	{
		title: 'Private Events',
		description:
			'Full-service bar setup for private parties, birthdays, and intimate gatherings.',
		icon: GlassWater,
		color: 'from-gold to-amber',
		features: ['Professional staff', 'Quality ingredients', 'Custom menus'],
	},
	{
		title: 'Corporate Events',
		description:
			'Professional bartending services for corporate functions and business gatherings.',
		icon: Coffee,
		color: 'from-purple to-deep-purple',

		features: [
			'Branded cocktail experiences',
			'Efficient large-group service',
			'Flexible setup for formal settings',
		],
	},
	{
		title: 'Weddings',
		description:
			'Customized bar services to match your special day, including signature cocktails.',
		icon: Calendar,
		color: 'from-burgundy to-purple',
		features: [
			'Signature couple\'s cocktails',
			'Themed decor coordination',
			'Experienced wedding bartenders',
		],
	},
	{
		title: 'Cocktail Workshops',
		description:
			'Interactive mixology classes and cocktail-making workshops for groups.',
		icon: ChefHat,
		color: 'from-amber to-whiskey',
		features: [
			'Interactive classes',
			'Group activities',
			'Professional mixologists',
		],
	},
	{
		title: 'Brightwood Institute',
		description:
			'We also offers coaching and training services through our partnership with Brightwood Institute.',
		icon: Award,
		color: 'from-deep-purple to-purple',
		features: [
			'Coaching & training',
			'Industry certification',
			'Expert instructors',
		],
	},
];

function Services() {
	const [servicesImage, setServicesImage] = useState({});

	useEffect(() => {
		async function fetchImage() {
			const { data, error } = await supabase
				.from('home-images') // <-- FIXED table name
				.select('url,position')
				.eq('section', 'services')
				.eq('position', 1)
				.limit(1);
			if (error) {
				console.error('Supabase fetch error:', error.message);
			}
			const imgMap = {};
			(data || []).forEach((img) => {
				imgMap[img.position] = img.url;
			});
			setServicesImage(imgMap);
			console.log('Services image by position:', imgMap);
		}
		fetchImage();
	}, []);

	return (
		<motion.section
			id="services"
			className="services py-24 bg-dark relative"
			initial={{ opacity: 0, y: 60 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: 'easeOut' }}
			viewport={{ once: true }}
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-14">
					<h2 className="text-3xl md:text-5xl font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-lg mb-2">
						<span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
							Our
						</span>
						<span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
							Services
						</span>
					</h2>
					<div className="flex justify-center">
						<div className="h-1 w-24 bg-gradient-to-r from-gold via-amber-300 to-gold rounded-full opacity-70 mb-4"></div>
					</div>
					<p className="text-gray-400 text-lg mt-2">
						Exceptional mixology services tailored to your needs
					</p>
				</div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						hidden: {},
						visible: {
							transition: { staggerChildren: 0.13 },
						},
					}}
				>
					{services.slice(0, 3).map((service, idx) => (
						<motion.div
							key={service.title}
							variants={{
								hidden: { opacity: 0, y: 30 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.6, type: 'spring' },
								},
							}}
							className="relative group bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center glass-effect hover:border-gold/60 transition-all duration-300 hover:shadow-[0_4px_32px_0_rgba(255,215,0,0.08)]"
						>
							<div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-gold to-amber-400 shadow-lg border-2 border-gold/30">
								<service.icon size={32} className="text-black/80" />
							</div>
							<h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2 font-['Playfair_Display'] text-center">
								{service.title}
							</h3>
							<p className="text-gray-400 text-base mb-6 text-center">
								{service.description}
							</p>
							<ul className="feature-list space-y-2 w-full">
								{service.features.map((feature) => (
									<li key={feature} className="flex items-center text-white/70">
										<Check size={18} className="text-gold mr-2" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-gold/40 transition-all duration-300"></div>
						</motion.div>
					))}
				</motion.div>

				{/* Last two cards in a row below */}
				<div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
					{services.slice(3, 5).map((service, idx) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, type: 'spring', delay: 0.1 * idx }}
							viewport={{ once: true }}
							className="relative group bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center glass-effect hover:border-gold/60 transition-all duration-300 hover:shadow-[0_4px_32px_0_rgba(255,215,0,0.08)] w-full md:max-w-md"
						>
							<div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-gold to-amber-400 shadow-lg border-2 border-gold/30">
								<service.icon size={32} className="text-black/80" />
							</div>
							<h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2 font-['Playfair_Display'] text-center">
								{service.title}
							</h3>
							<p className="text-gray-400 text-base mb-6 text-center">
								{service.description}
							</p>
							<ul className="feature-list space-y-2 w-full">
								{service.features.map((feature) => (
									<li key={feature} className="flex items-center text-white/70">
										<Check size={18} className="text-gold mr-2" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-gold/40 transition-all duration-300"></div>
						</motion.div>
					))}
				</div>

				{/* Feature callout */}
				<motion.div
					className="callout mt-20 glass-effect rounded-2xl p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-black/90 to-black/70 border border-white/10"
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
				>
					<div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl"></div>
					<div className="absolute left-1/2 top-0 w-32 h-32 rounded-full bg-purple/10 blur-3xl"></div>

					<div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
						<div>
							<h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
								<span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
									Compl
								</span>
								<span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
									ete Event Experience
								</span>
							</h2>
							<p className="text-white/70 mb-6">
								Beyond bartending, we provide a complete solution for your
								event's beverage needs. From initial consultation to final
								service, we handle every aspect with professional care.
							</p>
							<ul className="feature-grid grid grid-cols-2 gap-4">
								{[
									'Bar Setup & Breakdown',
									'Custom Drink Menus',
									'Professional Bartenders',
									'Premium Glassware',
									'Specialty Ice',
									'Garnishes & Ingredients',
								].map((item) => (
									<li key={item} className="flex items-center text-white/60">
										<Check size={18} className="text-gold mr-2" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="relative aspect-video overflow-hidden rounded-xl">
							{/* position 1 */}
							<img
								src={servicesImage[1] || ''}
								alt="Full bar setup"
								className="w-full h-full object-cover object-center"
								loading="lazy"
							/>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.section>
	);
}



export default Services;
