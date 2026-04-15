
import { Link } from 'react-router-dom'
import '../App.css'

function App() {

  return (
    <>
      <div className='w-full h-screen flex items-center justify-center text-gray-700'>
        <div className='text-center'>
          <h2 className='w-full text-3xl mb-10 font-bold'>Welcome to the Chat Application!</h2>
          <Link to="/chat" className='cursor-pointer px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition'>
            Get Started
          </Link>
          
          <p className='mt-10 text-gray-500 text-xs font-small text-italic max-w-md mx-auto leading-relaxed'>
            Developed by <a href='https://github.com/pabitrabarua123' target='_blank' className='text-blue-500 hover:underline'>Pabitra Barua</a> A hobby project to learn and explore persistent http connection by Web Socket. This application is built using React for the frontend and Node.js with Socket.IO for the backend, enabling seamless real-time chat functionality. Feel free to explore the code, contribute, or reach out if you have any questions or suggestions!
          </p>
        </div>
      </div>
      </>
    )
}

export default App
