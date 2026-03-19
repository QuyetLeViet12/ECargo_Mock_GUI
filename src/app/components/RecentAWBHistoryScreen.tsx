import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, History, Search, Trash2, ChevronRight } from 'lucide-react';
import { useAWBHistory } from './useAWBHistory';
import { mockShipments } from './mockData';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

export const RecentAWBHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearHistory } = useAWBHistory();

  return (
    <motion.div 
      className="flex flex-col h-full bg-gray-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="bg-white px-4 py-4 border-b border-gray-100 flex items-center shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors mr-2 text-gray-700"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Lịch sử tra cứu</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 pt-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Lịch sử trống</h2>
              <p className="text-sm text-gray-500 mt-2">
                Chưa có AWB nào được tra cứu gần đây. <br />
                Hãy nhập AWB ở màn hình chính để bắt đầu theo dõi.
              </p>
            </div>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Về màn hình chính
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {history.map((awb) => (
                <button
                  key={awb}
                  onClick={() => navigate(`/awb/${awb}`)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 tracking-wide">{awb}</p>
                      {mockShipments[awb] && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          {mockShipments[awb].type === 'Import' ? (
                            <span className="text-blue-600 font-medium">Hàng Nhập</span>
                          ) : (
                            <span className="text-orange-600 font-medium">Hàng Xuất</span>
                          )}
                          • {mockShipments[awb].currentStatus}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={clearHistory}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xoá tất cả lịch sử
            </Button>
          </div>
        )}
      </main>
    </motion.div>
  );
};
