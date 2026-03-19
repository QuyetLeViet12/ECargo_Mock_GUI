import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, MoreVertical, Plane, CheckCircle2, AlertTriangle, 
  MapPin, Clock, Box, FileText, ChevronRight, DollarSign, Menu, Info
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { mockShipments, ShipmentStatus, TimelineStep } from './mockData';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const ShipmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(mockShipments[id || '']);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    if (!shipment && id) {
      // Simulate loading/error state if not found
      navigate('/', { replace: true });
    }
  }, [id, shipment, navigate]);

  if (!shipment) return null; // Or a loading spinner

  const isImport = shipment.type === 'Import';

  // Helper to render timeline stepper
  const renderTimeline = () => {
    return (
      <div className="relative pl-6 space-y-8 mt-4 pb-2">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-6 left-[13px] w-px bg-gray-200" />
        
        {shipment.timeline.map((step, index) => {
          const isLast = index === shipment.timeline.length - 1;
          const isCurrent = step.isCurrent;
          const isCompleted = step.completed;

          return (
            <div key={step.status} className="relative flex items-start gap-4 z-10">
              {/* Dot / Icon */}
              <div 
                className={`flex-shrink-0 w-[14px] h-[14px] rounded-full border-2 mt-1.5 -ml-[33px] bg-white relative z-20 ${
                  isCurrent 
                    ? 'border-blue-600 bg-blue-100' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                }`}
              >
                {isCompleted && !isCurrent && (
                  <div className="absolute inset-0 bg-green-500 rounded-full scale-50" />
                )}
                {isCurrent && (
                  <div className="absolute inset-0 bg-blue-600 rounded-full scale-50 animate-pulse" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <span className={`font-semibold text-[15px] ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.status}
                    {isCurrent && (
                      <span className="ml-2 inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                        Hiện tại
                      </span>
                    )}
                  </span>
                  {step.time && (
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2 mt-0.5">
                      {step.time.split(' ')[0]} <br className="sm:hidden"/> 
                      <span className="text-[10px] text-gray-400">{step.time.split(' ')[1]}</span>
                    </span>
                  )}
                </div>
                
                {step.description && (
                  <p className="text-xs mt-1 leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-gray-50 pb-20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <header className="bg-blue-600 text-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between shadow-md">
        <button 
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center truncate px-2">Chi tiết lô hàng</h1>
        <div className="relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          
          {/* Dropdown menu */}
          {showMoreMenu && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Đăng ký lấy/gửi hàng</button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Chat với kho</button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Chia sẻ thông tin AWB</button>
            </div>
          )}
        </div>
      </header>

      {/* Warning Banner if there's an abnormality */}
      {shipment.abnormality?.reported && (
        <div className="bg-red-500 text-white px-4 py-3 flex gap-3 items-start shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-100" />
          <p className="text-sm font-medium leading-relaxed">
            Có bất thường được báo cáo về lô hàng này. Vui lòng xem thông tin chi tiết phía dưới.
          </p>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
        
        {/* Block A - Overview Header Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {shipment.awb}
            </h2>
            <Badge variant={isImport ? 'import' : 'export'} className="text-sm px-3 py-1">
              {isImport ? 'Hàng Nhập' : 'Hàng Xuất'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-4 bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-500 font-medium">Trạng thái hiện tại:</span>
            <span className={`text-sm font-bold ${shipment.abnormality?.reported ? 'text-red-600' : 'text-blue-700'}`}>
              {shipment.currentStatus}
            </span>
          </div>
        </div>

        {/* Abnormality Warning Block */}
        {shipment.abnormality?.reported && (
          <section className="bg-red-50 rounded-2xl p-5 border border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-800">Chi tiết Bất thường</h3>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-red-100">
              <p className="text-sm text-gray-800 font-medium leading-relaxed mb-4">
                "{shipment.abnormality.description}"
              </p>
              
              {shipment.abnormality.images && shipment.abnormality.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {shipment.abnormality.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <ImageWithFallback src={img} alt={`Abnormality image ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-red-50 text-xs text-gray-500">
                <span className="flex items-center justify-between">
                  <span>Người báo cáo:</span>
                  <span className="font-medium text-gray-700">{shipment.abnormality.reportedBy || 'Hệ thống'}</span>
                </span>
                <span className="flex items-center justify-between">
                  <span>Thời gian:</span>
                  <span className="font-medium text-gray-700">{shipment.abnormality.reportedAt || 'N/A'}</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Block B - Flight Info */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">Thông tin chuyến bay</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Chuyến bay</span>
              <span className="font-semibold text-gray-900">{shipment.flightInfo.flightNumber}</span>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              {!isImport && shipment.flightInfo.departureTime ? (
                <>
                  <div className="text-center">
                    <span className="block text-xs font-medium text-gray-400 mb-1">Cất cánh</span>
                    <span className="block font-bold text-gray-900">{shipment.flightInfo.departureTime.split(' ')[0]}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{shipment.flightInfo.departureTime.split(' ')[1]}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center px-2">
                    <div className="w-full h-px bg-gray-300 relative flex items-center justify-center">
                      <Plane className="w-4 h-4 text-gray-400 absolute bg-white px-0.5 transform -rotate-45 -translate-y-[1px]" />
                    </div>
                    <Badge variant={
                      shipment.flightInfo.status === 'Normal' ? 'success' :
                      shipment.flightInfo.status === 'Delay' ? 'warning' : 'error'
                    } className="mt-2 text-[10px]">
                      {shipment.flightInfo.status}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <span className="block text-xs font-medium text-gray-400 mb-1">Hạ cánh</span>
                    <span className="block font-bold text-gray-900">{shipment.flightInfo.arrivalTime?.split(' ')[0]}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{shipment.flightInfo.arrivalTime?.split(' ')[1]}</span>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <Badge variant={
                      shipment.flightInfo.status === 'Normal' ? 'success' :
                      shipment.flightInfo.status === 'Delay' ? 'warning' : 'error'
                    } className="text-[10px] mb-1">
                      {shipment.flightInfo.status}
                    </Badge>
                  </div>
                  <span className="block text-xs font-medium text-gray-400 mb-1">Hạ cánh dự kiến</span>
                  <span className="block font-bold text-lg text-gray-900">{shipment.flightInfo.arrivalTime?.split(' ')[0]}</span>
                  <span className="block text-sm text-gray-500 mt-1">{shipment.flightInfo.arrivalTime?.split(' ')[1]}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Block D - Timeline */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">Trạng thái lô hàng</h3>
          </div>
          {renderTimeline()}
        </section>

        {/* Grouping Cargo Details, Customs, Warehouse for better UI flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Block C - Cargo Details */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Thông tin hàng hóa</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Số kiện:</span>
                <span className="text-sm font-semibold text-gray-900">{shipment.cargoDetails.pieces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trọng lượng:</span>
                <span className="text-sm font-semibold text-gray-900">{shipment.cargoDetails.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Loại hàng:</span>
                <span className="text-sm font-semibold text-gray-900">{shipment.cargoDetails.description}</span>
              </div>
            </div>
          </section>

          {/* Block F - Warehouse Location */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Vị trí trong kho</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kho:</span>
                <span className="text-sm font-semibold text-gray-900">{shipment.warehouse.facility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Khu vực:</span>
                <span className="text-sm font-semibold text-gray-900">{shipment.warehouse.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Vị trí:</span>
                <span className="text-sm font-semibold text-blue-600">{shipment.warehouse.location}</span>
              </div>
            </div>
          </section>

          {/* Block E - Customs Status */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Trạng thái hải quan</h3>
            </div>
            <div className="flex items-center justify-between">
              {shipment.customs.cleared ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="block font-semibold text-green-700">Thông quan xong</span>
                    {shipment.customs.time && (
                      <span className="block text-xs text-gray-500 mt-0.5">Thời gian: {shipment.customs.time}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-orange-700">Chưa thông quan</span>
                </div>
              )}
            </div>
          </section>

          {/* Block G - Estimated Costs */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900">Chi phí dự kiến</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs text-gray-500 mb-0.5">Tổng chi phí dự kiến</span>
                <span className="block text-xl font-bold text-blue-700">
                  {shipment.estimatedCost.toLocaleString()} VND
                </span>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                Xem chi tiết
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-30 sm:absolute">
        <div className="flex gap-3 max-w-lg mx-auto w-full">
          <Button variant="secondary" className="flex-1 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700">
            Hỗ trợ
          </Button>
          <Button variant="primary" className="flex-[2] font-semibold shadow-sm">
            {isImport ? 'Đăng ký lấy hàng' : 'Đăng ký gửi hàng'}
          </Button>
        </div>
      </footer>
    </motion.div>
  );
};
