export default function ZoneManagement() {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-6xl p-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-1">
            Zone Management
            <span className="text-gray-500 text-base font-normal ml-2">
              Configure and monitor individual zones
            </span>
          </h1>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 rounded-2xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Zone Capacity Settings</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Main Entrance</label>
                <input type="range" className="w-full" defaultValue={1500} max={2000} />
                <p className="text-sm text-gray-500">1,500 people</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Food Court</label>
                <input type="range" className="w-full" defaultValue={1200} max={2000} />
                <p className="text-sm text-gray-500">1,200 people</p>
              </div>
              <div>
                <label className="block text-gray-700">Exhibition Hall</label>
                <input type="range" className="w-full" defaultValue={800} max={2000} />
                <p className="text-sm text-gray-500">800 people</p>
              </div>
            </div>
  
            <div className="bg-gray-50 rounded-2xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Alert Thresholds</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Warning Level</label>
                <input type="range" className="w-full" defaultValue={75} max={100} />
                <p className="text-sm text-gray-500">75%</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Critical Level</label>
                <input type="range" className="w-full" defaultValue={90} max={100} />
                <p className="text-sm text-gray-500">90%</p>
              </div>
              <button className="w-full py-2 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow">
                Update Thresholds
              </button>
            </div>
  
            <div className="bg-gray-50 rounded-2xl p-6 shadow flex flex-col justify-between">
              <div className="space-y-4">
                <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow">
                  Add New Zone
                </button>
                <button className="w-full py-2 bg-yellow-400 text-white font-semibold rounded-lg shadow">
                  Recalibrate Sensors
                </button>
                <button className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg shadow">
                  Emergency Zone Closure
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Last sensor calibration: 2 hours ago<br />
                System status: All sensors online
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  