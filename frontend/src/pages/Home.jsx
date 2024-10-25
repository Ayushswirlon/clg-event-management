// import React, { useState, useEffect, useRef } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { motion } from 'framer-motion';
// import { Calendar, Users, Bell } from 'lucide-react';
// import Header from '../components/Layout/Header';
// import Footer from '../components/Layout/Footer';
// import { Link } from 'react-router-dom';
// import { fetchEvents } from '../api/eventApi';

// const Home = () => {
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [normalScrollEnabled, setNormalScrollEnabled] = useState(false);
//   const heroRef = useRef(null);
//   const contentRef = useRef(null);
//   const { ref: featureRef, inView: featureInView } = useInView({ threshold: 0.3 });
//   const [scrollTextVisible, setScrollTextVisible] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(null);
//   const [upcomingEvents, setUpcomingEvents] = useState([]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const fullHeight = document.documentElement.scrollHeight;
//       const progress = (scrollPosition / (fullHeight - windowHeight)) * 100;
//       setScrollProgress(progress);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     if (featureInView) {
//       setScrollTextVisible(true);
//     }
//   }, [featureInView]);

//   useEffect(() => {
//     const loadEvents = async () => {
//       try {
//         const events = await fetchEvents();
//         setUpcomingEvents(events.slice(0, 3)); // Get the first 3 events
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };
//     loadEvents();
//   }, []);

//   const features = [
//     { title: 'Create Events', icon: Calendar, description: 'Plan and organize events with ease using our intuitive interface.' },
//     { title: 'Manage Registrations', icon: Users, description: 'Keep track of attendees and manage registrations efficiently.' },
//     { title: 'Stay Updated', icon: Bell, description: 'Receive real-time notifications and updates about your events.' },
//   ];

//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       <Header/>
//       {/* Hero Section with Parallax Effect */}
//       <section 
//         ref={heroRef}
//         className="relative h-screen flex items-center justify-center overflow-hidden"
//       >
//         <motion.div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ 
//             backgroundImage: `url('/assets/hero.jpg')`,
//             y: scrollProgress * 0.5
//           }}
//         />
//         <div className="absolute inset-0 bg-blue-600 opacity-50" />
        
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="container mx-auto px-6 relative z-10 text-white text-center"
//         >
//           <h1 className="text-6xl font-extrabold mb-4">
//             College Event Manager
//           </h1>
//           <p className="text-2xl mb-8">
//             Plan, Manage, and Participate in Exciting Campus Events
//           </p>
//           <motion.Link 
//             to="/events" 
//             className="inline-block bg-white text-blue-600 font-bold text-lg py-3 px-8 rounded-full hover:bg-blue-100 transition-colors duration-300"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Explore Events
//           </motion.Link>
//         </motion.div>

//         <motion.div 
//           className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//           animate={{ y: [0, 10, 0] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M12 5v14M19 12l-7 7-7-7"/>
//           </svg>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section ref={featureRef} className="py-24 bg-gray-50 dark:bg-gray-800">
//         <div className="container mx-auto px-6">
//           <motion.h2 
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: scrollTextVisible ? 1 : 0, x: scrollTextVisible ? 0 : -100 }}
//             transition={{ duration: 1 }}
//             className="text-4xl font-bold text-center mb-12"
//           >
//             Our Features
//           </motion.h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             {features.map((feature, index) => (
//               <motion.div 
//                 key={index}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: scrollTextVisible ? 1 : 0, y: scrollTextVisible ? 0 : 50 }}
//                 transition={{ duration: 0.5, delay: index * 0.2 }}
//                 className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 cursor-pointer"
//                 whileHover={{ scale: 1.05 }}
//                 onMouseEnter={() => setActiveFeature(index)}
//                 onMouseLeave={() => setActiveFeature(null)}
//               >
//                 <feature.icon className={`w-12 h-12 mb-4 ${activeFeature === index ? 'text-blue-500' : 'text-gray-500'}`} />
//                 <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Upcoming Events Section with Parallax Effect */}
//       <section className="py-24 bg-cover bg-fixed relative" style={{ backgroundImage: `url('/assets/hero.jpg')` }}>
//         <div className="absolute inset-0 bg-black opacity-50" />
//         <div className="container mx-auto text-center text-white relative z-10">
//           <h3 className="text-3xl font-extrabold mb-6">Upcoming Events</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {upcomingEvents.map((event, index) => (
//               <motion.div 
//                 key={event._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.2 }}
//                 className="bg-blue-600 bg-opacity-75 shadow-lg rounded-lg overflow-hidden"
//               >
//                 <img src={event.image || '/assets/default-event.jpg'} alt={event.title} className="w-full h-48 object-cover" />
//                 <div className="p-6">
//                   <h4 className="text-xl font-semibold">{event.title}</h4>
//                   <p className="mt-2 text-sm">{new Date(event.date).toLocaleDateString()}</p>
//                   <motion.Link 
//                     to={`/events/${event._id}`} 
//                     className="mt-4 inline-block bg-white hover:bg-gray-200 text-blue-600 font-bold py-2 px-4 rounded transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Learn More
//                   </motion.Link>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Scroll Progress Indicator */}
//       <motion.div 
//         className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
//         style={{ scaleX: scrollProgress / 100 }}
//       />
//     </div>
//   );
// };

// export default Home;