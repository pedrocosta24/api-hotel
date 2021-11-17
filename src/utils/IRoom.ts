export interface IRoom {
  room_no: number;
  type: "single" | "double" | "king" | "deluxe";
  no_beds: number;
  capacity: number;
  ammenities: {
    wifi: boolean;
    tv: boolean;
    crib: boolean;
    airConditioning: boolean;
    iron: boolean;
    smokeAlarm: boolean;
  };
  price_night: number;
  reserved: IReserved[];
  images?: String[];
}

interface IReserved {
  from: Date;
  to: Date;
}
