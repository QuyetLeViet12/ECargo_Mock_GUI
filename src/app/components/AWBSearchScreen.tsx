import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, AlertCircle, Clock, ChevronRight, History } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useAWBHistory } from './useAWBHistory';
import { mockShipments } from './mockData';
import { motion, AnimatePresence } from 'motion/react';

export const AWBSearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [prefix, setPrefix] = useState('');
  const [serial, setSerial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ type: 'not_found' | 'system', message: string } | null>(null);
  
  const serialInputRef = useRef<HTMLInputElement>(null);
  const { history, addAWB } = useAWBHistory();

  const isFormValid = prefix.length === 3 && serial.length === 8;

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    setPrefix(val);
    if (error) setError(null);
    if (val.length === 3) {
      serialInputRef.current?.focus();
    }
  };

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    setSerial(val);
    if (error) setError(null);
  };

  const handleSearch = () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError(null);
    const awb = `${prefix}-${serial}`;

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (awb === '000-00000000') {
         setError({
           type: 'system',
           message: 'Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'
         });
         return;
      }
      
      const found = mockShipments[awb];
      if (found) {
        addAWB(awb);
        navigate(`/awb/${awb}`);
      } else {
        setError({
          type: 'not_found',
          message: `Không tìm thấy lô hàng với AWB ${awb}. Vui lòng kiểm tra lại số AWB hoặc liên hệ kho để được hỗ trợ.`
        });
      }
    }, 1000);
  };

  const handleHistoryClick = (awb: string) => {
    const [p, s] = awb.split('-');
    setPrefix(p);
    setSerial(s);
    setTimeout(() => {
      // Auto trigger search or just populate?
      // "Auto-fill vào form Prefix + Serial. Auto-trigger tra cứu hoặc yêu cầu bấm lại" 
      // Let's do auto-fill only for better UX if they want to modify it, or we can just redirect if they click it from history.
      // Redirecting is smoother for "quick access".
      navigate(`/awb/${awb}`);
    }, 100);
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-gray-50 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Theo dõi lô hàng</h1>
        <button 
          onClick={() => navigate('/history')}
          className="p-2 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Lịch sử tra cứu"
        >
          <History className="w-5 h-5" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 space-y-6 overflow-y-auto">
        
        {/* Section 1 - Description */}
        <div className="text-gray-600 text-sm leading-relaxed">
          Nhập số AWB để tra cứu trạng thái lô hàng (nhập/xuất) theo thời gian thực.
          <div className="mt-2 text-xs bg-blue-50 text-blue-800 p-2 rounded-lg border border-blue-100">
            <strong>AWB Thử nghiệm:</strong><br/>
            • 123-45678901 (Hàng Nhập)<br/>
            • 321-12345678 (Hàng Xuất)<br/>
            • 999-99999999 (Bất thường)<br/>
            • 000-00000000 (Lỗi hệ thống)
          </div>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-xl p-4 flex gap-3 shadow-sm ${
                error.type === 'not_found' ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  {error.type === 'not_found' ? 'Không tìm thấy lô hàng' : 'Lỗi hệ thống'}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {error.message}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant={error.type === 'not_found' ? 'secondary' : 'primary'}
                    size="sm"
                    className={error.type === 'not_found' ? 'bg-orange-100 text-orange-900 hover:bg-orange-200' : ''}
                    onClick={() => setError(null)}
                  >
                    Thử lại
                  </Button>
                  <Button variant="ghost" size="sm" className="opacity-90 hover:bg-black/5">
                    Liên hệ hỗ trợ
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Search */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex gap-3 items-start">
            <div className="w-[100px]">
              <Input
                label="Prefix"
                placeholder="123"
                value={prefix}
                onChange={handlePrefixChange}
                type="tel"
                maxLength={3}
                className="text-center font-medium tracking-widest text-lg"
              />
            </div>
            <div className="self-center mt-6 text-gray-400 font-bold">-</div>
            <div className="flex-1">
              <Input
                ref={serialInputRef}
                label="Serial"
                placeholder="45678901"
                value={serial}
                onChange={handleSerialChange}
                type="tel"
                maxLength={8}
                className="font-medium tracking-widest text-lg"
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold shadow-sm"
            disabled={!isFormValid}
            isLoading={isLoading}
            onClick={handleSearch}
          >
            {isLoading ? 'Đang tra cứu...' : 'Tra cứu'}
          </Button>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="saveHistory" 
              defaultChecked 
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="saveHistory" className="text-sm text-gray-600">
              Lưu AWB này vào lịch sử tra cứu
            </label>
          </div>
        </div>

        {/* Section 4 - Recent History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Đã tra cứu gần đây
            </h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {history.map((awb) => (
                <button
                  key={awb}
                  onClick={() => handleHistoryClick(awb)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
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
          </div>
        )}

      </main>

      {/* Footer Instructions */}
      <footer className="absolute bottom-0 w-full p-4 bg-gray-50/90 backdrop-blur-sm border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          <span className="font-semibold text-gray-700">Lưu ý:</span> AWB phải thuộc quyền truy cập của bạn. 
          Nếu không tìm thấy, vui lòng liên hệ kho để được hỗ trợ.
        </p>
      </footer>
    </motion.div>
  );
};
