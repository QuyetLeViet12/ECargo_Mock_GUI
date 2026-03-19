export type ShipmentStatus =
  | 'Hạ cánh'
  | 'Khai thác xong'
  | 'Lưu kho'
  | 'Chi phí dự kiến'
  | 'Cân đo xong'
  | 'Thông quan xong'
  | 'Chất xếp xong'
  | 'Lên máy bay'
  | 'Theo dõi tại sân bay đến';

export type ShipmentType = 'Import' | 'Export';

export interface TimelineStep {
  status: ShipmentStatus;
  completed: boolean;
  time?: string;
  description?: string;
  isCurrent?: boolean;
}

export interface AbnormalityRecord {
  reported: boolean;
  description?: string;
  images?: string[];
  reportedAt?: string;
  reportedBy?: string;
}

export interface Shipment {
  awb: string;
  type: ShipmentType;
  currentStatus: string;
  flightInfo: {
    flightNumber: string;
    departureTime?: string;
    arrivalTime?: string;
    status: 'Normal' | 'Delay' | 'Cancel';
  };
  cargoDetails: {
    pieces: number;
    weight: number;
    description: string;
  };
  timeline: TimelineStep[];
  abnormality?: AbnormalityRecord;
  customs: {
    cleared: boolean;
    time?: string;
  };
  warehouse: {
    facility: string;
    zone: string;
    location: string;
  };
  estimatedCost: number;
}

export const mockShipments: Record<string, Shipment> = {
  '123-45678901': {
    awb: '123-45678901',
    type: 'Import',
    currentStatus: 'Lưu kho',
    flightInfo: {
      flightNumber: 'VN123',
      arrivalTime: '14:15 20/03/2026',
      status: 'Normal',
    },
    cargoDetails: {
      pieces: 10,
      weight: 500,
      description: 'Hàng điện tử',
    },
    timeline: [
      { status: 'Hạ cánh', completed: true, time: '14:15 20/03/2026' },
      { status: 'Khai thác xong', completed: true, time: '15:20 20/03/2026' },
      { status: 'Lưu kho', completed: true, time: '16:00 20/03/2026', isCurrent: true },
      { status: 'Chi phí dự kiến', completed: false },
    ],
    customs: {
      cleared: true,
      time: '16:00 20/03/2026',
    },
    warehouse: {
      facility: 'Kho sân bay',
      zone: 'Zone A',
      location: 'Kệ 3, Hàng 2',
    },
    estimatedCost: 5000000,
  },
  '321-12345678': {
    awb: '321-12345678',
    type: 'Export',
    currentStatus: 'Chất xếp xong',
    flightInfo: {
      flightNumber: 'VJ456',
      departureTime: '22:00 20/03/2026',
      arrivalTime: '02:00 21/03/2026',
      status: 'Delay',
    },
    cargoDetails: {
      pieces: 5,
      weight: 120,
      description: 'Hàng dệt may',
    },
    timeline: [
      { status: 'Lưu kho', completed: true, time: '18:00 20/03/2026' },
      { status: 'Cân đo xong', completed: true, time: '18:30 20/03/2026' },
      { status: 'Thông quan xong', completed: true, time: '19:15 20/03/2026' },
      { status: 'Chất xếp xong', completed: true, time: '21:00 20/03/2026', isCurrent: true },
      { status: 'Lên máy bay', completed: false },
      { status: 'Theo dõi tại sân bay đến', completed: false },
    ],
    customs: {
      cleared: true,
      time: '19:15 20/03/2026',
    },
    warehouse: {
      facility: 'Kho xuất khẩu',
      zone: 'Zone C',
      location: 'Khu tập kết 1',
    },
    estimatedCost: 2000000,
  },
  '999-99999999': {
    awb: '999-99999999',
    type: 'Import',
    currentStatus: 'Lưu kho (Có bất thường)',
    flightInfo: {
      flightNumber: 'QH789',
      arrivalTime: '11:00 21/03/2026',
      status: 'Normal',
    },
    cargoDetails: {
      pieces: 2,
      weight: 50,
      description: 'Hàng dễ vỡ',
    },
    timeline: [
      { status: 'Hạ cánh', completed: true, time: '11:00 21/03/2026' },
      { status: 'Khai thác xong', completed: true, time: '12:00 21/03/2026' },
      { status: 'Lưu kho', completed: true, time: '12:30 21/03/2026', isCurrent: true },
      { status: 'Chi phí dự kiến', completed: false },
    ],
    abnormality: {
      reported: true,
      description: 'Lô hàng xuống bị bẹp rách nát một phần, bên trong nghi ngờ bị ẩm ướt.',
      images: [
        'https://images.unsplash.com/photo-1771902875323-9c772bcfc9ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwY2FyZGJvYXJkJTIwYm94fGVufDF8fHx8MTc3MzkwNzcwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnVzaGVkJTIwZGVsaXZlcnklMjBwYWNrYWdlfGVufDF8fHx8MTc3MzkwNzcxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      reportedAt: '12:45 21/03/2026',
      reportedBy: 'NV Kho Nguyễn Văn A'
    },
    customs: {
      cleared: false,
    },
    warehouse: {
      facility: 'Kho xử lý sự cố',
      zone: 'Zone E',
      location: '-',
    },
    estimatedCost: 0,
  }
};