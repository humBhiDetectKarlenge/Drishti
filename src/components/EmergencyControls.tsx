export default function EmergencyControls() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-7xl p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-purple-700">
              Emergency Controls
            </h1>
            <p className="text-gray-500 text-lg">
              Critical crowd management and emergency response
            </p>
          </div>
  
          <div className="bg-red-600 text-white rounded-xl p-4 shadow text-center">
            <h2 className="text-xl font-semibold">⚠ Emergency Management Center</h2>
            <p className="text-sm mt-1">
              Use these controls only in emergency situations or when immediate crowd intervention is required.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-red-400 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-red-600 mb-4">Immediate Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition">
                    🚨 Full Evacuation
                  </button>
                  <button className="w-full py-2 bg-yellow-400 text-white font-bold rounded-lg shadow hover:bg-yellow-500 transition">
                    ⛔ Stop All Entry
                  </button>
                  <button className="w-full py-2 bg-yellow-400 text-white font-bold rounded-lg shadow hover:bg-yellow-500 transition">
                    🟫 Open Emergency Exits
                  </button>
                  <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow hover:brightness-110 transition">
                    📢 Broadcast Message
                  </button>
                </div>
              </div>
            </div>
  
            <div className="bg-gray-50 rounded-2xl p-5 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Zone Controls</h3>
              <select className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option>Select Zone</option>
              </select>
              <div className="space-y-3">
                <button className="w-full py-2 bg-yellow-400 text-white font-bold rounded-lg shadow hover:bg-yellow-500 transition">
                  🔒 Close Selected Zone
                </button>
                <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow hover:brightness-110 transition">
                  🔁 Redirect Traffic
                </button>
                <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow hover:brightness-110 transition">
                  📊 Force Recount
                </button>
              </div>
            </div>
  
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Communication</h3>
              <textarea
                placeholder="Emergency message to broadcast..."
                className="w-full h-24 p-3 border border-gray-300 rounded resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <div className="space-y-3">
                <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow hover:brightness-110 transition">
                  📬 Send to Staff
                </button>
                <button className="w-full py-2 bg-yellow-400 text-white font-bold rounded-lg shadow hover:bg-yellow-500 transition">
                  📱 Alert Security
                </button>
                <button className="w-full py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition">
                  🚓 Contact Emergency Services
                </button>
              </div>
            </div>
  
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="text-lg font-bold mb-4">System Status</h3>
              <div className="bg-green-100 text-green-900 rounded-xl p-4 mb-4 border border-green-300">
                <p className="font-semibold">✔ All Systems Operational</p>
                <p className="text-sm mt-1 leading-relaxed">
                  Sensors: Online<br />
                  Communications: Active<br />
                  Emergency Protocols: Ready
                </p>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow hover:brightness-110 transition">
                🔄 System Health Check
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  